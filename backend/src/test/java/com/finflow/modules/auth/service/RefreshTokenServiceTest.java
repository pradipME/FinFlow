package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.*;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.shared.config.JwtTokenProvider;
import com.finflow.shared.exception.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RefreshTokenService")
class RefreshTokenServiceTest {

    @Mock
    private SessionService sessionService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User testUser;
    private SessionService.RefreshTokenSession testSession;

    @BeforeEach
    void setUp() {
        testUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        testUser.setId(UUID.randomUUID());
        testUser.setStatus(UserStatus.ACTIVE);

        Role role = new Role("CUSTOMER", "Customer role", true);
        UserRole userRole = new UserRole(testUser, role, "system");
        testUser.setRoles(Set.of(userRole));

        testSession = new SessionService.RefreshTokenSession(
                "raw-refresh-token", "session-uuid", "family-uuid",
                "hash-abc", LocalDateTime.now().plusDays(30));
    }

    @Nested
    @DisplayName("createRefreshToken()")
    class CreateRefreshToken {

        @Test
        @DisplayName("delegates to SessionService and returns raw token")
        void createsToken() {
            when(sessionService.createSession(testUser, "127.0.0.1", "TestAgent"))
                    .thenReturn(testSession);

            String rawToken = refreshTokenService.createRefreshToken(testUser, "127.0.0.1", "TestAgent");

            assertThat(rawToken).isEqualTo("raw-refresh-token");
            verify(sessionService).createSession(testUser, "127.0.0.1", "TestAgent");
        }
    }

    @Nested
    @DisplayName("refresh()")
    class Refresh {

        @Test
        @DisplayName("throws UnauthorizedException when session invalid")
        void throwsOnInvalidSession() {
            when(sessionService.validateSession("bad-token", "127.0.0.1"))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> refreshTokenService.refresh("bad-token", "127.0.0.1", "Agent"))
                    .isInstanceOf(UnauthorizedException.class);

            verify(sessionService, never()).revokeSession(any(), any());
        }

        @Test
        @DisplayName("successfully refreshes tokens")
        void refreshesTokens() {
            when(sessionService.validateSession("raw-token", "127.0.0.1"))
                    .thenReturn(Optional.of(testSession));
            when(sessionService.revokeSession("raw-token", "127.0.0.1")).thenReturn(true);
            when(userRepository.findBySessionId("session-uuid"))
                    .thenReturn(Optional.of(testUser));
            when(jwtTokenProvider.generateAccessToken(
                    eq(testUser.getId().toString()), eq("test@finflow.com"),
                    anyList(), anyList()))
                    .thenReturn("new-access-token");

            SessionService.RefreshTokenSession newSession = new SessionService.RefreshTokenSession(
                    "new-raw-token", "new-session", "family-uuid",
                    "new-hash", LocalDateTime.now().plusDays(30));
            when(sessionService.createSession(testUser, "127.0.0.1", "Agent"))
                    .thenReturn(newSession);

            var result = refreshTokenService.refresh("raw-token", "127.0.0.1", "Agent");

            assertThat(result.accessToken()).isEqualTo("new-access-token");
            assertThat(result.refreshToken()).isEqualTo("new-raw-token");

            verify(sessionService).revokeSession("raw-token", "127.0.0.1");
            verify(sessionService).createSession(testUser, "127.0.0.1", "Agent");
        }
    }

    @Nested
    @DisplayName("revokeToken()")
    class RevokeToken {

        @Test
        @DisplayName("delegates to SessionService")
        void delegatesToSessionService() {
            when(sessionService.revokeSession("token", "127.0.0.1")).thenReturn(true);

            boolean result = refreshTokenService.revokeToken("token", "127.0.0.1");

            assertThat(result).isTrue();
        }
    }

    @Nested
    @DisplayName("revokeAllUserTokens()")
    class RevokeAllUserTokens {

        @Test
        @DisplayName("delegates to SessionService")
        void delegatesToSessionService() {
            UUID userId = testUser.getId();

            refreshTokenService.revokeAllUserTokens(userId);

            verify(sessionService).revokeAllUserSessions(userId);
        }
    }

    @Nested
    @DisplayName("getActiveSessionCount()")
    class GetActiveSessionCount {

        @Test
        @DisplayName("delegates to SessionService")
        void delegatesToSessionService() {
            when(sessionService.getActiveSessionCount(testUser.getId())).thenReturn(2L);

            long count = refreshTokenService.getActiveSessionCount(testUser.getId());

            assertThat(count).isEqualTo(2L);
        }
    }
}
