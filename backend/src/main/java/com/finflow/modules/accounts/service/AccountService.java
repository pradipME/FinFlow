package com.finflow.modules.accounts.service;

import com.finflow.modules.accounts.domain.*;
import com.finflow.modules.accounts.dto.*;
import com.finflow.modules.accounts.mapper.AccountMapper;
import com.finflow.modules.accounts.repository.*;
import com.finflow.modules.accounts.validator.AccountValidator;
import com.finflow.modules.accounts.validator.HoldValidator;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ConflictException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountService.class);

    private final AccountRepository accountRepository;
    private final AccountHolderRepository accountHolderRepository;
    private final AccountStatusHistoryRepository statusHistoryRepository;
    private final HoldRepository holdRepository;
    private final AccountMapper accountMapper;
    private final AccountValidator accountValidator;
    private final HoldValidator holdValidator;

    public AccountService(AccountRepository accountRepository,
                          AccountHolderRepository accountHolderRepository,
                          AccountStatusHistoryRepository statusHistoryRepository,
                          HoldRepository holdRepository,
                          AccountMapper accountMapper,
                          AccountValidator accountValidator,
                          HoldValidator holdValidator) {
        this.accountRepository = accountRepository;
        this.accountHolderRepository = accountHolderRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.holdRepository = holdRepository;
        this.accountMapper = accountMapper;
        this.accountValidator = accountValidator;
        this.holdValidator = holdValidator;
    }

    @Transactional
    public AccountDetailResponse createAccount(CreateAccountRequest request) {
        String currentUserId = SecurityUtil.getCurrentUserId();

        String accountNumber = generateUniqueAccountNumber();
        Account account = new Account(currentUserId, accountNumber, request.accountType(), request.currency());

        accountRepository.save(account);
        log.info("Account created: id={}, owner={}, type={}", account.getId(), currentUserId, request.accountType());

        AccountHolder holder = new AccountHolder(account, currentUserId, OwnershipType.PRIMARY);
        accountHolderRepository.save(holder);
        log.info("Primary holder added: accountId={}, userId={}", account.getId(), currentUserId);

        return accountMapper.toDetailResponse(account);
    }

    @Transactional(readOnly = true)
    public AccountDetailResponse getAccount(UUID accountId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);
        return accountMapper.toDetailResponse(account);
    }

    @Transactional(readOnly = true)
    public PageResponse<AccountSummaryResponse> getMyAccounts(
            AccountType accountType, AccountStatus status, Pageable pageable) {

        String currentUserId = SecurityUtil.getCurrentUserId();
        Page<Account> page;

        if (accountType != null && status != null) {
            page = accountRepository.findByOwnerIdAndTypeAndStatus(currentUserId, accountType, status, pageable);
        } else if (accountType != null) {
            page = accountRepository.findByOwnerIdAndType(currentUserId, accountType, pageable);
        } else if (status != null) {
            page = accountRepository.findByOwnerIdAndStatus(currentUserId, status, pageable);
        } else {
            page = accountRepository.findByOwnerId(currentUserId, pageable);
        }

        List<AccountSummaryResponse> content = accountMapper.toSummaryResponseList(page.getContent());
        return PageResponse.of(content, page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional
    public AccountDetailResponse updateAccount(UUID accountId, UpdateAccountRequest request) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);

        if (request.nickname() != null) {
            account.setNickname(request.nickname());
        }

        account = accountRepository.save(account);
        log.info("Account updated: id={}", accountId);
        return accountMapper.toDetailResponse(account);
    }

    @Transactional
    public AccountDetailResponse changeStatus(UUID accountId, ChangeStatusRequest request) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);

        AccountStatus previousStatus = account.getAccountStatus();
        accountValidator.validateStatusTransition(account, request.newStatus());

        switch (request.newStatus()) {
            case ACTIVE -> account.activate();
            case RESTRICTED -> account.restrict(request.reason());
            case SUSPENDED -> account.suspend();
            case CLOSED -> account.close();
            default -> throw new BusinessRuleException("INVALID_STATUS", "Cannot change status to " + request.newStatus());
        }

        accountRepository.save(account);

        AccountStatusHistory history = new AccountStatusHistory(
                account, previousStatus.name(), account.getAccountStatus().name(),
                request.reason(), currentUserId);
        statusHistoryRepository.save(history);

        log.info("Account status changed: id={}, {} -> {}", accountId, previousStatus, account.getAccountStatus());
        return accountMapper.toDetailResponse(account);
    }

    @Transactional
    public AccountDetailResponse closeAccount(UUID accountId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);

        if (account.getLedgerBalanceCents() != 0L) {
            throw new BusinessRuleException("ACCOUNT_HAS_BALANCE",
                    "Cannot close account with non-zero balance. Current balance: " + account.getLedgerBalanceCents());
        }

        AccountStatus previousStatus = account.getAccountStatus();
        account.close();
        accountRepository.save(account);

        AccountStatusHistory history = new AccountStatusHistory(
                account, previousStatus.name(), AccountStatus.CLOSED.name(),
                "Account closed by owner", currentUserId);
        statusHistoryRepository.save(history);

        log.info("Account closed: id={}", accountId);
        return accountMapper.toDetailResponse(account);
    }

    @Transactional(readOnly = true)
    public List<StatusHistoryResponse> getStatusHistory(UUID accountId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);

        List<AccountStatusHistory> history = statusHistoryRepository.findByAccountIdOrderByChangedAtDesc(accountId);
        return accountMapper.toStatusHistoryResponseList(history);
    }

    @Transactional
    public HoldResponse placeHold(UUID accountId, PlaceHoldRequest request) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);
        accountValidator.validateAccountOperational(account);

        if (account.getAvailableBalanceCents() < request.amountCents()) {
            throw BusinessRuleException.insufficientBalance();
        }

        account.placeHold(request.amountCents());
        accountRepository.save(account);

        LocalDateTime expiresAt = request.expiresAt() != null
                ? LocalDateTime.parse(request.expiresAt(), DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null;

        Hold hold = new Hold(account, request.amountCents(), request.reason(),
                request.sourceType(), request.sourceId(), expiresAt);
        holdRepository.save(hold);

        log.info("Hold placed: accountId={}, amount={}", accountId, request.amountCents());
        return accountMapper.toHoldResponse(hold);
    }

    @Transactional
    public HoldResponse releaseHold(UUID accountId, UUID holdId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);

        Hold hold = holdValidator.getAndValidateHold(holdId);
        holdValidator.validateHoldBelongsToAccount(hold, accountId);
        holdValidator.validateHoldActive(hold);

        hold.release(currentUserId);
        holdRepository.save(hold);

        account.releaseHold(hold.getAmountCents());
        accountRepository.save(account);

        log.info("Hold released: holdId={}, accountId={}", holdId, accountId);
        return accountMapper.toHoldResponse(hold);
    }

    @Transactional(readOnly = true)
    public List<HoldResponse> getActiveHolds(UUID accountId) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        Account account = accountValidator.getAndValidateAccount(accountId);
        accountValidator.validateOwnership(account, currentUserId);

        List<Hold> holds = holdRepository.findActiveHoldsByAccountId(accountId);
        return accountMapper.toHoldResponseList(holds);
    }

    @Transactional
    public void processExpiredHolds() {
        List<Hold> expiredHolds = holdRepository.findExpiredActiveHolds(LocalDateTime.now());
        for (Hold hold : expiredHolds) {
            hold.expire();
            holdRepository.save(hold);

            Account account = hold.getAccount();
            account.releaseHold(hold.getAmountCents());
            accountRepository.save(account);

            log.info("Hold expired and released: holdId={}, accountId={}", hold.getId(), account.getId());
        }
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        int attempts = 0;
        do {
            accountNumber = String.format("%010d", (long) (Math.random() * 10_000_000_000L));
            attempts++;
            if (attempts > 100) {
                throw new BusinessRuleException("ACCOUNT_NUMBER_GENERATION_FAILED",
                        "Failed to generate unique account number after 100 attempts");
            }
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
