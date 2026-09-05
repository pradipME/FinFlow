package com.finflow.modules.admin.service;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.dto.AccountDetailResponse;
import com.finflow.modules.accounts.repository.AccountRepository;
import com.finflow.modules.accounts.service.AccountService;
import com.finflow.modules.admin.domain.AdminAuditLog;
import com.finflow.modules.admin.dto.AdminCreateAccountRequest;
import com.finflow.modules.admin.dto.AdminCreateCustomerRequest;
import com.finflow.modules.admin.dto.AdminDashboardResponse;
import com.finflow.modules.admin.dto.AuditLogResponse;
import com.finflow.modules.admin.dto.CustomerDetailResponse;
import com.finflow.modules.admin.dto.FundAccountRequest;
import com.finflow.modules.admin.dto.UserManagementResponse;
import com.finflow.modules.admin.mapper.AdminMapper;
import com.finflow.modules.admin.repository.AdminAuditLogRepository;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserRole;
import com.finflow.modules.auth.domain.UserStatus;
import com.finflow.modules.auth.dto.RegisterRequest;
import com.finflow.modules.auth.dto.RegisterResponse;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.repository.UserRoleRepository;
import com.finflow.modules.auth.service.RegistrationService;
import com.finflow.modules.cards.domain.Card;
import com.finflow.modules.cards.domain.CardStatus;
import com.finflow.modules.cards.dto.CardResponse;
import com.finflow.modules.cards.repository.CardRepository;
import com.finflow.modules.requests.domain.CustomerRequestStatus;
import com.finflow.modules.requests.domain.CustomerRequestType;
import com.finflow.modules.requests.repository.CustomerRequestRepository;
import com.finflow.modules.transactions.domain.EntryType;
import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionEntry;
import com.finflow.modules.transactions.domain.TransactionType;
import com.finflow.modules.transactions.dto.TransactionDetailResponse;
import com.finflow.modules.transactions.dto.TransactionSummaryResponse;
import com.finflow.modules.transactions.mapper.TransactionMapper;
import com.finflow.modules.transactions.repository.TransactionRepository;
import com.finflow.modules.transactions.validator.TransactionValidator;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.util.SecurityUtil;
import com.finflow.modules.admin.events.AdminEvent;
import com.finflow.modules.admin.events.AdminEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final AdminAuditLogRepository auditLogRepository;
    private final AdminMapper adminMapper;
    private final AccountRepository accountRepository;
    private final AccountService accountService;
    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final TransactionValidator transactionValidator;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RegistrationService registrationService;
    private final CustomerRequestRepository customerRequestRepository;
    private final AdminEventService adminEventService;

    public AdminService(AdminAuditLogRepository auditLogRepository,
                        AdminMapper adminMapper,
                        AccountRepository accountRepository,
                        AccountService accountService,
                        CardRepository cardRepository,
                        TransactionRepository transactionRepository,
                        TransactionMapper transactionMapper,
                        TransactionValidator transactionValidator,
                        UserRepository userRepository,
                        UserRoleRepository userRoleRepository,
                        RegistrationService registrationService,
                        CustomerRequestRepository customerRequestRepository,
                        AdminEventService adminEventService) {
        this.auditLogRepository = auditLogRepository;
        this.adminMapper = adminMapper;
        this.accountRepository = accountRepository;
        this.accountService = accountService;
        this.cardRepository = cardRepository;
        this.transactionRepository = transactionRepository;
        this.transactionMapper = transactionMapper;
        this.transactionValidator = transactionValidator;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.registrationService = registrationService;
        this.customerRequestRepository = customerRequestRepository;
        this.adminEventService = adminEventService;
    }

    private void requireAdmin() {
        if (!SecurityUtil.isAdmin() && !SecurityUtil.isSuperAdmin()) {
            throw new BusinessRuleException("FORBIDDEN", "Admin access required");
        }
    }

    private String adminId() {
        return SecurityUtil.getCurrentUserId();
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> getAuditLogs(Pageable pageable) {
        requireAdmin();
        Page<AdminAuditLog> page = auditLogRepository.findAllLogs(pageable);
        return PageResponse.of(
            page.getContent().stream().map(adminMapper::toAuditLogResponse).toList(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements()
        );
    }

    public AuditLogResponse logAction(String adminUserId, String action, String targetType, String targetId, String details) {
        AdminAuditLog logRecord = new AdminAuditLog(adminUserId, action, targetType, targetId, details, null);
        return adminMapper.toAuditLogResponse(auditLogRepository.save(logRecord));
    }

    // ---------------- Dashboard ----------------

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        requireAdmin();
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatusAndIsDeletedFalse(UserStatus.ACTIVE);
        long totalAccounts = accountRepository.count();
        long activeAccounts = accountRepository.countByAccountStatusAndIsDeletedFalse(AccountStatus.ACTIVE);
        long totalCards = cardRepository.count();
        long activeCards = cardRepository.countByCardStatus(CardStatus.ACTIVE);
        long totalFundsCents = accountRepository.sumAvailableBalanceCents();
        long pendingAccountRequests = customerRequestRepository.countByRequestTypeAndRequestStatus(
                CustomerRequestType.ACCOUNT_REQUEST, CustomerRequestStatus.PENDING);
        long pendingCardRequests = customerRequestRepository.countByRequestTypeAndRequestStatus(
                CustomerRequestType.CARD_REQUEST, CustomerRequestStatus.PENDING);
        long pendingRequests = pendingAccountRequests + pendingCardRequests;
        long recentCustomerRequests = customerRequestRepository.countByRequestStatusAndCreatedAtGreaterThan(
                CustomerRequestStatus.PENDING, LocalDateTime.now().minusDays(7));
        long totalTransactions = transactionRepository.count();
        long recentTransactions = transactionRepository.countSince(LocalDateTime.now().minusDays(7));
        return new AdminDashboardResponse(
                totalUsers, activeUsers,
                totalAccounts, activeAccounts,
                totalCards, activeCards,
                totalFundsCents,
                pendingAccountRequests, pendingCardRequests, pendingRequests,
                recentCustomerRequests,
                totalTransactions, recentTransactions);
    }

    // ---------------- User management ----------------

    @Transactional(readOnly = true)
    public PageResponse<UserManagementResponse> getUserList(Pageable pageable) {
        requireAdmin();
        Page<User> page = userRepository.findAll(pageable);
        return PageResponse.of(page.getContent().stream().map(this::toUserManagement).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    private String getUserRole(UUID userId) {
        List<UserRole> roles = userRoleRepository.findByUserId(userId);
        if (roles.isEmpty()) {
            return "CUSTOMER";
        }
        return roles.stream()
                .filter(ur -> ur.getRole() != null)
                .findFirst()
                .map(ur -> ur.getRole().getName())
                .orElse("CUSTOMER");
    }

    private UserManagementResponse toUserManagement(User user) {
        String role = getUserRole(user.getId());
        return new UserManagementResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getUsername(),
                user.getPhoneNumber(),
                role,
                user.getStatus() != null ? user.getStatus().name() : "ACTIVE",
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );
    }

    // ---------------- Customer management ----------------

    /**
     * Provisions a new customer record as an admin. Reuses the registration flow
     * (validation, password hashing, CUSTOMER role assignment) so behavior stays
     * consistent with self-registration, while terms are accepted on the customer's
     * behalf at the point of admin provisioning.
     */
    public UserManagementResponse createCustomer(AdminCreateCustomerRequest request) {
        requireAdmin();
        RegisterRequest registerRequest = new RegisterRequest(
                request.email(), request.phoneNumber(), request.username(), request.password(), true);
        RegisterResponse created = registrationService.register(registerRequest);
        logAction(adminId(), "CUSTOMER_CREATE", "USER", created.id().toString(),
                "Provisioned customer " + created.email());
        adminEventService.sendToAdmins("new-customer", Map.of(
                "type", "CUSTOMER_CREATE",
                "userId", created.id().toString(),
                "email", created.email()
        ));
        return new UserManagementResponse(
                created.id().toString(),
                created.email(),
                created.username(),
                created.phoneNumber(),
                "CUSTOMER",
                created.status(),
                created.createdAt() != null ? created.createdAt().toString() : null
        );
    }

    @Transactional(readOnly = true)
    public CustomerDetailResponse getUserDetails(String userId) {
        requireAdmin();
        User user = getUserOrThrow(userId);
        UserManagementResponse summary = toUserManagement(user);
        long accountCount = accountRepository.countByOwnerId(userId);
        long cardCount = cardRepository.countByOwnerId(userId);
        long pendingRequestCount = customerRequestRepository.countByCustomerIdAndRequestStatus(
                userId, CustomerRequestStatus.PENDING);
        return new CustomerDetailResponse(
                summary.id(), summary.email(), summary.fullName(), summary.phoneNumber(), summary.role(), summary.status(),
                summary.createdAt(), accountCount, cardCount, pendingRequestCount);
    }

    // ---------------- Account management ----------------

    @Transactional(readOnly = true)
    public PageResponse<AccountDetailResponse> getAccounts(Pageable pageable) {
        requireAdmin();
        Page<Account> page = accountRepository.findAll(pageable);
        return PageResponse.of(
                page.getContent().stream().map(accountService::toAdminAccountDetail).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public AccountDetailResponse getAccount(UUID accountId) {
        requireAdmin();
        Account account = accountRepository.findByIdAndIsDeletedFalse(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", accountId.toString()));
        return accountService.toAdminAccountDetail(account);
    }

    public AccountDetailResponse createAccountForCustomer(AdminCreateAccountRequest request) {
        requireAdmin();
        User customer = getUserOrThrow(request.customerId());
        AccountDetailResponse created = accountService.createAccountForCustomer(
                customer.getId().toString(), request.accountType(), request.currency(), request.nickname());
        logAction(adminId(), "ACCOUNT_CREATE", "ACCOUNT", created.id(),
                "Created " + request.accountType() + " account for customer " + request.customerId());
        adminEventService.sendToAdmins("new-account-request", Map.of(
                "type", "ACCOUNT_CREATE",
                "accountId", created.id(),
                "customerId", request.customerId()
        ));
        return created;
    }

    /**
     * Funds a customer account as an ADMIN, producing a real DEPOSIT transaction and
     * atomically crediting the account balance. This is the bank-style funding path.
     */
    @Transactional(readOnly = false)
    public TransactionDetailResponse fundAccount(UUID accountId, FundAccountRequest request) {
        requireAdmin();
        String adminUserId = adminId();
        transactionValidator.validateAmountPositive(request.amountCents());

        Account account = accountRepository.findByIdAndLock(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", accountId.toString()));
        transactionValidator.validateAccountOperational(account);
        if (account.getOwnerId().equals(adminUserId)) {
            throw new ValidationException("Cannot fund an account owned by an admin in this flow");
        }

        String currency = account.getCurrency();

        Transaction transaction = new Transaction(TransactionType.DEPOSIT, request.amountCents(), currency, adminUserId);
        transaction.setTargetAccountId(accountId.toString());
        transaction.setDescription(request.description() != null ? request.description() : "Admin funding");
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setIdempotencyKey("ADMIN-FUND-" + UUID.randomUUID());

        long beforeCents = account.getAvailableBalanceCents();
        account.credit(request.amountCents());
        long afterCents = account.getAvailableBalanceCents();
        accountRepository.save(account);

        TransactionEntry creditEntry = new TransactionEntry(
                accountId.toString(), EntryType.CREDIT, request.amountCents(),
                currency, beforeCents, afterCents, "Admin funding");
        transaction.addEntry(creditEntry);
        transaction.markCompleted();
        transaction = transactionRepository.save(transaction);

        logAction(adminUserId, "ACCOUNT_FUND", "ACCOUNT", accountId.toString(),
                "Credited " + request.amountCents() + " " + currency);
        adminEventService.sendToAdmins("account-funded", Map.of(
                "type", "ACCOUNT_FUND",
                "accountId", accountId.toString(),
                "amountCents", request.amountCents(),
                "currency", currency,
                "referenceNumber", transaction.getReferenceNumber()
        ));

        log.info("Admin funded account: accountId={}, amountCents={}, txn={}",
                accountId, request.amountCents(), transaction.getReferenceNumber());
        return transactionMapper.toDetailResponse(transaction);
    }

    // ---------------- Card management ----------------

    @Transactional(readOnly = true)
    public PageResponse<CardResponse> getCards(Pageable pageable) {
        requireAdmin();
        Page<Card> page = cardRepository.findAll(pageable);
        return PageResponse.of(page.getContent().stream().map(this::toCardResponse).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public CardResponse getCard(UUID cardId) {
        requireAdmin();
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card", cardId.toString()));
        return toCardResponse(card);
    }

    @Transactional(readOnly = true)
    public PageResponse<CardResponse> getCardsByAccount(String accountId) {
        requireAdmin();
        var cards = cardRepository.findByAccountId(accountId);
        return PageResponse.of(cards.stream().map(this::toCardResponse).toList(),
                0, cards.size(), cards.size());
    }

    @Transactional(readOnly = true)
    public PageResponse<CardResponse> getCardsByUser(String userId, Pageable pageable) {
        requireAdmin();
        getUserOrThrow(userId);
        Page<Card> page = cardRepository.findByOwnerId(userId, pageable);
        return PageResponse.of(page.getContent().stream().map(this::toCardResponse).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    // ---------------- Transaction management ----------------

    @Transactional(readOnly = true)
    public PageResponse<TransactionSummaryResponse> getTransactions(Pageable pageable) {
        requireAdmin();
        Page<Transaction> page = transactionRepository.findAll(pageable);
        return PageResponse.of(
                transactionMapper.toSummaryResponseList(page.getContent()),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public TransactionDetailResponse getTransaction(UUID transactionId) {
        requireAdmin();
        return transactionMapper.toDetailResponse(
                transactionValidator.getAndValidateTransaction(transactionId));
    }

    @Transactional(readOnly = true)
    public PageResponse<AccountDetailResponse> getAccountsByUser(String userId, Pageable pageable) {
        requireAdmin();
        getUserOrThrow(userId);
        Page<Account> page = accountRepository.findByOwnerId(userId, pageable);
        return PageResponse.of(page.getContent().stream().map(accountService::toAdminAccountDetail).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements());
    }

    // ---------------- Helpers ----------------

    private User getUserOrThrow(String userId) {
        UUID uuid;
        try {
            uuid = UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid customer id");
        }
        return userRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    private CardResponse toCardResponse(Card card) {
        return new CardResponse(
                card.getId().toString(),
                card.getAccountId(),
                card.getCardLastFour(),
                card.getCardType(),
                card.getCardStatus(),
                card.getCardholderName(),
                card.getExpiryMonth(),
                card.getExpiryYear(),
                card.getCreditLimitCents(),
                card.getDailyLimitCents(),
                card.getMonthlyLimitCents(),
                card.getCurrency(),
                card.getPinSet() != null ? card.getPinSet() : false,
                card.getCreatedAt() != null ? card.getCreatedAt().toString() : null
        );
    }

    private String generateReferenceNumber() {
        return "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}