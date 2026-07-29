package com.finflow.modules.accounts.validator;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.repository.AccountRepository;
import com.finflow.shared.constants.ErrorCodes;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AccountValidator {

    private final AccountRepository accountRepository;

    public AccountValidator(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account getAndValidateAccount(UUID accountId) {
        return accountRepository.findByIdAndIsDeletedFalse(accountId)
            .orElseThrow(() -> new ResourceNotFoundException("Account", accountId.toString()));
    }

    public void validateOwnership(Account account, String currentUserId) {
        if (!account.getOwnerId().equals(currentUserId)) {
            throw new ValidationException(ErrorCodes.FORBIDDEN);
        }
    }

    public void validateStatusTransition(Account account, AccountStatus newStatus) {
        AccountStatus current = account.getAccountStatus();

        if (current == AccountStatus.CLOSED) {
            throw new ValidationException("Account is already closed");
        }

        switch (newStatus) {
            case ACTIVE -> {
                if (current != AccountStatus.PENDING && current != AccountStatus.RESTRICTED && current != AccountStatus.SUSPENDED) {
                    throw new ValidationException("Invalid status transition from " + current + " to " + newStatus);
                }
            }
            case RESTRICTED -> {
                if (current == AccountStatus.CLOSED || current == AccountStatus.RESTRICTED) {
                    throw new ValidationException("Invalid status transition from " + current + " to " + newStatus);
                }
            }
            case SUSPENDED -> {
                if (current == AccountStatus.CLOSED || current == AccountStatus.SUSPENDED) {
                    throw new ValidationException("Invalid status transition from " + current + " to " + newStatus);
                }
            }
            case CLOSED -> {
                if (current == AccountStatus.CLOSED) {
                    throw new ValidationException("Account is already closed");
                }
                if (account.getLedgerBalanceCents() != 0L) {
                    throw new ValidationException("Cannot close account with non-zero balance");
                }
            }
            default -> throw new ValidationException("Invalid status transition from " + current + " to " + newStatus);
        }
    }

    public void validateAccountOperational(Account account) {
        if (!account.isOperational()) {
            throw new ValidationException("Account is not operational (status: " + account.getAccountStatus() + ")");
        }
    }
}
