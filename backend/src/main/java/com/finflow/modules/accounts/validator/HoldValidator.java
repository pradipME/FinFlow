package com.finflow.modules.accounts.validator;

import com.finflow.modules.accounts.domain.Hold;
import com.finflow.modules.accounts.domain.HoldStatus;
import com.finflow.modules.accounts.repository.HoldRepository;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class HoldValidator {

    private final HoldRepository holdRepository;

    public HoldValidator(HoldRepository holdRepository) {
        this.holdRepository = holdRepository;
    }

    public Hold getAndValidateHold(UUID holdId) {
        return holdRepository.findById(holdId)
            .orElseThrow(() -> new ResourceNotFoundException("Hold", holdId.toString()));
    }

    public void validateHoldBelongsToAccount(Hold hold, UUID accountId) {
        if (!hold.getAccount().getId().equals(accountId)) {
            throw new ValidationException("Hold does not belong to this account");
        }
    }

    public void validateHoldActive(Hold hold) {
        if (hold.getHoldStatus() != HoldStatus.ACTIVE) {
            throw new ValidationException("Hold is not active (status: " + hold.getHoldStatus() + ")");
        }
    }
}
