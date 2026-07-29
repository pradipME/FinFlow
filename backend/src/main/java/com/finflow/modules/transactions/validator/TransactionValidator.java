package com.finflow.modules.transactions.validator;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.repository.AccountRepository;
import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.repository.TransactionRepository;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TransactionValidator {

    private static final Logger log = LoggerFactory.getLogger(TransactionValidator.class);

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionValidator(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public Account getAndValidateAccount(UUID accountId) {
        Account account = accountRepository.findByIdAndIsDeletedFalse(accountId)
                .orElseThrow(() -> {
                    log.warn("Account not found: {}", accountId);
                    return new ResourceNotFoundException("Account", accountId.toString());
                });
        return account;
    }

    public void validateAccountOperational(Account account) {
        if (!account.isOperational()) {
            throw BusinessRuleException.accountFrozen();
        }
    }

    public void validateSufficientBalance(Account account, long amountCents) {
        if (account.getAvailableBalanceCents() < amountCents) {
            throw BusinessRuleException.insufficientBalance();
        }
    }

    public void validateSourceAndTargetDifferent(UUID sourceId, UUID targetId) {
        if (sourceId.equals(targetId)) {
            throw new ValidationException("Source and target accounts must be different");
        }
    }

    public void validateIdempotency(String idempotencyKey) {
        if (idempotencyKey != null) {
            transactionRepository.findByIdempotencyKey(idempotencyKey)
                    .ifPresent(existing -> {
                        throw new ValidationException("Duplicate request: transaction already exists with this idempotency key");
                    });
        }
    }

    public void validateAmountPositive(Long amountCents) {
        if (amountCents == null || amountCents <= 0) {
            throw new ValidationException("Amount must be positive");
        }
    }

    public Transaction getAndValidateTransaction(UUID transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> {
                    log.warn("Transaction not found: {}", transactionId);
                    return new ResourceNotFoundException("Transaction", transactionId.toString());
                });
    }

    public void validateOwnership(Transaction transaction, String userId) {
        if (!transaction.getUserId().equals(userId)) {
            log.warn("User {} attempted to access transaction {}", userId, transaction.getId());
            throw new ValidationException("You do not have access to this transaction");
        }
    }

    public void validateAccountBelongsToUser(Account account, String userId) {
        if (!account.getOwnerId().equals(userId)) {
            log.warn("User {} attempted to operate on account {}", userId, account.getId());
            throw new ValidationException("You do not have access to this account");
        }
    }
}
