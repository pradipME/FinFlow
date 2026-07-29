package com.finflow.modules.accounts.service;

import com.finflow.modules.accounts.domain.*;
import com.finflow.modules.accounts.dto.*;
import com.finflow.modules.accounts.mapper.AccountMapper;
import com.finflow.modules.accounts.repository.*;
import com.finflow.modules.accounts.validator.AccountValidator;
import com.finflow.modules.accounts.validator.HoldValidator;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;
    @Mock
    private AccountHolderRepository accountHolderRepository;
    @Mock
    private AccountStatusHistoryRepository statusHistoryRepository;
    @Mock
    private HoldRepository holdRepository;
    @Mock
    private AccountMapper accountMapper;
    @Mock
    private AccountValidator accountValidator;
    @Mock
    private HoldValidator holdValidator;

    @InjectMocks
    private AccountService accountService;

    private Account testAccount;
    private UUID testAccountId;
    private String testUserId;

    @BeforeEach
    void setUp() {
        testAccountId = UUID.randomUUID();
        testUserId = UUID.randomUUID().toString();
        testAccount = new Account(testUserId, "1234567890", AccountType.CHECKING, "USD");
        testAccount.activate();
        testAccount.setLedgerBalanceCents(10000L);
        testAccount.setAvailableBalanceCents(8000L);

        var auth = new UsernamePasswordAuthenticationToken(
                testUserId, null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Create Account")
    class CreateAccount {

        @Test
        @DisplayName("Should create account successfully")
        void createAccount_success() {
            CreateAccountRequest request = new CreateAccountRequest(AccountType.CHECKING, "My Checking", "USD");
            AccountDetailResponse response = new AccountDetailResponse(
                    testAccountId.toString(), testUserId, "****7890",
                    AccountType.CHECKING, AccountStatus.ACTIVE, "My Checking", "USD",
                    10000L, 8000L, 0, List.of(),
                    LocalDateTime.now().toString(), LocalDateTime.now().toString());

            when(accountRepository.existsByAccountNumber(anyString())).thenReturn(false);
            when(accountRepository.save(any(Account.class))).thenReturn(testAccount);
            when(accountHolderRepository.save(any(AccountHolder.class))).thenAnswer(inv -> inv.getArgument(0));
            when(accountMapper.toDetailResponse(any(Account.class))).thenReturn(response);

            AccountDetailResponse result = accountService.createAccount(request);

            assertThat(result).isNotNull();
            assertThat(result.accountType()).isEqualTo(AccountType.CHECKING);
            verify(accountRepository).save(any(Account.class));
            verify(accountHolderRepository).save(any(AccountHolder.class));
        }
    }

    @Nested
    @DisplayName("Get Account")
    class GetAccount {

        @Test
        @DisplayName("Should return account details when user is owner")
        void getAccount_success() {
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);

            AccountDetailResponse response = new AccountDetailResponse(
                    testAccountId.toString(), testUserId, "****7890",
                    AccountType.CHECKING, AccountStatus.ACTIVE, null, "USD",
                    10000L, 8000L, 0, List.of(),
                    LocalDateTime.now().toString(), LocalDateTime.now().toString());
            when(accountMapper.toDetailResponse(testAccount)).thenReturn(response);

            AccountDetailResponse result = accountService.getAccount(testAccountId);

            assertThat(result).isNotNull();
            assertThat(result.id()).isEqualTo(testAccountId.toString());
        }

        @Test
        @DisplayName("Should throw when user is not account owner")
        void getAccount_notOwner() {
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            doThrow(new ValidationException("FORBIDDEN"))
                    .when(accountValidator).validateOwnership(eq(testAccount), eq(testUserId));

            assertThatThrownBy(() -> accountService.getAccount(testAccountId))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("FORBIDDEN");
        }
    }

    @Nested
    @DisplayName("Change Account Status")
    class ChangeStatus {

        @Test
        @DisplayName("Should restrict an active account")
        void changeStatus_restrict() {
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);

            AccountDetailResponse response = new AccountDetailResponse(
                    testAccountId.toString(), testUserId, "****7890",
                    AccountType.CHECKING, AccountStatus.RESTRICTED, null, "USD",
                    10000L, 8000L, 0, List.of(),
                    LocalDateTime.now().toString(), LocalDateTime.now().toString());
            when(accountMapper.toDetailResponse(any(Account.class))).thenReturn(response);

            ChangeStatusRequest request = new ChangeStatusRequest(AccountStatus.RESTRICTED, "Suspicious activity");

            AccountDetailResponse result = accountService.changeStatus(testAccountId, request);

            assertThat(result).isNotNull();
            verify(statusHistoryRepository).save(any(AccountStatusHistory.class));
        }

        @Test
        @DisplayName("Should throw when transitioning from closed")
        void changeStatus_fromClosed() {
            Account closedAccount = new Account(testUserId, "1234567890", AccountType.CHECKING, "USD");
            closedAccount.setLedgerBalanceCents(0L);
            closedAccount.close();

            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(closedAccount);
            doThrow(new ValidationException("Account is already closed"))
                    .when(accountValidator).validateStatusTransition(eq(closedAccount), eq(AccountStatus.ACTIVE));

            ChangeStatusRequest request = new ChangeStatusRequest(AccountStatus.ACTIVE, "Reopen");

            assertThatThrownBy(() -> accountService.changeStatus(testAccountId, request))
                    .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("Close Account")
    class CloseAccount {

        @Test
        @DisplayName("Should close account with zero balance")
        void closeAccount_success() {
            Account zeroBalanceAccount = new Account(testUserId, "1234567890", AccountType.CHECKING, "USD");
            zeroBalanceAccount.activate();
            zeroBalanceAccount.setLedgerBalanceCents(0L);
            zeroBalanceAccount.setAvailableBalanceCents(0L);
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(zeroBalanceAccount);

            AccountDetailResponse response = new AccountDetailResponse(
                    testAccountId.toString(), testUserId, "****7890",
                    AccountType.CHECKING, AccountStatus.CLOSED, null, "USD",
                    0L, 0L, 0, List.of(),
                    LocalDateTime.now().toString(), LocalDateTime.now().toString());
            when(accountMapper.toDetailResponse(any(Account.class))).thenReturn(response);

            AccountDetailResponse result = accountService.closeAccount(testAccountId);

            assertThat(result).isNotNull();
            assertThat(result.accountStatus()).isEqualTo(AccountStatus.CLOSED);
        }

        @Test
        @DisplayName("Should throw when account has balance")
        void closeAccount_hasBalance() {
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);

            assertThatThrownBy(() -> accountService.closeAccount(testAccountId))
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("non-zero balance");
        }
    }

    @Nested
    @DisplayName("Place Hold")
    class PlaceHold {

        @Test
        @DisplayName("Should place hold when sufficient balance")
        void placeHold_success() {
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);

            Hold hold = new Hold(testAccount, 2000L, "Test hold", "TRANSACTION", null, null);
            HoldResponse holdResponse = new HoldResponse(
                    UUID.randomUUID().toString(), 2000L, "Test hold",
                    "TRANSACTION", null, HoldStatus.ACTIVE, null, null,
                    LocalDateTime.now().toString());

            when(accountRepository.save(any(Account.class))).thenReturn(testAccount);
            when(holdRepository.save(any(Hold.class))).thenReturn(hold);
            when(accountMapper.toHoldResponse(any(Hold.class))).thenReturn(holdResponse);

            PlaceHoldRequest request = new PlaceHoldRequest(2000L, "Test hold", "TRANSACTION", null, null);

            HoldResponse result = accountService.placeHold(testAccountId, request);

            assertThat(result).isNotNull();
            assertThat(result.amountCents()).isEqualTo(2000L);
            verify(accountRepository).save(any(Account.class));
            verify(holdRepository).save(any(Hold.class));
        }

        @Test
        @DisplayName("Should throw when insufficient available balance")
        void placeHold_insufficientBalance() {
            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);

            PlaceHoldRequest request = new PlaceHoldRequest(50000L, "Too much", "TRANSACTION", null, null);

            assertThatThrownBy(() -> accountService.placeHold(testAccountId, request))
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("insufficient");
        }
    }

    @Nested
    @DisplayName("Release Hold")
    class ReleaseHold {

        @Test
        @DisplayName("Should release active hold")
        void releaseHold_success() {
            UUID holdId = UUID.randomUUID();
            Hold hold = new Hold(testAccount, 2000L, "Test", "TRANSACTION", null, null);

            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            when(holdValidator.getAndValidateHold(holdId)).thenReturn(hold);

            HoldResponse holdResponse = new HoldResponse(
                    holdId.toString(), 2000L, "Test", "TRANSACTION", null,
                    HoldStatus.RELEASED, LocalDateTime.now().toString(), null,
                    LocalDateTime.now().toString());
            when(accountMapper.toHoldResponse(any(Hold.class))).thenReturn(holdResponse);

            HoldResponse result = accountService.releaseHold(testAccountId, holdId);

            assertThat(result).isNotNull();
            assertThat(result.holdStatus()).isEqualTo(HoldStatus.RELEASED);
        }

        @Test
        @DisplayName("Should throw when releasing non-active hold")
        void releaseHold_notActive() {
            UUID holdId = UUID.randomUUID();
            Hold hold = new Hold(testAccount, 2000L, "Test", "TRANSACTION", null, null);
            hold.release(testUserId);

            when(accountValidator.getAndValidateAccount(testAccountId)).thenReturn(testAccount);
            when(holdValidator.getAndValidateHold(holdId)).thenReturn(hold);
            doThrow(new ValidationException("Hold is not active"))
                    .when(holdValidator).validateHoldActive(hold);

            assertThatThrownBy(() -> accountService.releaseHold(testAccountId, holdId))
                    .isInstanceOf(ValidationException.class);
        }
    }

    @Nested
    @DisplayName("Debit and Credit")
    class DebitCredit {

        @Test
        @DisplayName("Should credit account successfully")
        void credit_success() {
            testAccount.credit(5000L);

            assertThat(testAccount.getLedgerBalanceCents()).isEqualTo(15000L);
            assertThat(testAccount.getAvailableBalanceCents()).isEqualTo(13000L);
        }

        @Test
        @DisplayName("Should debit account successfully")
        void debit_success() {
            testAccount.debit(3000L);

            assertThat(testAccount.getLedgerBalanceCents()).isEqualTo(7000L);
            assertThat(testAccount.getAvailableBalanceCents()).isEqualTo(5000L);
        }

        @Test
        @DisplayName("Should throw on insufficient available balance for debit")
        void debit_insufficientBalance() {
            assertThatThrownBy(() -> testAccount.debit(50000L))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Insufficient");
        }

        @Test
        @DisplayName("Should throw on negative debit amount")
        void debit_negativeAmount() {
            assertThatThrownBy(() -> testAccount.debit(-100L))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }

    @Nested
    @DisplayName("Account Status Transitions")
    class StatusTransitions {

        @Test
        @DisplayName("Should activate pending account")
        void activate_pending() {
            Account pending = new Account(testUserId, "1234567890", AccountType.SAVINGS, "USD");
            pending.activate();
            assertThat(pending.getAccountStatus()).isEqualTo(AccountStatus.ACTIVE);
        }

        @Test
        @DisplayName("Should throw when activating active account")
        void activate_alreadyActive() {
            assertThatThrownBy(() -> testAccount.activate())
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Only PENDING");
        }

        @Test
        @DisplayName("Should restrict active account")
        void restrict_active() {
            testAccount.restrict("Fraud detected");
            assertThat(testAccount.getAccountStatus()).isEqualTo(AccountStatus.RESTRICTED);
        }

        @Test
        @DisplayName("Should throw when restricting closed account")
        void restrict_closed() {
            Account closed = new Account(testUserId, "1234567890", AccountType.CHECKING, "USD");
            closed.setLedgerBalanceCents(0L);
            closed.close();

            assertThatThrownBy(() -> closed.restrict("Test"))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("closed");
        }

        @Test
        @DisplayName("Should reactivate restricted account")
        void reactivate_restricted() {
            testAccount.restrict("Test");
            testAccount.reactivate();
            assertThat(testAccount.getAccountStatus()).isEqualTo(AccountStatus.ACTIVE);
        }

        @Test
        @DisplayName("Should throw when closing with balance")
        void close_hasBalance() {
            assertThatThrownBy(() -> testAccount.close())
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("non-zero balance");
        }

        @Test
        @DisplayName("Should throw when closing already closed account")
        void close_alreadyClosed() {
            Account closed = new Account(testUserId, "1234567890", AccountType.CHECKING, "USD");
            closed.setLedgerBalanceCents(0L);
            closed.close();

            assertThatThrownBy(() -> closed.close())
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("already closed");
        }
    }
}
