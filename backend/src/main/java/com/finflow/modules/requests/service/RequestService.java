package com.finflow.modules.requests.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finflow.modules.accounts.domain.AccountType;
import com.finflow.modules.accounts.dto.AccountDetailResponse;
import com.finflow.modules.accounts.service.AccountService;
import com.finflow.modules.cards.domain.CardType;
import com.finflow.modules.cards.dto.CardResponse;
import com.finflow.modules.cards.service.CardService;
import com.finflow.modules.requests.domain.CustomerRequest;
import com.finflow.modules.requests.domain.CustomerRequestStatus;
import com.finflow.modules.requests.domain.CustomerRequestType;
import com.finflow.modules.requests.dto.CustomerRequestResponse;
import com.finflow.modules.requests.dto.CreateRequestRequest;
import com.finflow.modules.requests.dto.RequestDetails;
import com.finflow.modules.requests.repository.CustomerRequestRepository;
import com.finflow.modules.admin.events.AdminEventService;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
public class RequestService {

    private static final Logger log = LoggerFactory.getLogger(RequestService.class);

    private final CustomerRequestRepository requestRepository;
    private final AccountService accountService;
    private final CardService cardService;
    private final ObjectMapper objectMapper;
    private final AdminEventService adminEventService;

    public RequestService(CustomerRequestRepository requestRepository,
                          AccountService accountService,
                          CardService cardService,
                          ObjectMapper objectMapper,
                          AdminEventService adminEventService) {
        this.requestRepository = requestRepository;
        this.accountService = accountService;
        this.cardService = cardService;
        this.objectMapper = objectMapper;
        this.adminEventService = adminEventService;
    }

    protected void requireAdmin() {
        if (!SecurityUtil.isAdmin() && !SecurityUtil.isSuperAdmin()) {
            throw new ValidationException("Admin access required");
        }
    }

    // ---------------- Customer endpoints ----------------

    @Transactional
    public CustomerRequestResponse createRequest(CreateRequestRequest request) {
        String customerId = SecurityUtil.getCurrentUserId();
        RequestDetails details = request.details() != null ? request.details() : RequestDetails.empty();
        validateRequestDetails(request.requestType(), details, request.targetAccountId());

        String detailsJson = serialize(details);
        CustomerRequest entity = new CustomerRequest(customerId, request.requestType(),
                request.targetAccountId(), detailsJson);
        entity = requestRepository.save(entity);
        log.info("Customer request created: id={}, type={}, customer={}",
                entity.getId(), request.requestType(), customerId);
        adminEventService.sendToAdmins("new-request", Map.of(
                "type", "CUSTOMER_REQUEST",
                "requestId", entity.getId().toString(),
                "requestType", request.requestType().name(),
                "customerId", customerId
        ));
        return toResponse(entity);
    }

