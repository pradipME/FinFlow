package com.finflow.modules.auth.service;

import com.finflow.modules.auth.config.SessionProperties;
import com.finflow.modules.auth.domain.RefreshToken;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserStatus;
import com.finflow.modules.auth.repository.RefreshTokenRepository;
import com.finflow.shared.exception.UnauthorizedException;
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
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SessionService")
class SessionServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private RedisSessionCache redisSessionCache;
    @Mock
    private TokenHashService tokenHashService;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    @Mock
    private SessionProperties sessionProperties;
    @Mock
    private TokenRotationService tokenRotationService;

    @InjectMocks
    private SessionService sessionService;

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

        lenient().when(sessionProperties.refreshTokenTtlDays()).thenReturn(30L);
        lenient().when(sessionProperties.maxActiveSessions()).thenReturn(5);
    }

    @Nested
    @DisplayName("createSession()")
    class CreateSession {

        @Test
        @DisplayName("creates token and returns RefreshTokenSession")
        void createsTokenSuccessfully() {
            when(tokenHashService.generateRefreshToken()).thenReturn("raw-token-123");
            when(tokenHashService.hashToken("raw-token-123")).thenReturn("hash-abc");
            when(tokenHashService.generateSessionId()).thenReturn("session-uuid");
            when(tokenHashService.generateFamilyId()).thenReturn("family-uuid");
            when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> {
                RefreshToken rt = inv.getArgument(0);
                rt.setId(UUID.randomUUID());
                return rt;
            });

            var result = sessionService.createSession(testUser, "127.0.0.1", "TestAgent");

            assertThat(result.rawToken()).isEqualTo("raw-token-123");
            assertThat(result.sessionId()).isEqualTo("session-uuid");
            assertThat(result.familyId()).isEqualTo("family-uuid");
            assertThat(result.tokenHash()).isEqualTo("hash-abc");
            assertThat(result.expiresAt()).isAfter(LocalDateTime.now());

            verify(refreshTokenRepository).save(any(RefreshToken.class));
            verify(redisSessionCache).storeSession(eq("session-uuid"), eq(testUser.getId().toString()),
                    eq("hash-abc"), anyLong());
        }
    }

    @Nested
    @DisplayName("validateSession()")
    class ValidateSession {

        @Test
        @DisplayName("returns empty when token is revoked in Redis")
        void returnsEmptyWhenRevokedInRedis() {
            when(tokenHashService.hashToken("raw-token")).thenReturn("hash-123");
            when(redisSessionCache.isRevoked("hash-123")).thenReturn(true);

            var result = sessionService.validateSession("raw-token", "127.0.0.1");

            assertThat(result).isEmpty();
            verify(refreshTokenRepository, never()).findActiveByTokenHash(any());
        }

        @Test
        @DisplayName("returns empty when token not found in PostgreSQL and not revoked")
        void returnsEmptyWhenNotFound() {
            when(tokenHashService.hashToken("raw-token")).thenReturn("hash-123");
            when(redisSessionCache.isRevoked("hash-123")).thenReturn(false);
            when(refreshTokenRepository.findActiveByTokenHash("hash-123")).thenReturn(Optional.empty());
            when(refreshTokenRepository.findByTokenHash("hash-123")).thenReturn(Optional.empty());

            var result = sessionService.validateSession("raw-token", "127.0.0.1");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("returns session when token is valid")
        void returnsSessionWhenValid() {
            when(tokenHashService.hashToken("raw-token")).thenReturn("hash-123");
            when(redisSessionCache.isRevoked("hash-123")).thenReturn(false);
            when(refreshTokenRepository.findActiveByTokenHash("hash-123"))
                    .thenReturn(Optional.of(testToken));

            var result = sessionService.validateSession("raw-token", "127.0.0.1");

            assertThat(result).isPresent();
            assertThat(result.get().sessionId()).isEqualTo("session-123");
            assertThat(result.get().familyId()).isEqualTo("family-456");

            verify(testToken).recordUsage("127.0.0.1");
            verify(refreshTokenRepository).save(testToken);
        }
    }

    @Nested
    @DisplayName("revokeSession()")
    class RevokeSession {

        @Test
        @DisplayName("revokes token and updates both PostgreSQL and Redis")
        void revokesSuccessfully() {
            when(tokenHashService.hashToken("raw-token")).thenReturn("hash-123");
            when(refreshTokenRepository.findByTokenHash("hash-123"))
                    .thenReturn(Optional.of(testToken));

            boolean result = sessionService.revokeSession("raw-token", "127.0.0.1");

            assertThat(result).isTrue();
            verify(testToken).revoke();
            verify(refreshTokenRepository).save(testToken);
            verify(redisSessionCache).removeSession("session-123", testUser.getId().toString());
            verify(redisSessionCache).markRevoked("hash-123", anyLong());
        }

        @Test
        @DisplayName("returns false when token not found")
        void returnsFalseWhenNotFound() {
            when(tokenHashService.hashToken("raw-token")).thenReturn("hash-123");
            when(refreshTokenRepository.findByTokenHash("hash-123")).thenReturn(Optional.empty());

            boolean result = sessionService.revokeSession("raw-token", "127.0.0.1");

            assertThat(result).isFalse();
        }
    }

    @Nested
    @DisplayName("revokeAllUserSessions()")
    class RevokeAllUserSessions {

        @Test
        @DisplayName("revokes all user tokens in PostgreSQL and clears Redis")
        void revokesAll() {
            UUID userId = testUser.getId();

            sessionService.revokeAllUserSessions(userId);

            verify(refreshTokenRepository).revokeAllByUserId(eq(userId), any(LocalDateTime.class));
            verify(redisSessionCache).removeAllUserSessions(userId.toString());
        }
    }

    @Nested
    @DisplayName("getActiveSessionCount()")
    class GetActiveSessionCount {

        @Test
        @DisplayName("returns count from repository")
        void returnsCount() {
            when(refreshTokenRepository.countActiveByUserId(testUser.getId())).thenReturn(3L);

            long count = sessionService.getActiveSessionCount(testUser.getId());

            assertThat(count).isEqualTo(3L);
        }
    }

    @Nested
    @DisplayName("getRefreshTokenLifetimeDays()")
    class Lifetime {

        @Test
        @DisplayName("returns 30 days")
        void returns30Days() {
            assertThat(sessionService.getRefreshTokenLifetimeDays()).isEqualTo(30);
        }
    }
}
