package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:finflow_refresh_token_test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false",
        "spring.sql.init.mode=always",
        "spring.sql.init.schema-locations=classpath:schemas.sql"
})
@DisplayName("RefreshTokenRepository Integration Tests")
class RefreshTokenRepositoryIntegrationTest {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EntityManager entityManager;

    private User testUser;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();

        customerRole = new Role("CUSTOMER", "Standard customer role", true);
        customerRole = roleRepository.save(customerRole);

        testUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        ReflectionTestUtils.setField(testUser, "createdBy", "test-user");
        ReflectionTestUtils.setField(testUser, "modifiedBy", "test-user");
        testUser = userRepository.save(testUser);
    }

    private RefreshToken createToken(String hash, String familyId, boolean revoked) {
        RefreshToken token = new RefreshToken(
                testUser, UUID.randomUUID().toString(), familyId,
                hash, LocalDateTime.now().plusDays(30),
                "127.0.0.1", "TestAgent/1.0");
        token = refreshTokenRepository.save(token);
        if (revoked) {
            token.revoke();
            refreshTokenRepository.save(token);
        }
        return token;
    }

    @Nested
    @DisplayName("findActiveByTokenHash()")
    class FindActiveByTokenHash {

        @Test
        @DisplayName("finds active token by hash")
        void findsActiveToken() {
            RefreshToken token = createToken("hash-123", "family-1", false);

            Optional<RefreshToken> found = refreshTokenRepository.findActiveByTokenHash("hash-123");

            assertThat(found).isPresent();
            assertThat(found.get().getSessionId()).isEqualTo(token.getSessionId());
        }

        @Test
        @DisplayName("returns empty for revoked token")
        void returnsEmptyForRevoked() {
            createToken("hash-revoked", "family-1", true);

            Optional<RefreshToken> found = refreshTokenRepository.findActiveByTokenHash("hash-revoked");

            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("returns empty for expired token")
        void returnsEmptyForExpired() {
            RefreshToken expired = new RefreshToken(
                    testUser, UUID.randomUUID().toString(), "family-1",
                    "hash-expired", LocalDateTime.now().minusDays(1),
                    "127.0.0.1", "TestAgent");
            refreshTokenRepository.save(expired);

            Optional<RefreshToken> found = refreshTokenRepository.findActiveByTokenHash("hash-expired");

            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("returns empty for non-existent hash")
        void returnsEmptyForNonExistent() {
            Optional<RefreshToken> found = refreshTokenRepository.findActiveByTokenHash("no-such-hash");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByTokenHash()")
    class FindByTokenHash {

        @Test
        @DisplayName("finds token regardless of revocation status")
        void findsRevokedToken() {
            createToken("hash-revoked", "family-1", true);

            Optional<RefreshToken> found = refreshTokenRepository.findByTokenHash("hash-revoked");

            assertThat(found).isPresent();
            assertThat(found.get().getIsRevoked()).isTrue();
        }
    }

    @Nested
    @DisplayName("findActiveBySessionId()")
    class FindActiveBySessionId {

        @Test
        @DisplayName("finds active token by session ID")
        void findsBySessionId() {
            RefreshToken token = createToken("hash-1", "family-1", false);

            Optional<RefreshToken> found = refreshTokenRepository.findActiveBySessionId(
                    token.getSessionId());

            assertThat(found).isPresent();
        }
    }

    @Nested
    @DisplayName("findActiveByUserId()")
    class FindActiveByUserId {

        @Test
        @DisplayName("returns only active tokens for user")
        void returnsOnlyActiveTokens() {
            createToken("hash-1", "family-1", false);
            createToken("hash-2", "family-1", false);
            createToken("hash-revoked", "family-1", true);

            List<RefreshToken> active = refreshTokenRepository.findActiveByUserId(testUser.getId());

            assertThat(active).hasSize(2);
        }
    }

    @Nested
    @DisplayName("findAllByFamilyId()")
    class FindAllByFamilyId {

        @Test
        @DisplayName("returns all tokens in family including revoked")
        void returnsAllFamilyTokens() {
            createToken("hash-1", "family-abc", false);
            createToken("hash-2", "family-abc", true);
            createToken("hash-other", "family-xyz", false);

            List<RefreshToken> family = refreshTokenRepository.findAllByFamilyId("family-abc");

            assertThat(family).hasSize(2);
        }
    }

    @Nested
    @DisplayName("revokeAllByFamilyId()")
    class RevokeAllByFamilyId {

        @Test
        @DisplayName("revokes all active tokens in family")
        void revokesFamily() {
            RefreshToken t1 = createToken("hash-1", "family-abc", false);
            RefreshToken t2 = createToken("hash-2", "family-abc", false);
            createToken("hash-revoked", "family-abc", true);

            refreshTokenRepository.revokeAllByFamilyId("family-abc", LocalDateTime.now());
            entityManager.flush();
            entityManager.clear();

            RefreshToken refreshed1 = refreshTokenRepository.findById(t1.getId()).orElseThrow();
            RefreshToken refreshed2 = refreshTokenRepository.findById(t2.getId()).orElseThrow();

            assertThat(refreshed1.getIsRevoked()).isTrue();
            assertThat(refreshed2.getIsRevoked()).isTrue();
        }
    }

    @Nested
    @DisplayName("revokeAllByUserId()")
    class RevokeAllByUserId {

        @Test
        @DisplayName("revokes all active tokens for user")
        void revokesAllForUser() {
            createToken("hash-1", "family-1", false);
            createToken("hash-2", "family-2", false);

            refreshTokenRepository.revokeAllByUserId(testUser.getId(), LocalDateTime.now());

            List<RefreshToken> active = refreshTokenRepository.findActiveByUserId(testUser.getId());
            assertThat(active).isEmpty();
        }
    }

    @Nested
    @DisplayName("findExpiredNotRevoked()")
    class FindExpiredNotRevoked {

        @Test
        @DisplayName("finds expired tokens that are not revoked")
        void findsExpiredTokens() {
            RefreshToken expired = new RefreshToken(
                    testUser, UUID.randomUUID().toString(), "family-1",
                    "hash-expired", LocalDateTime.now().minusDays(10),
                    "127.0.0.1", "TestAgent");
            refreshTokenRepository.save(expired);

            RefreshToken active = createToken("hash-active", "family-1", false);

            List<RefreshToken> result = refreshTokenRepository.findExpiredNotRevoked(
                    LocalDateTime.now().minusDays(7));

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getRefreshTokenHash()).isEqualTo("hash-expired");
        }
    }

    @Nested
    @DisplayName("countActiveByUserId()")
    class CountActiveByUserId {

        @Test
        @DisplayName("counts only active tokens")
        void countsActiveTokens() {
            createToken("hash-1", "family-1", false);
            createToken("hash-2", "family-1", false);
            createToken("hash-revoked", "family-1", true);

            long count = refreshTokenRepository.countActiveByUserId(testUser.getId());

            assertThat(count).isEqualTo(2);
        }
    }
}