    @Transactional(readOnly = true)
    public PageResponse<CustomerRequestResponse> getMyRequests(Pageable pageable) {
        String customerId = SecurityUtil.getCurrentUserId();
        Page<CustomerRequest> page = requestRepository.findByCustomerId(customerId, pageable);
        return PageResponse.of(page.getContent().stream().map(this::toResponse).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    // ---------------- Admin endpoints ----------------

    @Transactional(readOnly = true)
    public PageResponse<CustomerRequestResponse> getAllRequests(CustomerRequestStatus status, Pageable pageable) {
        requireAdmin();
        Page<CustomerRequest> page = requestRepository.findByStatus(status, pageable);
        return PageResponse.of(page.getContent().stream().map(this::toResponse).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional
    public CustomerRequestResponse approve(UUID requestId) {
        requireAdmin();
        String adminId = SecurityUtil.getCurrentUserId();
        CustomerRequest entity = getPending(requestId);

        switch (entity.getRequestType()) {
            case ACCOUNT_REQUEST -> {
                RequestDetails d = deserialize(entity.getDetails());
                AccountType type = parseAccountType(d.accountType());
                AccountDetailResponse created = accountService.createAccountForCustomer(
                        entity.getCustomerId(), type, d.currency(), d.nickname());
                log.info("Account created via approved request: accountId={}, customer={}",
                        created.id(), entity.getCustomerId());
            }
            case CARD_REQUEST -> {
                if (entity.getTargetAccountId() == null) {
                    throw new ValidationException("Card request has no target account");
                }
                RequestDetails d = deserialize(entity.getDetails());
                CardType type = parseCardType(d.cardType());
                CardResponse created = cardService.createCardForCustomer(
                        entity.getCustomerId(), entity.getTargetAccountId(), type,
                        d.cardholderName(), d.creditLimitCents(), d.dailyLimitCents(),
                        d.monthlyLimitCents(), d.currency());
                log.info("Card created via approved request: cardId={}, customer={}",
                        created.id(), entity.getCustomerId());
            }
            default -> throw new BusinessRuleException("INVALID_REQUEST", "Unsupported request type");
        }

        entity.approve(adminId);
        entity = requestRepository.save(entity);
        adminEventService.sendToAdmins("request-review", Map.of(
                "type", "REQUEST_APPROVED",
                "requestId", entity.getId().toString(),
                "requestType", entity.getRequestType().name(),
                "customerId", entity.getCustomerId()
        ));
        return toResponse(entity);
    }

    @Transactional
    public CustomerRequestResponse reject(UUID requestId, String reason) {
        requireAdmin();
        String adminId = SecurityUtil.getCurrentUserId();
        CustomerRequest entity = getPending(requestId);
        entity.reject(adminId, reason);
        entity = requestRepository.save(entity);
        log.info("Customer request rejected: id={}", requestId);
        adminEventService.sendToAdmins("request-review", Map.of(
                "type", "REQUEST_REJECTED",
                "requestId", entity.getId().toString(),
                "requestType", entity.getRequestType().name(),
                "customerId", entity.getCustomerId()
        ));
        return toResponse(entity);
    }

    private CustomerRequest getPending(UUID requestId) {
        CustomerRequest entity = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerRequest", requestId.toString()));
        if (entity.getRequestStatus() != CustomerRequestStatus.PENDING) {
            throw new BusinessRuleException("REQUEST_NOT_PENDING",
                    "Only PENDING requests can be reviewed");
        }
        return entity;
    }

    private void validateRequestDetails(CustomerRequestType type, RequestDetails details, String targetAccountId) {
        if (type == null) {
            throw new ValidationException("requestType is required");
        }
        switch (type) {
            case CARD_REQUEST -> {
                if (targetAccountId == null || targetAccountId.isBlank()) {
                    throw new ValidationException("targetAccountId is required for CARD_REQUEST");
                }
                if (details.cardType() == null || details.cardholderName() == null || details.cardholderName().isBlank()) {
                    throw new ValidationException("cardType and cardholderName are required for CARD_REQUEST");
                }
                parseCardType(details.cardType());
            }
            case ACCOUNT_REQUEST -> {
                parseAccountType(details.accountType());
            }
            default -> throw new BusinessRuleException("INVALID_REQUEST", "Unsupported request type");
        }
    }

    private AccountType parseAccountType(String raw) {
        try {
            return AccountType.valueOf(raw);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ValidationException("Invalid or missing accountType");
        }
    }

    private CardType parseCardType(String raw) {
        try {
            return CardType.valueOf(raw);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ValidationException("Invalid or missing cardType");
        }
    }

    private String serialize(RequestDetails details) {
        try {
            return objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException e) {
            throw new BusinessRuleException("INTERNAL_ERROR", "Failed to serialize request details");
        }
    }

    private RequestDetails deserialize(String json) {
        if (json == null || json.isBlank()) {
            return RequestDetails.empty();
        }
        try {
            return objectMapper.readValue(json, RequestDetails.class);
        } catch (JsonProcessingException e) {
            return RequestDetails.empty();
        }
    }

    private CustomerRequestResponse toResponse(CustomerRequest e) {
        return new CustomerRequestResponse(
                e.getId().toString(),
                e.getCustomerId(),
                e.getRequestType(),
                e.getRequestStatus(),
                e.getTargetAccountId(),
                deserialize(e.getDetails()),
                e.getReviewedBy(),
                e.getReviewedAt() != null ? e.getReviewedAt().toString() : null,
                e.getRejectionReason(),
                e.getCreatedAt() != null ? e.getCreatedAt().toString() : null
        );
    }
}