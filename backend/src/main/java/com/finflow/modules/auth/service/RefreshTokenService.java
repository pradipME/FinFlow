package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.RefreshToken;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.dto.AuthenticationResult;
import com.finflow.modules.auth.repository.RefreshTokenRepository;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.shared.config.JwtTokenProvider;
import com.finflow.shared.exception.UnauthorizedException;
import com.finflow.shared.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Core service for refresh token operations.
 *
 * <p>Orchestrates the complete refresh token lifecycle: creation during login,
 * validation during refresh, rotation on use, and revocation on security events.</p>
 *
 * <h3>Security Design</h3>
 * <ul>
 *   <li>Refresh tokens are high-entropy random values (not JWTs).</li>
 *   <li>Only SHA-256 hashes are stored in database and Redis.</li>
 *   <li>Rotation is mandatory — every refresh generates new tokens.</li>
 *   <li>Reuse of revoked tokens triggers family-wide revocation.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Service
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final SessionService sessionService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ApplicationEventPublisher eventPublisher;

    public RefreshTokenService(SessionService sessionService,
                               UserRepository userRepository,
                               JwtTokenProvider jwtTokenProvider,
                               ApplicationEventPublisher eventPublisher) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Creates a new refresh token session for a newly authenticated user.
     *
     * <p>Called by {@link AuthenticationService} after successful password verification.
     * Returns the raw refresh token to be included in the login response.</p>
     *
     * @param user          the authenticated user
     * @param ipAddress     client IP address
     * @param userAgent     client User-Agent
     * @return the raw refresh token (shown once to client)
     */
    @Transactional
    public String createRefreshToken(User user, String ipAddress, String userAgent) {
        return createRefreshToken(user, ipAddress, userAgent, null);
    }

    @Transactional
    public String createRefreshToken(User user, String ipAddress, String userAgent, String familyId) {
        SessionService.RefreshTokenSession session = sessionService.createSession(user, ipAddress, userAgent, familyId);
        log.info("Refresh token created for user={}, sessionId={}, familyId={}",
                 user.getId(), session.sessionId(), session.familyId());
        return session.rawToken();
    }

    /**
     * Refreshes the access token using a valid refresh token.
     *
     * <p>Flow:</p>
     * <ol>
     *   <li>Validate the refresh token format.</li>
     *   <li>Look up the session in Redis/MySQL.</li>
     *   <li>Revoke the old refresh token.</li>
     *   <li>Generate new access token + new refresh token.</li>
     *   <li>Return both tokens to the client.</li>
     * </ol>
     *
     * @param rawRefreshToken the refresh token presented by the client
     * @param ipAddress       client IP address
     * @param userAgent       client User-Agent
     * @return the new access token and refresh token
     * @throws UnauthorizedException if the refresh token is invalid, expired, or revoked
     */
    @Transactional
    public RefreshResult refresh(String rawRefreshToken, String ipAddress, String userAgent) {
        // Validate session
        Optional<SessionService.RefreshTokenSession> sessionOpt =
                sessionService.validateSession(rawRefreshToken, ipAddress);

        if (sessionOpt.isEmpty()) {
            log.warn("Invalid refresh token presented from ip={}", ipAddress);
            throw UnauthorizedException.invalidCredentials();
        }

        SessionService.RefreshTokenSession currentSession = sessionOpt.get();

        // Revoke old refresh token (rotation is mandatory)
        sessionService.revokeSession(rawRefreshToken, ipAddress);

        // Look up user
        Optional<User> userOpt = userRepository.findById(UUID.fromString(currentSession.sessionId()));
        if (userOpt.isEmpty()) {
            Optional<String> userIdOpt = sessionService.getUserIdFromSession(currentSession.sessionId());
            if (userIdOpt.isPresent()) {
                userOpt = userRepository.findById(UUID.fromString(userIdOpt.get()));
            }
        }

        if (userOpt.isEmpty()) {
            throw UnauthorizedException.invalidCredentials();
        }

        User user = userOpt.get();

        // Generate new access token
        List<String> roles = loadUserRoleNames(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId().toString(), user.getEmail(), roles, List.of());

        // Generate new refresh token (preserve family ID for reuse detection)
        String newRefreshToken = createRefreshToken(user, ipAddress, userAgent, currentSession.familyId());

        // Publish rotation event
        eventPublisher.publishEvent(new RefreshTokenRotatedEvent(
                user.getId().toString(), user.getId().toString(),
                currentSession.sessionId(), currentSession.sessionId(),
                currentSession.familyId(), ipAddress, LocalDateTime.now()));

        log.info("Token refreshed: userId={}, sessionId={}", user.getId(), currentSession.sessionId());

        return new RefreshResult(newAccessToken, newRefreshToken);
    }

    /**
     * Revokes a specific refresh token.
     *
     * @param rawRefreshToken the token to revoke
     * @param ipAddress       client IP for audit
     * @return true if revoked, false if not found
     */
    @Transactional
    public boolean revokeToken(String rawRefreshToken, String ipAddress) {
        return sessionService.revokeSession(rawRefreshToken, ipAddress);
    }

    /**
     * Revokes all refresh tokens for a user.
     *
     * @param userId the user ID
     */
    @Transactional
    public void revokeAllUserTokens(UUID userId) {
        sessionService.revokeAllUserSessions(userId);
        log.info("All refresh tokens revoked for userId={}", userId);
    }

    /**
     * Gets the active session count for a user.
     *
     * @param userId the user ID
     * @return the number of active sessions
     */
    public long getActiveSessionCount(UUID userId) {
        return sessionService.getActiveSessionCount(userId);
    }

    private List<String> loadUserRoleNames(User user) {
        return user.getRoles().stream()
                .map(ur -> ur.getRole().getName())
                .toList();
    }

    /**
     * Result of a token refresh operation.
     */
    public record RefreshResult(String accessToken, String refreshToken) {}
}
