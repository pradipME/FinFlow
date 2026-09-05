package com.finflow.modules.admin.service;

import com.finflow.modules.accounts.repository.AccountRepository;
import com.finflow.modules.accounts.service.AccountService;
import com.finflow.modules.admin.domain.AdminAuditLog;
import com.finflow.modules.admin.dto.AdminDashboardResponse;
import com.finflow.modules.admin.dto.AuditLogResponse;
import com.finflow.modules.admin.dto.UserManagementResponse;
import com.finflow.modules.admin.events.AdminEventService;
import com.finflow.modules.admin.mapper.AdminMapper;
import com.finflow.modules.admin.repository.AdminAuditLogRepository;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.repository.UserRoleRepository;
import com.finflow.modules.auth.service.RegistrationService;
import com.finflow.modules.cards.repository.CardRepository;
import com.finflow.modules.requests.repository.CustomerRequestRepository;
import com.finflow.modules.transactions.mapper.TransactionMapper;
import com.finflow.modules.transactions.repository.TransactionRepository;
import com.finflow.modules.transactions.validator.TransactionValidator;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.util.SecurityUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AdminAuditLogRepository auditLogRepository;
    @Mock
    private AdminMapper adminMapper;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private AccountService accountService;
    @Mock
    private CardRepository cardRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private TransactionMapper transactionMapper;
    @Mock
    private TransactionValidator transactionValidator;
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserRoleRepository userRoleRepository;
    @Mock
    private RegistrationService registrationService;
    @Mock
    private CustomerRequestRepository customerRequestRepository;
    @Mock
    private AdminEventService adminEventService;

    @InjectMocks
    private AdminService adminService;

    private String testAdminUserId;
    private UUID testLogId;

    @BeforeEach
    void setUp() {
        testAdminUserId = UUID.randomUUID().toString();
        testLogId = UUID.randomUUID();
    }

    private void authenticateAsAdmin() {
        var auth = new UsernamePasswordAuthenticationToken(
                testAdminUserId, null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Get Audit Logs")
    class GetAuditLogs {

        @Test
        @DisplayName("Should return paginated audit logs for admin user")
        void getAuditLogs_success() {
            authenticateAsAdmin();
            AdminAuditLog log = new AdminAuditLog(testAdminUserId, "CREATE_USER", "User", "target-123", "Created user", null);
            ReflectionTestUtils.setField(log, "id", testLogId);

            AuditLogResponse response = new AuditLogResponse(
                    testLogId.toString(), testAdminUserId, "CREATE_USER", "User", "target-123", "Created user", null, null);

            Pageable pageable = PageRequest.of(0, 20);
            Page<AdminAuditLog> page = new PageImpl<>(List.of(log), pageable, 1);

            when(auditLogRepository.findAllLogs(pageable)).thenReturn(page);
            when(adminMapper.toAuditLogResponse(log)).thenReturn(response);

            PageResponse<AuditLogResponse> result = adminService.getAuditLogs(pageable);

            assertThat(result).isNotNull();
            assertThat(result.content()).hasSize(1);
            assertThat(result.content().get(0).action()).isEqualTo("CREATE_USER");
            verify(auditLogRepository).findAllLogs(pageable);
        }

        @Test
        @DisplayName("Should throw when non-admin user tries to get audit logs")
        void getAuditLogs_notAdmin() {
            var auth = new UsernamePasswordAuthenticationToken(
                    testAdminUserId, null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
            SecurityContextHolder.getContext().setAuthentication(auth);

            Pageable pageable = PageRequest.of(0, 20);

            assertThatThrownBy(() -> adminService.getAuditLogs(pageable))
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("Admin access required");
        }
    }

    @Nested
    @DisplayName("Log Action")
    class LogAction {

        @Test
        @DisplayName("Should create audit log entry successfully")
        void logAction_success() {
            AdminAuditLog log = new AdminAuditLog(testAdminUserId, "UPDATE_USER", "User", "user-123", "Updated profile", null);
            ReflectionTestUtils.setField(log, "id", testLogId);

            AuditLogResponse response = new AuditLogResponse(
                    testLogId.toString(), testAdminUserId, "UPDATE_USER", "User", "user-123", "Updated profile", null, null);

            when(auditLogRepository.save(any(AdminAuditLog.class))).thenReturn(log);
            when(adminMapper.toAuditLogResponse(log)).thenReturn(response);

            AuditLogResponse result = adminService.logAction(testAdminUserId, "UPDATE_USER", "User", "user-123", "Updated profile");

            assertThat(result).isNotNull();
            assertThat(result.action()).isEqualTo("UPDATE_USER");
            assertThat(result.targetId()).isEqualTo("user-123");
            verify(auditLogRepository).save(any(AdminAuditLog.class));
        }

        @Test
        @DisplayName("Should save and return the audit log with correct admin user ID")
        void logAction_correctAdminUserId() {
            AdminAuditLog log = new AdminAuditLog(testAdminUserId, "DELETE_ACCOUNT", "Account", "acc-456", "Closed account", null);
            ReflectionTestUtils.setField(log, "id", testLogId);

            AuditLogResponse response = new AuditLogResponse(
                    testLogId.toString(), testAdminUserId, "DELETE_ACCOUNT", "Account", "acc-456", "Closed account", null, null);

            when(auditLogRepository.save(any(AdminAuditLog.class))).thenAnswer(inv -> inv.getArgument(0));
            when(adminMapper.toAuditLogResponse(any(AdminAuditLog.class))).thenReturn(response);

            AuditLogResponse result = adminService.logAction(testAdminUserId, "DELETE_ACCOUNT", "Account", "acc-456", "Closed account");

            assertThat(result.adminUserId()).isEqualTo(testAdminUserId);
            verify(auditLogRepository).save(any(AdminAuditLog.class));
        }
    }

    @Nested
    @DisplayName("Get Dashboard Stats")
    class GetDashboardStats {

        @Test
        @DisplayName("Should return dashboard stats for admin user")
        void getDashboardStats_success() {
            authenticateAsAdmin();

            AdminDashboardResponse result = adminService.getDashboardStats();

            assertThat(result).isNotNull();
            assertThat(result.totalUsers()).isGreaterThanOrEqualTo(0);
            assertThat(result.totalAccounts()).isGreaterThanOrEqualTo(0);
            assertThat(result.totalTransactions()).isGreaterThanOrEqualTo(0);
        }

        @Test
        @DisplayName("Should throw when non-admin user tries to get dashboard stats")
        void getDashboardStats_notAdmin() {
            var auth = new UsernamePasswordAuthenticationToken(
                    testAdminUserId, null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
            SecurityContextHolder.getContext().setAuthentication(auth);

            assertThatThrownBy(() -> adminService.getDashboardStats())
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("Admin access required");
        }
    }

    @Nested
    @DisplayName("Get User List")
    class GetUserList {

        @Test
        @DisplayName("Should return paginated user list for admin user")
        void getUserList_success() {
            authenticateAsAdmin();

            Pageable pageable = PageRequest.of(0, 20);
            Page<com.finflow.modules.auth.domain.User> emptyPage = new PageImpl<>(List.of(), pageable, 0);
            when(userRepository.findAll(pageable)).thenReturn(emptyPage);

            PageResponse<UserManagementResponse> result = adminService.getUserList(pageable);

            assertThat(result).isNotNull();
            assertThat(result.content()).isNotNull();
            verifyNoInteractions(auditLogRepository);
        }

        @Test
        @DisplayName("Should throw when non-admin user tries to get user list")
        void getUserList_notAdmin() {
            var auth = new UsernamePasswordAuthenticationToken(
                    testAdminUserId, null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
            SecurityContextHolder.getContext().setAuthentication(auth);

            Pageable pageable = PageRequest.of(0, 20);

            assertThatThrownBy(() -> adminService.getUserList(pageable))
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("Admin access required");
        }
    }
}
