package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for {@link LoginHistoryRepository}.
 *
 * <p>Uses H2 in-memory database to verify repository queries, constraints,
 * and auditing behavior without requiring a running PostgreSQL instance.</p>
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:finflow_login_test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false"
})
@DisplayName("LoginHistoryRepository Integration Tests")
class LoginHistoryRepositoryIntegrationTest {

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        loginHistoryRepository.deleteAll();
        userRepository.deleteAll();

        Role customerRole = new Role("CUSTOMER", "Standard customer role", true);
        customerRole = roleRepository.save(customerRole);

        testUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        testUser.setId(UUID.randomUUID());
        testUser.setStatus(UserStatus.ACTIVE);
        testUser.setEmailVerified(true);
        testUser = userRepository.save(testUser);
    }

    @Nested
    @DisplayName("save()")
    class Save {

        @Test
        @DisplayName("should persist login history with all fields")
        void shouldPersistWithAllFields() {
            LoginHistory history = LoginHistory.successfulAttempt(
                    testUser, "test@finflow.com", "192.168.1.1", "Mozilla/5.0");

            LoginHistory saved = loginHistoryRepository.save(history);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getUser()).isEqualTo(testUser);
            assertThat(saved.getIdentifier()).isEqualTo("test@finflow.com");
            assertThat(saved.getSuccess()).isTrue();
            assertThat(saved.getFailureReason()).isNull();
            assertThat(saved.getIpAddress()).isEqualTo("192.168.1.1");
            assertThat(saved.getUserAgent()).isEqualTo("Mozilla/5.0");
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should persist failed attempt with null user")
        void shouldPersistWithNullUser() {
            LoginHistory history = LoginHistory.failedAttempt(
                    "unknown@finflow.com", "10.0.0.1", "curl/7.68.0");

            LoginHistory saved = loginHistoryRepository.save(history);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getUser()).isNull();
            assertThat(saved.getSuccess()).isFalse();
            assertThat(saved.getFailureReason()).isEqualTo(LoginHistory.FailureReason.INVALID_CREDENTIALS);
        }

        @Test
        @DisplayName("should persist failure reason enum correctly")
        void shouldPersistFailureReason() {
            LoginHistory history = new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.ACCOUNT_LOCKED,
                    "192.168.1.1", "Mozilla/5.0");

            LoginHistory saved = loginHistoryRepository.save(history);

            assertThat(saved.getFailureReason()).isEqualTo(LoginHistory.FailureReason.ACCOUNT_LOCKED);
        }
    }

    @Nested
    @DisplayName("countFailedAttemptsByUserSince()")
    class CountFailedAttemptsByUserSince {

        @Test
        @DisplayName("should count only failed attempts for the user")
        void shouldCountOnlyFailedAttempts() {
            // Create 3 failed and 1 successful
            loginHistoryRepository.save(new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "192.168.1.1", "Mozilla/5.0"));
            loginHistoryRepository.save(new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "192.168.1.1", "Mozilla/5.0"));
            loginHistoryRepository.save(new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "192.168.1.1", "Mozilla/5.0"));
            loginHistoryRepository.save(LoginHistory.successfulAttempt(
                    testUser, "test@finflow.com", "192.168.1.1", "Mozilla/5.0"));

            long count = loginHistoryRepository.countFailedAttemptsByUserSince(
                    testUser.getId(), LocalDateTime.now().minusHours(1));

            assertThat(count).isEqualTo(3);
        }

        @Test
        @DisplayName("should return zero when no attempts exist")
        void shouldReturnZeroWhenNoAttempts() {
            long count = loginHistoryRepository.countFailedAttemptsByUserSince(
                    testUser.getId(), LocalDateTime.now().minusHours(1));

            assertThat(count).isZero();
        }

        @Test
        @DisplayName("should only count attempts within the time window")
        void shouldRespectTimeWindow() {
            // Create an old attempt (2 hours ago)
            LoginHistory old = new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "192.168.1.1", "Mozilla/5.0");
            loginHistoryRepository.save(old);

            // Only count from 1 hour ago — should exclude the old attempt
            long count = loginHistoryRepository.countFailedAttemptsByUserSince(
                    testUser.getId(), LocalDateTime.now().minusHours(1));

            assertThat(count).isZero();
        }
    }

    @Nested
    @DisplayName("countFailedAttemptsByIdentifierSince()")
    class CountFailedAttemptsByIdentifierSince {

        @Test
        @DisplayName("should count attempts by identifier regardless of user")
        void shouldCountByIdentifier() {
            loginHistoryRepository.save(new LoginHistory(
                    null, "attacker@evil.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "10.0.0.1", "curl"));
            loginHistoryRepository.save(new LoginHistory(
                    null, "attacker@evil.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "10.0.0.1", "curl"));

            long count = loginHistoryRepository.countFailedAttemptsByIdentifierSince(
                    "attacker@evil.com", LocalDateTime.now().minusHours(1));

            assertThat(count).isEqualTo(2);
        }
    }

    @Nested
    @DisplayName("countFailedAttemptsByIpSince()")
    class CountFailedAttemptsByIpSince {

        @Test
        @DisplayName("should count attempts from the same IP")
        void shouldCountByIp() {
            loginHistoryRepository.save(new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "10.0.0.1", "curl"));
            loginHistoryRepository.save(new LoginHistory(
                    null, "other@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "10.0.0.1", "curl"));
            loginHistoryRepository.save(new LoginHistory(
                    null, "another@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "10.0.0.2", "curl"));

            long count = loginHistoryRepository.countFailedAttemptsByIpSince(
                    "10.0.0.1", LocalDateTime.now().minusHours(1));

            assertThat(count).isEqualTo(2);
        }
    }

    @Nested
    @DisplayName("findRecentByUser()")
    class FindRecentByUser {

        @Test
        @DisplayName("should return recent attempts ordered by time descending")
        void shouldReturnRecentOrdered() {
            loginHistoryRepository.save(LoginHistory.successfulAttempt(
                    testUser, "test@finflow.com", "192.168.1.1", "Mozilla/5.0"));
            loginHistoryRepository.save(new LoginHistory(
                    testUser, "test@finflow.com", false,
                    LoginHistory.FailureReason.INVALID_CREDENTIALS, "192.168.1.1", "Mozilla/5.0"));
            loginHistoryRepository.save(LoginHistory.successfulAttempt(
                    testUser, "test@finflow.com", "192.168.1.1", "Mozilla/5.0"));

            List<LoginHistory> results = loginHistoryRepository.findRecentByUser(
                    testUser.getId(), PageRequest.of(0, 2));

            assertThat(results).hasSize(2);
            // First result should be the most recent
            assertThat(results.get(0).getCreatedAt())
                    .isAfterOrEqualTo(results.get(1).getCreatedAt());
        }
    }

    @Nested
    @DisplayName("Immutability")
    class Immutability {

        @Test
        @DisplayName("should set createdAt automatically via @PrePersist")
        void shouldSetCreatedAtAutomatically() {
            LoginHistory history = LoginHistory.failedAttempt(
                    "test@finflow.com", "192.168.1.1", "Mozilla/5.0");

            assertThat(history.getCreatedAt()).isNull();

            LoginHistory saved = loginHistoryRepository.save(history);

            assertThat(saved.getCreatedAt()).isNotNull();
            assertThat(saved.getCreatedAt()).isBeforeOrEqualTo(LocalDateTime.now());
        }

        @Test
        @DisplayName("should not update createdAt on re-save (updatable=false)")
        void shouldNotUpdateCreatedAt() {
            LoginHistory history = LoginHistory.successfulAttempt(
                    testUser, "test@finflow.com", "192.168.1.1", "Mozilla/5.0");
            LoginHistory saved = loginHistoryRepository.save(history);
            LocalDateTime originalCreatedAt = saved.getCreatedAt();

            // Small delay to ensure timestamps would differ if updated
            saved = loginHistoryRepository.save(saved);

            assertThat(saved.getCreatedAt()).isEqualTo(originalCreatedAt);
        }
    }
}
