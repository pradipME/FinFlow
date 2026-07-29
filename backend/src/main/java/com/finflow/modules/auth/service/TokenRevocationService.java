package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.RefreshToken;
import com.finflow.modules.auth.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Handles refresh token revocation operations and cleanup.
 *
 * <p>Provides revocation capabilities for individual tokens, user-wide revocation
 * (security events), and periodic cleanup of expired tokens.</p>
 *
 * <h3>Revocation Strategies</h3>
 * <ul>
 *   <li><strong>Single token:</strong> Revoke one specific refresh token.</li>
 *   <li><strong>User-wide:</strong> Revoke all tokens for a user (password change, compromise).</li>
 *   <li><strong>Family:</strong> Revoke all tokens in a family (reuse detection).</li>
 *   <li><strong>Global:</strong> Revoke all tokens (system-wide security event).</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Service
public class TokenRevocationService {

    private static final Logger log = LoggerFactory.getLogger(TokenRevocationService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisSessionCache redisSessionCache;
    private final ApplicationEventPublisher eventPublisher;

    public TokenRevocationService(RefreshTokenRepository refreshTokenRepository,
                                  RedisSessionCache redisSessionCache,
                                  ApplicationEventPublisher eventPublisher) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.redisSessionCache = redisSessionCache;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Revokes a specific refresh token by its hash.
     *
     * @param tokenHash the SHA-256 hash of the token to revoke
     * @param ipAddress client IP for audit logging
     * @return true if the token was revoked, false if not found or already revoked
     */
    @Transactional
    public boolean revokeByTokenHash(String tokenHash, String ipAddress) {
        var tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);
        if (tokenOpt.isEmpty()) {
            return false;
        }

        RefreshToken token = tokenOpt.get();
        if (Boolean.TRUE.equals(token.getIsRevoked())) {
            return false;
        }

        token.revoke();
        refreshTokenRepository.save(token);

        // Remove from Redis
        redisSessionCache.removeSession(token.getSessionId(), token.getUser().getId().toString());
        long remainingSeconds = java.time.Duration.between(LocalDateTime.now(), token.getExpiresAt()).getSeconds();
        if (remainingSeconds > 0) {
            redisSessionCache.markRevoked(tokenHash, remainingSeconds);
        }

        log.info("Token revoked: sessionId={}, userId={}, ip={}",
                 token.getSessionId(), token.getUser().getId(), ipAddress);

        eventPublisher.publishEvent(new RefreshTokenRevokedEvent(
                token.getSessionId(), token.getUser().getId().toString(),
                token.getSessionId(), ipAddress, "USER_INITIATED", LocalDateTime.now()));

        return true;
    }

    /**
     * Revokes all refresh tokens for a user.
     *
     * <p>Triggered by security events such as:</p>
     * <ul>
     *   <li>Password change</li>
     *   <li>Account compromise detected</li>
     *   <li>Admin-initiated lockout</li>
     * </ul>
     *
     * @param userId    the user ID
     * @param ipAddress client IP for audit logging
     */
    @Transactional
    public void revokeAllForUser(UUID userId, String ipAddress) {
        refreshTokenRepository.revokeAllByUserId(userId, LocalDateTime.now());
        redisSessionCache.removeAllUserSessions(userId.toString());

        log.warn("All refresh tokens revoked for userId={}, ip={}", userId, ipAddress);
    }

    /**
     * Revokes all refresh tokens in a family (reuse detection response).
     *
     * @param familyId  the family ID to revoke
     * @param ipAddress client IP for audit logging
     */
    @Transactional
    public void revokeFamily(String familyId, String ipAddress) {
        refreshTokenRepository.revokeAllByFamilyId(familyId, LocalDateTime.now());

        // Remove family sessions from Redis
        List<RefreshToken> familyTokens = refreshTokenRepository.findAllByFamilyId(familyId);
        for (RefreshToken token : familyTokens) {
            if (token.getUser() != null) {
                redisSessionCache.removeSession(token.getSessionId(), token.getUser().getId().toString());
                redisSessionCache.markRevoked(token.getRefreshTokenHash(), 0);
            }
        }

        log.warn("Token family revoked: familyId={}, ip={}, affectedTokens={}",
                 familyId, ipAddress, familyTokens.size());
    }

    /**
     * Cleans up expired tokens from the database.
     *
     * <p>Scheduled to run daily. Removes tokens that have been expired for more
     * than 7 days to allow for any late audit queries.</p>
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<RefreshToken> expiredTokens = refreshTokenRepository.findExpiredNotRevoked(cutoff);

        for (RefreshToken token : expiredTokens) {
            token.revoke();
        }
        refreshTokenRepository.saveAll(expiredTokens);

        log.info("Cleaned up {} expired refresh tokens", expiredTokens.size());
    }

    /**
     * Gets the active session count for a user.
     *
     * @param userId the user ID
     * @return the count of active sessions
     */
    public long getActiveSessionCount(UUID userId) {
        return refreshTokenRepository.countActiveByUserId(userId);
    }
}
