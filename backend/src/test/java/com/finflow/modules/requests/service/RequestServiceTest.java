package com.finflow.modules.requests.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finflow.modules.accounts.dto.AccountDetailResponse;
import com.finflow.modules.accounts.service.AccountService;
import com.finflow.modules.cards.dto.CardResponse;
import com.finflow.modules.cards.service.CardService;
import com.finflow.modules.requests.domain.CustomerRequest;
import com.finflow.modules.requests.domain.CustomerRequestStatus;
import com.finflow.modules.requests.domain.CustomerRequestType;
import com.finflow.modules.requests.dto.CreateRequestRequest;
import com.finflow.modules.requests.dto.CustomerRequestResponse;
import com.finflow.modules.requests.dto.RequestDetails;
import com.finflow.modules.requests.dto.ReviewRequestRequest;
import com.finflow.modules.requests.repository.CustomerRequestRepository;
import com.finflow.modules.admin.events.AdminEventService;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RequestService Unit Tests")
class RequestServiceTest {

    @Mock private CustomerRequestRepository requestRepository;
    @Mock private AccountService accountService;
    @Mock private CardService cardService;
    @Mock private AdminEventService adminEventService;

    private RequestService service;
    private String customerId;
    private String adminId;
    private UUID requestId;

    @BeforeEach
    void setUp() {
        service = new RequestService(requestRepository, accountService, cardService, new ObjectMapper(), adminEventService);
        customerId = UUID.randomUUID().toString();
        adminId = UUID.randomUUID().toString();
        requestId = UUID.randomUUID();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticate(String userId, String role) {
        var auth = new UsernamePasswordAuthenticationToken(
                userId, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private CustomerRequest buildRequest(CustomerRequestType type, CustomerRequestStatus status, String details) {
        CustomerRequest req = new CustomerRequest(customerId, type, null, details);
        ReflectionTestUtils.setField(req, "id", requestId);
        if (status == CustomerRequestStatus.APPROVED) {
            req.approve(adminId);
        } else if (status == CustomerRequestStatus.REJECTED) {
            req.reject(adminId, "Missing KYC");
        }
        return req;
    }

    @Nested
    @DisplayName("Create request")
    class CreateRequest {

        @Test
        @DisplayName("customer can submit an ACCOUNT_REQUEST")
        void submitAccountRequest() {
            authenticate(customerId, "CUSTOMER");
            CreateRequestRequest req = new CreateRequestRequest(
                    CustomerRequestType.ACCOUNT_REQUEST, null,
                    new RequestDetails("SAVINGS", "My Savings", "USD", null, null, null, null, null));

            CustomerRequest saved = new CustomerRequest(customerId, CustomerRequestType.ACCOUNT_REQUEST, null,
                    "{\"accountType\":\"SAVINGS\",\"nickname\":\"My Savings\",\"currency\":\"USD\"}");
            ReflectionTestUtils.setField(saved, "id", requestId);
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(saved);

            CustomerRequestResponse resp = service.createRequest(req);
            assertThat(resp.requestStatus()).isEqualTo(CustomerRequestStatus.PENDING);
            assertThat(resp.requestType()).isEqualTo(CustomerRequestType.ACCOUNT_REQUEST);
        }

        @Test
        @DisplayName("CARD_REQUEST requires a target account")
        void cardRequestRequiresTargetAccount() {
            authenticate(customerId, "CUSTOMER");
            CreateRequestRequest req = new CreateRequestRequest(
                    CustomerRequestType.CARD_REQUEST, null,
                    new RequestDetails(null, null, null, "DEBIT", "John Doe", null, null, null));

            assertThatThrownBy(() -> service.createRequest(req))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("targetAccountId");
        }
    }

    @Nested
    @DisplayName("Admin review")
    class Review {

        @Test
        @DisplayName("approving ACCOUNT_REQUEST creates an ACTIVE account for the customer")
        void approveAccountRequest() {
            authenticate(adminId, "ADMIN");
            CustomerRequest pending = buildRequest(CustomerRequestType.ACCOUNT_REQUEST,
                    CustomerRequestStatus.PENDING, "{\"accountType\":\"CHECKING\",\"nickname\":null,\"currency\":\"USD\"}");
            when(requestRepository.findById(requestId)).thenReturn(Optional.of(pending));
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(pending);
            when(accountService.createAccountForCustomer(eq(customerId), any(), eq("USD"), isNull()))
                    .thenReturn(mock(AccountDetailResponse.class));

            CustomerRequestResponse resp = service.approve(requestId);

            assertThat(resp.requestStatus()).isEqualTo(CustomerRequestStatus.APPROVED);
            verify(accountService).createAccountForCustomer(eq(customerId), any(), eq("USD"), isNull());
            verify(cardService, never()).createCardForCustomer(anyString(), anyString(), any(), anyString(), isNull(), isNull(), isNull(), isNull());
        }

        @Test
        @DisplayName("approving CARD_REQUEST creates a card for the customer")
        void approveCardRequest() {
            authenticate(adminId, "ADMIN");
            String accountId = UUID.randomUUID().toString();
            CustomerRequest pending = new CustomerRequest(customerId, CustomerRequestType.CARD_REQUEST,
                    accountId, "{\"cardType\":\"DEBIT\",\"cardholderName\":\"John Doe\",\"currency\":\"USD\"}");
            ReflectionTestUtils.setField(pending, "id", requestId);
            when(requestRepository.findById(requestId)).thenReturn(Optional.of(pending));
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(pending);
            when(cardService.createCardForCustomer(eq(customerId), eq(accountId), any(), eq("John Doe"),
                    isNull(), isNull(), isNull(), eq("USD"))).thenReturn(mock(CardResponse.class));

            CustomerRequestResponse resp = service.approve(requestId);

            assertThat(resp.requestStatus()).isEqualTo(CustomerRequestStatus.APPROVED);
            verify(cardService).createCardForCustomer(eq(customerId), eq(accountId), any(), eq("John Doe"),
                    isNull(), isNull(), isNull(), eq("USD"));
            verify(accountService, never()).createAccountForCustomer(anyString(), any(), anyString(), anyString());
        }

        @Test
        @DisplayName("rejecting a request records the reason")
        void rejectRequest() {
            authenticate(adminId, "ADMIN");
            CustomerRequest pending = buildRequest(CustomerRequestType.ACCOUNT_REQUEST,
                    CustomerRequestStatus.PENDING, "{}");
            when(requestRepository.findById(requestId)).thenReturn(Optional.of(pending));
            when(requestRepository.save(any(CustomerRequest.class))).thenReturn(pending);

            CustomerRequestResponse resp = service.reject(requestId, "Insufficient documentation");

            assertThat(resp.requestStatus()).isEqualTo(CustomerRequestStatus.REJECTED);
            assertThat(resp.rejectionReason()).isEqualTo("Insufficient documentation");
            verify(accountService, never()).createAccountForCustomer(anyString(), any(), anyString(), anyString());
        }

        @Test
        @DisplayName("a non-admin cannot approve a request")
        void nonAdminCannotApprove() {
            authenticate(customerId, "CUSTOMER");
            assertThatThrownBy(() -> service.approve(requestId))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("Admin access required");
        }

        @Test
        @DisplayName("cannot approve a request twice")
        void approveTwiceRejected() {
            authenticate(adminId, "ADMIN");
            CustomerRequest alreadyApproved = buildRequest(CustomerRequestType.ACCOUNT_REQUEST,
                    CustomerRequestStatus.APPROVED, "{}");
            when(requestRepository.findById(requestId)).thenReturn(Optional.of(alreadyApproved));
            assertThatThrownBy(() -> service.approve(requestId))
                    .isInstanceOf(com.finflow.shared.exception.BusinessRuleException.class);
        }
    }

    @Nested
    @DisplayName("List requests")
    class ListRequests {

        @Test
        @DisplayName("customer sees only their own requests")
        void myRequests() {
            authenticate(customerId, "CUSTOMER");
            CustomerRequest req = buildRequest(CustomerRequestType.ACCOUNT_REQUEST,
                    CustomerRequestStatus.PENDING, "{}");
            Page<CustomerRequest> page = new PageImpl<>(List.of(req), PageRequest.of(0, 20), 1);
            when(requestRepository.findByCustomerId(customerId, PageRequest.of(0, 20))).thenReturn(page);

            var resp = service.getMyRequests(PageRequest.of(0, 20));

            assertThat(resp.content()).hasSize(1);
            assertThat(resp.content().get(0).customerId()).isEqualTo(customerId);
        }

        @Test
        @DisplayName("a non-admin cannot list all requests")
        void nonAdminCannotListAll() {
            authenticate(customerId, "CUSTOMER");
            assertThatThrownBy(() -> service.getAllRequests(null, PageRequest.of(0, 20)))
                    .isInstanceOf(ValidationException.class);
        }
    }
}