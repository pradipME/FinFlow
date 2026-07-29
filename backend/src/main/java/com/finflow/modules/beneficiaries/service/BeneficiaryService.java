package com.finflow.modules.beneficiaries.service;

import com.finflow.modules.beneficiaries.domain.Beneficiary;
import com.finflow.modules.beneficiaries.domain.BeneficiaryStatus;
import com.finflow.modules.beneficiaries.dto.BeneficiaryResponse;
import com.finflow.modules.beneficiaries.dto.CreateBeneficiaryRequest;
import com.finflow.modules.beneficiaries.dto.UpdateBeneficiaryRequest;
import com.finflow.modules.beneficiaries.mapper.BeneficiaryMapper;
import com.finflow.modules.beneficiaries.repository.BeneficiaryRepository;
import com.finflow.modules.beneficiaries.validator.BeneficiaryValidator;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class BeneficiaryService {

    private static final Logger log = LoggerFactory.getLogger(BeneficiaryService.class);

    private final BeneficiaryRepository beneficiaryRepository;
    private final BeneficiaryMapper beneficiaryMapper;
    private final BeneficiaryValidator beneficiaryValidator;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository,
                              BeneficiaryMapper beneficiaryMapper,
                              BeneficiaryValidator beneficiaryValidator) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.beneficiaryMapper = beneficiaryMapper;
        this.beneficiaryValidator = beneficiaryValidator;
    }

    @Transactional
    public BeneficiaryResponse createBeneficiary(CreateBeneficiaryRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating beneficiary: userId={}, name={}", userId, request.beneficiaryName());

        beneficiaryValidator.validateNoDuplicateAccount(userId, request.accountNumber());

        String currency = request.currency() != null ? request.currency() : "USD";

        Beneficiary beneficiary = new Beneficiary(userId, request.beneficiaryName(), request.accountNumber());
        beneficiary.setNickname(request.nickname());
        beneficiary.setEmail(request.email());
        beneficiary.setBankName(request.bankName());
        beneficiary.setRoutingNumber(request.routingNumber());
        beneficiary.setIban(request.iban());
        beneficiary.setSwiftCode(request.swiftCode());
        beneficiary.setCurrency(currency);

        beneficiary = beneficiaryRepository.save(beneficiary);
        log.info("Beneficiary created: id={}", beneficiary.getId());
        return beneficiaryMapper.toResponse(beneficiary);
    }

    @Transactional(readOnly = true)
    public BeneficiaryResponse getBeneficiary(UUID beneficiaryId) {
        String userId = SecurityUtil.getCurrentUserId();
        Beneficiary beneficiary = beneficiaryValidator.getAndValidateBeneficiary(beneficiaryId, userId);
        return beneficiaryMapper.toResponse(beneficiary);
    }

    @Transactional(readOnly = true)
    public PageResponse<BeneficiaryResponse> getMyBeneficiaries(Pageable pageable) {
        String userId = SecurityUtil.getCurrentUserId();
        Page<Beneficiary> page = beneficiaryRepository.findByOwnerId(userId, pageable);
        return PageResponse.of(
                beneficiaryMapper.toResponseList(page.getContent()),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional
    public BeneficiaryResponse updateBeneficiary(UUID beneficiaryId, UpdateBeneficiaryRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Updating beneficiary: id={}, userId={}", beneficiaryId, userId);

        Beneficiary beneficiary = beneficiaryValidator.getAndValidateBeneficiary(beneficiaryId, userId);

        if (request.beneficiaryName() != null) beneficiary.setBeneficiaryName(request.beneficiaryName());
        if (request.nickname() != null) beneficiary.setNickname(request.nickname());
        if (request.email() != null) beneficiary.setEmail(request.email());
        if (request.bankName() != null) beneficiary.setBankName(request.bankName());
        if (request.accountNumber() != null) {
            beneficiaryValidator.validateNoDuplicateAccountExcluding(
                    userId, request.accountNumber(), beneficiaryId);
            beneficiary.setAccountNumber(request.accountNumber());
        }
        if (request.routingNumber() != null) beneficiary.setRoutingNumber(request.routingNumber());
        if (request.iban() != null) beneficiary.setIban(request.iban());
        if (request.swiftCode() != null) beneficiary.setSwiftCode(request.swiftCode());
        if (request.currency() != null) beneficiary.setCurrency(request.currency());

        beneficiary = beneficiaryRepository.save(beneficiary);
        log.info("Beneficiary updated: id={}", beneficiaryId);
        return beneficiaryMapper.toResponse(beneficiary);
    }

    @Transactional
    public void deleteBeneficiary(UUID beneficiaryId) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Deleting beneficiary: id={}, userId={}", beneficiaryId, userId);

        Beneficiary beneficiary = beneficiaryValidator.getAndValidateBeneficiary(beneficiaryId, userId);
        beneficiary.softDelete(userId);
        beneficiaryRepository.save(beneficiary);

        log.info("Beneficiary deleted: id={}", beneficiaryId);
    }

    @Transactional
    public BeneficiaryResponse changeStatus(UUID beneficiaryId, BeneficiaryStatus newStatus) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Changing beneficiary status: id={}, status={}, userId={}", beneficiaryId, newStatus, userId);

        Beneficiary beneficiary = beneficiaryValidator.getAndValidateBeneficiary(beneficiaryId, userId);

        switch (newStatus) {
            case ACTIVE -> beneficiary.activate();
            case INACTIVE -> beneficiary.deactivate();
            case BLOCKED -> beneficiary.block();
        }

        beneficiary = beneficiaryRepository.save(beneficiary);
        log.info("Beneficiary status changed: id={}, status={}", beneficiaryId, newStatus);
        return beneficiaryMapper.toResponse(beneficiary);
    }
}
