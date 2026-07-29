package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.RefreshToken;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserStatus;
import com.finflow.modules.auth.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TokenRevocationService")
class TokenRevocationServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private RedisSessionCache redisSessionCache;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TokenRevocationService tokenRevocationService;

    private User testUser;
    private RefreshToken testToken;

    @BeforeEach
    void setUp() {
        testUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        testUser.setId(UUID.randomUUID());
        testUser.setStatus(UserStatus.ACTIVE);

        testToken = new RefreshToken(
                testUser, "session-123", "family-456",
                "hashed-token-abc", LocalDateTime.now().plusDays(30),
                "127.0.0.1", "TestAgent/1.0");
        testToken.setId(UUID.randomUUID());
    }

    @Nested
    @DisplayName("revokeByTokenHash()")
    class RevokeByTokenHash {

        @Test
        @DisplayName("revokes token and updates Redis")
        void revokesSuccessfully() {
            when(refreshTokenRepository.findByTokenHash("hash-abc"))
                    .thenReturn(Optional.of(testToken));

            boolean result = tokenRevocationService.revokeByTokenHash("hash-abc", "127.0.0.1");

            assertThat(result).isTrue();
            verify(testToken).revoke();
            verify(refreshTokenRepository).save(testToken);
            verify(redisSessionCache).removeSession("session-123", testUser.getId().toString());
            verify(redisSessionCache).markRevoked("hash-abc", anyLong());
        }

        @Test
        @DisplayName("returns false when token not found")
        void returnsFalseWhenNotFound() {
            when(refreshTokenRepository.findByTokenHash("unknown"))
                    .thenReturn(Optional.empty());

            boolean result = tokenRevocationService.revokeByTokenHash("unknown", "127.0.0.1");

            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("returns false when token already revoked")
        void returnsFalseWhenAlreadyRevoked() {
            testToken.revoke();
            when(refreshTokenRepository.findByTokenHash("hash-abc"))
                    .thenReturn(Optional.of(testToken));

            boolean result = tokenRevocationService.revokeByTokenHash("hash-abc", "127.0.0.1");

            assertThat(result).isFalse();
            verify(refreshTokenRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("revokeAllForUser()")
    class RevokeAllForUser {

        @Test
        @DisplayName("revokes all user tokens in MySQL and clears Redis")
        void revokesAll() {
            UUID userId = testUser.getId();

            tokenRevocationService.revokeAllForUser(userId, "127.0.0.1");

            verify(refreshTokenRepository).revokeAllByUserId(eq(userId), any(LocalDateTime.class));
            verify(redisSessionCache).removeAllUserSessions(userId.toString());
        }
    }

    @Nested
    @DisplayName("revokeFamily()")
    class RevokeFamily {

        @Test
        @DisplayName("revokes entire family and clears Redis for each token")
        void revokesFamily() {
            RefreshToken token1 = new RefreshToken(
                    testUser, "session-1", "family-abc", "hash-1",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");
            token1.setId(UUID.randomUUID());

            RefreshToken token2 = new RefreshToken(
                    testUser, "session-2", "family-abc", "hash-2",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");
            token2.setId(UUID.randomUUID());

            when(refreshTokenRepository.findAllByFamilyId("family-abc"))
                    .thenReturn(List.of(token1, token2));

            tokenRevocationService.revokeFamily("family-abc", "127.0.0.1");

            verify(refreshTokenRepository).revokeAllByFamilyId(
                    eq("family-abc"), any(LocalDateTime.class));
            verify(redisSessionCache).removeSession("session-1", testUser.getId().toString());
            verify(redisSessionCache).removeSession("session-2", testUser.getId().toString());
            verify(redisSessionCache).markRevoked("hash-1", 0);
            verify(redisSessionCache).markRevoked("hash-2", 0);
        }

        @Test
        @DisplayName("handles empty family gracefully")
        void handlesEmptyFamily() {
            when(refreshTokenRepository.findAllByFamilyId("empty-family"))
                    .thenReturn(List.of());

            tokenRevocationService.revokeFamily("empty-family", "127.0.0.1");

            verify(refreshTokenRepository).revokeAllByFamilyId(
                    eq("empty-family"), any(LocalDateTime.class));
            verify(redisSessionCache, never()).removeSession(any(), any());
        }
    }

    @Nested
    @DisplayName("cleanupExpiredTokens()")
    class CleanupExpiredTokens {

        @Test
        @DisplayName("revokes tokens expired more than 7 days ago")
        void revokesExpiredTokens() {
            RefreshToken expiredToken = new RefreshToken(
                    testUser, "session-expired", "family-1", "hash-expired",
                    LocalDateTime.now().minusDays(10), "127.0.0.1", "Agent");
            expiredToken.setId(UUID.randomUUID());

            when(refreshTokenRepository.findExpiredNotRevoked(any(LocalDateTime.class)))
                    .thenReturn(List.of(expiredToken));

            tokenRevocationService.cleanupExpiredTokens();

            verify(refreshTokenRepository).findExpiredNotRevoked(any(LocalDateTime.class));
            verify(refreshTokenRepository).saveAll(argThat(list -> list.size() == 1));
        }
    }

    @Nested
    @DisplayName("getActiveSessionCount()")
    class GetActiveSessionCount {

        @Test
        @DisplayName("returns count from repository")
        void returnsCount() {
            when(refreshTokenRepository.countActiveByUserId(testUser.getId())).thenReturn(5L);

            long count = tokenRevocationService.getActiveSessionCount(testUser.getId());

            assertThat(count).isEqualTo(5L);
        }
    }
}
