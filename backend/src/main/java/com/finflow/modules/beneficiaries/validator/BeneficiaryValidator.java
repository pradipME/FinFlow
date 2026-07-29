package com.finflow.modules.beneficiaries.validator;

import com.finflow.modules.beneficiaries.domain.Beneficiary;
import com.finflow.modules.beneficiaries.repository.BeneficiaryRepository;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class BeneficiaryValidator {

    private static final Logger log = LoggerFactory.getLogger(BeneficiaryValidator.class);

    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryValidator(BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    public Beneficiary getAndValidateBeneficiary(UUID beneficiaryId, String ownerId) {
        return beneficiaryRepository.findByIdAndOwnerId(beneficiaryId, ownerId)
                .orElseThrow(() -> {
                    log.warn("Beneficiary not found: id={}, ownerId={}", beneficiaryId, ownerId);
                    return new ResourceNotFoundException("Beneficiary", beneficiaryId.toString());
                });
    }

    public void validateNoDuplicateAccount(String ownerId, String accountNumber) {
        if (beneficiaryRepository.existsByOwnerIdAndAccountNumberAndIsDeletedFalse(ownerId, accountNumber)) {
            throw new ValidationException("A beneficiary with this account number already exists");
        }
    }

    public void validateNoDuplicateAccountExcluding(
            String ownerId, String accountNumber, UUID excludeId) {
        beneficiaryRepository.findByIdAndOwnerId(excludeId, ownerId).ifPresent(existing -> {
            if (!existing.getAccountNumber().equals(accountNumber)) {
                validateNoDuplicateAccount(ownerId, accountNumber);
            }
        });
    }
}
