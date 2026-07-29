package com.finflow.modules.transactions.service;

import com.finflow.modules.accounts.domain.Account;
import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountType;
import com.finflow.modules.accounts.repository.AccountRepository;
import com.finflow.modules.transactions.domain.Transaction;
import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.domain.TransactionType;
import com.finflow.modules.transactions.dto.*;
import com.finflow.modules.transactions.mapper.TransactionMapper;
import com.finflow.modules.transactions.repository.TransactionRepository;
import com.finflow.modules.transactions.validator.TransactionValidator;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.util.SecurityUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock private TransactionRepository transactionRepository;
    @Mock private AccountRepository accountRepository;
    @Mock private TransactionMapper transactionMapper;
    @Mock private TransactionValidator transactionValidator;

    @InjectMocks private TransactionService transactionService;

    private UUID testUserId;
    private UUID testAccountId;
    private UUID testTargetAccountId;
    private Account testAccount;
    private Account testTargetAccount;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testAccountId = UUID.randomUUID();
        testTargetAccountId = UUID.randomUUID();

        testAccount = new Account(testUserId.toString(), "1234567890", AccountType.CHECKING, "USD");
        testAccount.setAccountStatus(AccountStatus.ACTIVE);
        testAccount.setLedgerBalanceCents(10000L);
        testAccount.setAvailableBalanceCents(10000L);

        testTargetAccount = new Account(testUserId.toString(), "0987654321", AccountType.SAVINGS, "USD");
        testTargetAccount.setAccountStatus(AccountStatus.ACTIVE);
        testTargetAccount.setLedgerBalanceCents(5000L);
        testTargetAccount.setAvailableBalanceCents(5000L);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(testUserId.toString(), null, java.util.Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private TransactionDetailResponse mockDetailResponse() {
        return new TransactionDetailResponse(
                UUID.randomUUID().toString(), TransactionType.DEPOSIT, TransactionStatus.COMPLETED,
                "Test", "TXN-001", 5000L, "USD", null, testAccountId.toString(),
                0L, testUserId.toString(), null, null, java.util.List.of(),
                "2026-01-01T00:00:00", "2026-01-01T00:00:00");
    }

    private void stubSaveAndMap() {
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction txn = inv.getArgument(0);
            return txn;
        });
        when(transactionMapper.toDetailResponse(any(Transaction.class))).thenReturn(mockDetailResponse());
    }

    @Nested
    @DisplayName("Create Deposit")
    class CreateDeposit {

        @Test
        @DisplayName("Should create a deposit successfully")
        void createDeposit_success() {
            DepositRequest request = new DepositRequest(
                    testAccountId.toString(), 5000L, "USD", "Payroll", null);

            when(transactionValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            stubSaveAndMap();

            transactionService.createDeposit(request);

            verify(transactionValidator).validateAccountOperational(testAccount);
            verify(transactionValidator).validateAccountBelongsToUser(testAccount, testUserId.toString());
            verify(accountRepository).save(testAccount);
            verify(transactionRepository).save(any(Transaction.class));

            assertThat(testAccount.getLedgerBalanceCents()).isEqualTo(15000L);
            assertThat(testAccount.getAvailableBalanceCents()).isEqualTo(15000L);
        }

        @Test
        @DisplayName("Should fail with zero amount")
        void createDeposit_zeroAmount() {
            DepositRequest request = new DepositRequest(
                    testAccountId.toString(), 0L, "USD", "Test", null);

            doThrow(new ValidationException("Amount must be positive"))
                    .when(transactionValidator).validateAmountPositive(0L);

            assertThatThrownBy(() -> transactionService.createDeposit(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("Amount must be positive");
        }

        @Test
        @DisplayName("Should fail if account not found")
        void createDeposit_accountNotFound() {
            DepositRequest request = new DepositRequest(
                    testAccountId.toString(), 5000L, "USD", "Test", null);

            when(transactionValidator.getAndValidateAccount(testAccountId))
                    .thenThrow(new ResourceNotFoundException("Account", testAccountId.toString()));

            assertThatThrownBy(() -> transactionService.createDeposit(request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("Should fail if account not operational")
        void createDeposit_accountNotOperational() {
            testAccount.setAccountStatus(AccountStatus.CLOSED);
            DepositRequest request = new DepositRequest(
                    testAccountId.toString(), 5000L, "USD", "Test", null);

            when(transactionValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            doThrow(BusinessRuleException.accountFrozen())
                    .when(transactionValidator).validateAccountOperational(testAccount);

            assertThatThrownBy(() -> transactionService.createDeposit(request))
                    .isInstanceOf(BusinessRuleException.class);
        }
    }

    @Nested
    @DisplayName("Create Withdrawal")
    class CreateWithdrawal {

        @Test
        @DisplayName("Should create a withdrawal successfully")
        void createWithdrawal_success() {
            WithdrawalRequest request = new WithdrawalRequest(
                    testAccountId.toString(), 2000L, "USD", "ATM", null);

            when(transactionValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            stubSaveAndMap();

            transactionService.createWithdrawal(request);

            verify(accountRepository).save(testAccount);
            verify(transactionRepository).save(any(Transaction.class));

            assertThat(testAccount.getLedgerBalanceCents()).isEqualTo(8000L);
            assertThat(testAccount.getAvailableBalanceCents()).isEqualTo(8000L);
        }

        @Test
        @DisplayName("Should fail with insufficient balance")
        void createWithdrawal_insufficientBalance() {
            WithdrawalRequest request = new WithdrawalRequest(
                    testAccountId.toString(), 20000L, "USD", "ATM", null);

            when(transactionValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);

            doThrow(BusinessRuleException.insufficientBalance())
                    .when(transactionValidator).validateSufficientBalance(testAccount, 20000L);

            assertThatThrownBy(() -> transactionService.createWithdrawal(request))
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("insufficient");
        }
    }

    @Nested
    @DisplayName("Create Transfer")
    class CreateTransfer {

        @Test
        @DisplayName("Should create a transfer successfully")
        void createTransfer_success() {
            TransferRequest request = new TransferRequest(
                    testAccountId.toString(), testTargetAccountId.toString(),
                    3000L, "USD", "Rent", null);

            when(transactionValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            when(transactionValidator.getAndValidateAccount(testTargetAccountId)).thenReturn(testTargetAccount);
            stubSaveAndMap();

            transactionService.createTransfer(request);

            verify(accountRepository, times(2)).save(any(Account.class));

            assertThat(testAccount.getAvailableBalanceCents()).isEqualTo(7000L);
            assertThat(testTargetAccount.getAvailableBalanceCents()).isEqualTo(8000L);
        }

        @Test
        @DisplayName("Should fail if same source and target")
        void createTransfer_sameAccount() {
            TransferRequest request = new TransferRequest(
                    testAccountId.toString(), testAccountId.toString(),
                    3000L, "USD", "Self", null);

            doThrow(new ValidationException("Source and target accounts must be different"))
                    .when(transactionValidator).validateSourceAndTargetDifferent(testAccountId, testAccountId);

            assertThatThrownBy(() -> transactionService.createTransfer(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("different");
        }

        @Test
        @DisplayName("Should fail if insufficient balance")
        void createTransfer_insufficientBalance() {
            TransferRequest request = new TransferRequest(
                    testAccountId.toString(), testTargetAccountId.toString(),
                    50000L, "USD", "Big transfer", null);

            when(transactionValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            when(transactionValidator.getAndValidateAccount(testTargetAccountId)).thenReturn(testTargetAccount);

            doThrow(BusinessRuleException.insufficientBalance())
                    .when(transactionValidator).validateSufficientBalance(testAccount, 50000L);

            assertThatThrownBy(() -> transactionService.createTransfer(request))
                    .isInstanceOf(BusinessRuleException.class);
        }
    }

    @Nested
    @DisplayName("Get Transaction")
    class GetTransaction {

        @Test
        @DisplayName("Should return transaction detail")
        void getTransaction_success() {
            UUID txnId = UUID.randomUUID();
            Transaction transaction = new Transaction(TransactionType.DEPOSIT, 5000L, "USD", testUserId.toString());
            transaction.markCompleted();

            when(transactionValidator.getAndValidateTransaction(txnId)).thenReturn(transaction);
            when(transactionMapper.toDetailResponse(transaction)).thenReturn(mockDetailResponse());

            TransactionDetailResponse result = transactionService.getTransaction(txnId);

            assertThat(result).isNotNull();
            verify(transactionValidator).validateOwnership(transaction, testUserId.toString());
        }

        @Test
        @DisplayName("Should fail if not found")
        void getTransaction_notFound() {
            UUID txnId = UUID.randomUUID();

            when(transactionValidator.getAndValidateTransaction(txnId))
                    .thenThrow(new ResourceNotFoundException("Transaction", txnId.toString()));

            assertThatThrownBy(() -> transactionService.getTransaction(txnId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Cancel Transaction")
    class CancelTransaction {

        @Test
        @DisplayName("Should cancel a pending transaction")
        void cancelTransaction_success() {
            UUID txnId = UUID.randomUUID();
            Transaction transaction = new Transaction(TransactionType.DEPOSIT, 5000L, "USD", testUserId.toString());

            when(transactionValidator.getAndValidateTransaction(txnId)).thenReturn(transaction);
            when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));
            when(transactionMapper.toDetailResponse(any(Transaction.class))).thenReturn(mockDetailResponse());

            TransactionDetailResponse result = transactionService.cancelTransaction(txnId);

            assertThat(result).isNotNull();
            verify(transactionRepository).save(transaction);
        }

        @Test
        @DisplayName("Should fail to cancel a completed transaction")
        void cancelTransaction_completed() {
            UUID txnId = UUID.randomUUID();
            Transaction transaction = new Transaction(TransactionType.DEPOSIT, 5000L, "USD", testUserId.toString());
            transaction.markCompleted();

            when(transactionValidator.getAndValidateTransaction(txnId)).thenReturn(transaction);

            assertThatThrownBy(() -> transactionService.cancelTransaction(txnId))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("PENDING");
        }
    }
}
