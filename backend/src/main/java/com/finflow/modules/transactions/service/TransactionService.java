package com.finflow.modules.transactions.service;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.repository.AccountRepository;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserStatus;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.transactions.domain.EntryType;
import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionEntry;
import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.domain.TransactionType;
import com.finflow.modules.transactions.dto.DepositRequest;
import com.finflow.modules.transactions.dto.MobilePaymentRequest;
import com.finflow.modules.transactions.dto.TransactionDetailResponse;
import com.finflow.modules.transactions.dto.TransactionSummaryResponse;
import com.finflow.modules.transactions.dto.TransferRequest;
import com.finflow.modules.transactions.dto.WithdrawalRequest;
import com.finflow.modules.transactions.mapper.TransactionMapper;
import com.finflow.modules.transactions.repository.TransactionRepository;
import com.finflow.modules.transactions.validator.TransactionValidator;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.util.SecurityUtil;
import com.finflow.modules.admin.events.AdminEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;
    private final TransactionValidator transactionValidator;
    private final AdminEventService adminEventService;

    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository,
                              UserRepository userRepository,
                              TransactionMapper transactionMapper,
                              TransactionValidator transactionValidator,
                              AdminEventService adminEventService) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.transactionMapper = transactionMapper;
        this.transactionValidator = transactionValidator;
        this.adminEventService = adminEventService;
    }

    @Transactional
    public TransactionDetailResponse createDeposit(DepositRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating deposit: userId={}, amountCents={}, accountId={}", userId, request.amountCents(), request.accountId());

        transactionValidator.validateAmountPositive(request.amountCents());
        transactionValidator.validateIdempotency(request.idempotencyKey());

        UUID accountId = UUID.fromString(request.accountId());
        Account account = transactionValidator.getAndValidateAccount(accountId);
        transactionValidator.validateAccountOperational(account);
        transactionValidator.validateAccountBelongsToUser(account, userId);

        String currency = request.currency() != null ? request.currency() : account.getCurrency();

        Transaction transaction = new Transaction(TransactionType.DEPOSIT, request.amountCents(), currency, userId);
        transaction.setTargetAccountId(request.accountId());
        transaction.setDescription(request.description());
        transaction.setIdempotencyKey(request.idempotencyKey());
        transaction.setReferenceNumber(generateReferenceNumber());

        long beforeCents = account.getAvailableBalanceCents();
        account.credit(request.amountCents());
        long afterCents = account.getAvailableBalanceCents();

        accountRepository.save(account);

        TransactionEntry creditEntry = new TransactionEntry(
                request.accountId(), EntryType.CREDIT, request.amountCents(),
                currency, beforeCents, afterCents, request.description());
        transaction.addEntry(creditEntry);

        transaction.markCompleted();
        transaction = transactionRepository.save(transaction);

        log.info("Deposit completed: txnId={}, ref={}", transaction.getId(), transaction.getReferenceNumber());
        return transactionMapper.toDetailResponse(transaction);
    }

    @Transactional
    public TransactionDetailResponse createWithdrawal(WithdrawalRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating withdrawal: userId={}, amountCents={}, accountId={}", userId, request.amountCents(), request.accountId());

        transactionValidator.validateAmountPositive(request.amountCents());
        transactionValidator.validateIdempotency(request.idempotencyKey());

        UUID accountId = UUID.fromString(request.accountId());
        Account account = transactionValidator.getAndValidateAccount(accountId);
        transactionValidator.validateAccountOperational(account);
        transactionValidator.validateAccountBelongsToUser(account, userId);

        String currency = request.currency() != null ? request.currency() : account.getCurrency();

        Transaction transaction = new Transaction(TransactionType.WITHDRAWAL, request.amountCents(), currency, userId);
        transaction.setSourceAccountId(request.accountId());
        transaction.setDescription(request.description());
        transaction.setIdempotencyKey(request.idempotencyKey());
        transaction.setReferenceNumber(generateReferenceNumber());

        long beforeCents = account.getAvailableBalanceCents();
        transactionValidator.validateSufficientBalance(account, request.amountCents());
        account.debit(request.amountCents());
        long afterCents = account.getAvailableBalanceCents();

        accountRepository.save(account);

        TransactionEntry debitEntry = new TransactionEntry(
                request.accountId(), EntryType.DEBIT, request.amountCents(),
                currency, beforeCents, afterCents, request.description());
        transaction.addEntry(debitEntry);

        transaction.markCompleted();
        transaction = transactionRepository.save(transaction);

        log.info("Withdrawal completed: txnId={}, ref={}", transaction.getId(), transaction.getReferenceNumber());
        return transactionMapper.toDetailResponse(transaction);
    }

    @Transactional
    public TransactionDetailResponse createTransfer(TransferRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Creating transfer: userId={}, amountCents={}, source={}, target={}",
                userId, request.amountCents(), request.sourceAccountId(), request.targetAccountId());

        transactionValidator.validateAmountPositive(request.amountCents());

        UUID sourceId = UUID.fromString(request.sourceAccountId());
        UUID targetId = UUID.fromString(request.targetAccountId());

        transactionValidator.validateSourceAndTargetDifferent(sourceId, targetId);
        transactionValidator.validateIdempotency(request.idempotencyKey());

        Account sourceAccount = transactionValidator.getAndValidateAccount(sourceId);
        Account targetAccount = transactionValidator.getAndValidateAccount(targetId);

        transactionValidator.validateAccountOperational(sourceAccount);
        transactionValidator.validateAccountOperational(targetAccount);
        transactionValidator.validateAccountBelongsToUser(sourceAccount, userId);

        String currency = request.currency() != null ? request.currency() : sourceAccount.getCurrency();
        transactionValidator.validateSameCurrency(sourceAccount, targetAccount, currency);

        Transaction transaction = new Transaction(TransactionType.TRANSFER, request.amountCents(), currency, userId);
        transaction.setSourceAccountId(request.sourceAccountId());
        transaction.setTargetAccountId(request.targetAccountId());
        transaction.setDescription(request.description());
        transaction.setIdempotencyKey(request.idempotencyKey());
        transaction.setReferenceNumber(generateReferenceNumber());

        long sourceBefore = sourceAccount.getAvailableBalanceCents();
        transactionValidator.validateSufficientBalance(sourceAccount, request.amountCents());
        sourceAccount.debit(request.amountCents());
        long sourceAfter = sourceAccount.getAvailableBalanceCents();

        long targetBefore = targetAccount.getAvailableBalanceCents();
        targetAccount.credit(request.amountCents());
        long targetAfter = targetAccount.getAvailableBalanceCents();

        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        TransactionEntry debitEntry = new TransactionEntry(
                request.sourceAccountId(), EntryType.DEBIT, request.amountCents(),
                currency, sourceBefore, sourceAfter,
                request.description() != null ? request.description() : "Transfer out");
        transaction.addEntry(debitEntry);

        TransactionEntry creditEntry = new TransactionEntry(
                request.targetAccountId(), EntryType.CREDIT, request.amountCents(),
                currency, targetBefore, targetAfter,
                request.description() != null ? request.description() : "Transfer in");
        transaction.addEntry(creditEntry);

        transaction.markCompleted();
        transaction = transactionRepository.save(transaction);

        log.info("Transfer completed: txnId={}, ref={}", transaction.getId(), transaction.getReferenceNumber());
        adminEventService.sendToAdmins("transaction", Map.of(
                "type", "TRANSACTION",
                "referenceNumber", transaction.getReferenceNumber(),
                "transactionType", transaction.getTransactionType().name(),
                "amountCents", request.amountCents(),
                "currency", currency,
                "userId", userId
        ));
        return transactionMapper.toDetailResponse(transaction);
    }

    /**
     * Executes a customer-to-customer payment resolved by the recipient's mobile
     * number. The sender's own account is debited and the recipient's account is
     * credited atomically within a single transaction.
     *
     * <p>Security invariants:
     * <ul>
     *   <li>The recipient is resolved server-side by mobile number — the client
     *       never supplies a recipient user/account ID.</li>
     *   <li>The source account must belong to the authenticated sender.</li>
     *   <li>Self-payment, unknown/inactive recipients, and insufficient balances
     *       are rejected.</li>
     *   <li>Debit + credit + transaction records commit/roll back together.</li>
     * </ul>
     */
    @Transactional
    public TransactionDetailResponse payByMobile(MobilePaymentRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Mobile payment: userId={}, amountCents={}, recipient={}",
                userId, request.amountCents(), request.recipientMobile());

        transactionValidator.validateAmountPositive(request.amountCents());
        transactionValidator.validateIdempotency(request.idempotencyKey());

        UUID sourceId = UUID.fromString(request.sourceAccountId());
        Account sourceAccount = transactionValidator.getAndValidateAccount(sourceId);
        transactionValidator.validateAccountOperational(sourceAccount);
        transactionValidator.validateAccountBelongsToUser(sourceAccount, userId);

        User recipient = userRepository.findByPhoneNumberAndIsDeletedFalse(request.recipientMobile())
                .orElseThrow(() -> new ValidationException(
                        "No active customer found for mobile number " + request.recipientMobile()));
        if (recipient.getId().toString().equals(userId)) {
            throw new ValidationException("You cannot send a payment to yourself");
        }
        if (recipient.getStatus() != UserStatus.ACTIVE) {
            throw new ValidationException("Recipient is not active");
        }

        UUID targetId = UUID.fromString(sourceAccount.getOwnerId());
        Account targetAccount;
        try {
            targetAccount = accountRepository.findByOwnerId(recipient.getId().toString(), org.springframework.data.domain.Pageable.unpaged())
                    .getContent().stream()
                    .filter(Account::isOperational)
                    .findFirst()
                    .orElseThrow(() -> new ValidationException("Recipient has no active account"));
        } catch (RuntimeException e) {
            throw new ValidationException("Recipient has no active account");
        }

        String currency = request.currency() != null ? request.currency() : sourceAccount.getCurrency();
        transactionValidator.validateSameCurrency(sourceAccount, targetAccount, currency);

        Transaction transaction = new Transaction(TransactionType.TRANSFER, request.amountCents(), currency, userId);
        transaction.setSourceAccountId(sourceAccount.getId().toString());
        transaction.setTargetAccountId(targetAccount.getId().toString());
        transaction.setDescription(request.description() != null ? request.description() : "Mobile payment to " + request.recipientMobile());
        transaction.setIdempotencyKey(request.idempotencyKey());
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setFailedReason(null);

        long sourceBefore = sourceAccount.getAvailableBalanceCents();
        transactionValidator.validateSufficientBalance(sourceAccount, request.amountCents());
        sourceAccount.debit(request.amountCents());
        long sourceAfter = sourceAccount.getAvailableBalanceCents();

        long targetBefore = targetAccount.getAvailableBalanceCents();
        targetAccount.credit(request.amountCents());
        long targetAfter = targetAccount.getAvailableBalanceCents();

        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        TransactionEntry debitEntry = new TransactionEntry(
                sourceAccount.getId().toString(), EntryType.DEBIT, request.amountCents(),
                currency, sourceBefore, sourceAfter,
                request.description() != null ? request.description() : "Mobile payment out");
        transaction.addEntry(debitEntry);

        TransactionEntry creditEntry = new TransactionEntry(
                targetAccount.getId().toString(), EntryType.CREDIT, request.amountCents(),
                currency, targetBefore, targetAfter,
                request.description() != null ? request.description() : "Mobile payment in");
        transaction.addEntry(creditEntry);

        transaction.markCompleted();
        transaction = transactionRepository.save(transaction);

        log.info("Mobile payment completed: txnId={}, ref={}", transaction.getId(), transaction.getReferenceNumber());
        adminEventService.sendToAdmins("transaction", Map.of(
                "type", "PAYMENT",
                "referenceNumber", transaction.getReferenceNumber(),
                "transactionType", transaction.getTransactionType().name(),
                "amountCents", request.amountCents(),
                "currency", currency,
                "senderUserId", userId,
                "recipientMobile", request.recipientMobile()
        ));
        return transactionMapper.toDetailResponse(transaction);
    }

    @Transactional(readOnly = true)
    public TransactionDetailResponse getTransaction(UUID transactionId) {
        String userId = SecurityUtil.getCurrentUserId();
        Transaction transaction = transactionValidator.getAndValidateTransaction(transactionId);
        transactionValidator.validateOwnership(transaction, userId);
        return transactionMapper.toDetailResponse(transaction);
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionSummaryResponse> getMyTransactions(
            TransactionType type, TransactionStatus status, String accountId,
            LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        String userId = SecurityUtil.getCurrentUserId();

        if (accountId != null) {
            Account account = accountRepository.findByIdAndIsDeletedFalse(UUID.fromString(accountId))
                    .orElseThrow(() -> new ResourceNotFoundException("Account", accountId));
            transactionValidator.validateAccountBelongsToUser(account, userId);
        }

        java.util.Set<String> accountIds = new java.util.HashSet<>();
        accountRepository.findByOwnerId(userId, Pageable.unpaged())
                .getContent().forEach(a -> accountIds.add(a.getId().toString()));

        Page<Transaction> page;
        if (accountIds.isEmpty()) {
            // No owned accounts: only show transactions the user initiated.
            // Avoids binding an empty collection to an SQL "IN (:ids)" clause,
            // which some drivers/dialects reject (a source of earlier 500s).
            page = transactionRepository.findMyTransactions(userId, type, status, accountId, fromDate, toDate, pageable);
        } else {
            page = transactionRepository.findCustomerVisible(
                    userId, accountIds, type, status, accountId, fromDate, toDate, pageable);
        }
        return PageResponse.of(
                transactionMapper.toSummaryResponseList(page.getContent()),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional
    public TransactionDetailResponse cancelTransaction(UUID transactionId) {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Cancelling transaction: txnId={}, userId={}", transactionId, userId);

        Transaction transaction = transactionValidator.getAndValidateTransaction(transactionId);
        transactionValidator.validateOwnership(transaction, userId);

        if (transaction.getTransactionStatus() != TransactionStatus.PENDING) {
            throw new com.finflow.shared.exception.ValidationException(
                    "Only PENDING transactions can be cancelled");
        }

        transaction.cancel();
        transaction = transactionRepository.save(transaction);

        log.info("Transaction cancelled: txnId={}", transactionId);
        return transactionMapper.toDetailResponse(transaction);
    }

    private String generateReferenceNumber() {
        return "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
