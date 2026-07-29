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
@DisplayName("TokenRotationService")
class TokenRotationServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private RedisSessionCache redisSessionCache;
    @Mock
    private TokenHashService tokenHashService;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TokenRotationService tokenRotationService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        testUser.setId(UUID.randomUUID());
        testUser.setStatus(UserStatus.ACTIVE);
    }

    @Nested
    @DisplayName("rotateToken()")
    class RotateToken {

        @Test
        @DisplayName("creates new token in same family and stores in Redis")
        void rotatesTokenSuccessfully() {
            when(tokenHashService.generateRefreshToken()).thenReturn("new-raw-token");
            when(tokenHashService.hashToken("new-raw-token")).thenReturn("new-hash");
            when(tokenHashService.generateSessionId()).thenReturn("new-session-id");
            when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> {
                RefreshToken rt = inv.getArgument(0);
                rt.setId(UUID.randomUUID());
                return rt;
            });

            var result = tokenRotationService.rotateToken(
                    testUser, "family-123", "127.0.0.1", "TestAgent/1.0");

            assertThat(result.rawToken()).isEqualTo("new-raw-token");
            assertThat(result.sessionId()).isEqualTo("new-session-id");
            assertThat(result.familyId()).isEqualTo("family-123");
            assertThat(result.tokenHash()).isEqualTo("new-hash");

            ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
            verify(refreshTokenRepository).save(captor.capture());
            RefreshToken saved = captor.getValue();
            assertThat(saved.getFamilyId()).isEqualTo("family-123");
            assertThat(saved.getIsRevoked()).isFalse();

            verify(redisSessionCache).storeSession(
                    eq("new-session-id"), eq(testUser.getId().toString()),
                    eq("new-hash"), anyLong());
        }
    }

    @Nested
    @DisplayName("handleTokenReuse()")
    class HandleTokenReuse {

        @Test
        @DisplayName("returns empty when token hash not found")
        void returnsEmptyWhenNotFound() {
            when(refreshTokenRepository.findByTokenHash("unknown-hash"))
                    .thenReturn(Optional.empty());

            var result = tokenRotationService.handleTokenReuse("unknown-hash");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("returns empty when token is not revoked")
        void returnsEmptyWhenNotRevoked() {
            RefreshToken activeToken = new RefreshToken(
                    testUser, "session-1", "family-1", "active-hash",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");
            activeToken.setId(UUID.randomUUID());

            when(refreshTokenRepository.findByTokenHash("active-hash"))
                    .thenReturn(Optional.of(activeToken));

            var result = tokenRotationService.handleTokenReuse("active-hash");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("revokes entire family when reuse detected")
        void revokesFamilyOnReuse() {
            RefreshToken revokedToken = new RefreshToken(
                    testUser, "session-old", "family-abc", "revoked-hash",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");
            revokedToken.setId(UUID.randomUUID());
            revokedToken.revoke();

            RefreshToken familyToken = new RefreshToken(
                    testUser, "session-new", "family-abc", "family-hash",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");
            familyToken.setId(UUID.randomUUID());

            when(refreshTokenRepository.findByTokenHash("revoked-hash"))
                    .thenReturn(Optional.of(revokedToken));
            when(refreshTokenRepository.findAllByFamilyId("family-abc"))
                    .thenReturn(List.of(revokedToken, familyToken));

            var result = tokenRotationService.handleTokenReuse("revoked-hash");

            assertThat(result).isPresent();
            assertThat(result.get()).isEqualTo(testUser.getId());

            verify(refreshTokenRepository).revokeAllByFamilyId(
                    eq("family-abc"), any(LocalDateTime.class));
            verify(redisSessionCache).removeSession("session-old", testUser.getId().toString());
            verify(redisSessionCache).removeSession("session-new", testUser.getId().toString());
        }
    }

    @Nested
    @DisplayName("hasActiveTokensInFamily()")
    class HasActiveTokensInFamily {

        @Test
        @DisplayName("returns true when family has valid tokens")
        void returnsTrueForActiveFamily() {
            RefreshToken validToken = new RefreshToken(
                    testUser, "session-1", "family-1", "hash-1",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");

            when(refreshTokenRepository.findAllByFamilyId("family-1"))
                    .thenReturn(List.of(validToken));

            assertThat(tokenRotationService.hasActiveTokensInFamily("family-1")).isTrue();
        }

        @Test
        @DisplayName("returns false when all tokens in family are revoked")
        void returnsFalseForRevokedFamily() {
            RefreshToken revokedToken = new RefreshToken(
                    testUser, "session-1", "family-1", "hash-1",
                    LocalDateTime.now().plusDays(30), "127.0.0.1", "Agent");
            revokedToken.revoke();

            when(refreshTokenRepository.findAllByFamilyId("family-1"))
                    .thenReturn(List.of(revokedToken));

            assertThat(tokenRotationService.hasActiveTokensInFamily("family-1")).isFalse();
        }
    }

    @Nested
    @DisplayName("getRotationCount()")
    class GetRotationCount {

        @Test
        @DisplayName("returns number of tokens in family")
        void returnsSize() {
            when(refreshTokenRepository.findAllByFamilyId("family-1"))
                    .thenReturn(List.of(mock(RefreshToken.class), mock(RefreshToken.class)));

            assertThat(tokenRotationService.getRotationCount("family-1")).isEqualTo(2);
        }
    }
}
