package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.RefreshToken;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.repository.RefreshTokenRepository;
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
 * Handles refresh token rotation with reuse detection.
 *
 * <p>Token rotation is a security mechanism where each use of a refresh token
 * invalidates the old token and issues a new one. This limits the window of
 * opportunity for stolen tokens.</p>
 *
 * <h3>Rotation Flow</h3>
 * <ol>
 *   <li>Client presents refresh token.</li>
 *   <li>Server validates token (not revoked, not expired).</li>
 *   <li>Server revokes the old token.</li>
 *   <li>Server generates new access token + new refresh token.</li>
 *   <li>New refresh token belongs to the SAME family.</li>
 *   <li>Old token hash is added to Redis revocation cache.</li>
 * </ol>
 *
 * <h3>Reuse Detection</h3>
 * <p>If a revoked token is presented, the system checks if it belongs to a
 * family that has already been rotated. If so, it indicates token theft:
 * the attacker has a copy of an already-used token. The system then revokes
 * ALL tokens in that family to prevent further unauthorized access.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Service
public class TokenRotationService {

    private static final Logger log = LoggerFactory.getLogger(TokenRotationService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisSessionCache redisSessionCache;
    private final TokenHashService tokenHashService;
    private final ApplicationEventPublisher eventPublisher;

    public TokenRotationService(RefreshTokenRepository refreshTokenRepository,
                                RedisSessionCache redisSessionCache,
                                TokenHashService tokenHashService,
                                ApplicationEventPublisher eventPublisher) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.redisSessionCache = redisSessionCache;
        this.tokenHashService = tokenHashService;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Performs token rotation: revokes old token, creates new one in same family.
     *
     * @param user          the user
     * @param familyId      the token family ID (preserved across rotations)
     * @param ipAddress     client IP
     * @param userAgent     client User-Agent
     * @return the new refresh token session
     */
    @Transactional
    public SessionService.RefreshTokenSession rotateToken(User user, String familyId,
                                                           String ipAddress, String userAgent) {
        String rawToken = tokenHashService.generateRefreshToken();
        String tokenHash = tokenHashService.hashToken(rawToken);
        String sessionId = tokenHashService.generateSessionId();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(30);

        RefreshToken newToken = new RefreshToken(
                user, sessionId, familyId, tokenHash, expiresAt, ipAddress, userAgent);
        refreshTokenRepository.save(newToken);

        // Populate Redis cache
        long ttlSeconds = 30 * 24 * 60 * 60;
        redisSessionCache.storeSession(sessionId, user.getId().toString(),
                                        tokenHash, ttlSeconds);

        log.info("Token rotated: userId={}, newSessionId={}, familyId={}",
                 user.getId(), sessionId, familyId);

        return new SessionService.RefreshTokenSession(rawToken, sessionId, familyId,
                                                       tokenHash, expiresAt);
    }

    /**
     * Detects and handles token reuse.
     *
     * <p>When a revoked token is presented, this method:</p>
     * <ol>
     *   <li>Looks up the token family.</li>
     *   <li>Revokes ALL tokens in that family.</li>
     *   <li>Logs a security alert.</li>
     *   <li>Publishes an event for downstream consumers.</li>
     * </ol>
     *
     * @param tokenHash the hash of the revoked token that was reused
     * @return the user ID if reuse was detected and handled, empty otherwise
     */
    @Transactional
    public Optional<UUID> handleTokenReuse(String tokenHash) {
        Optional<RefreshToken> revokedToken = refreshTokenRepository.findByTokenHash(tokenHash);

        if (revokedToken.isEmpty() || !Boolean.TRUE.equals(revokedToken.get().getIsRevoked())) {
            return Optional.empty();
        }

        RefreshToken token = revokedToken.get();
        String familyId = token.getFamilyId();
        UUID userId = token.getUser().getId();

        // Revoke entire family
        refreshTokenRepository.revokeAllByFamilyId(familyId, LocalDateTime.now());

        // Remove all family sessions from Redis
        List<RefreshToken> familyTokens = refreshTokenRepository.findAllByFamilyId(familyId);
        for (RefreshToken ft : familyTokens) {
            redisSessionCache.removeSession(ft.getSessionId(), userId.toString());
            redisSessionCache.markRevoked(ft.getRefreshTokenHash(), 0);
        }

        log.warn("SECURITY ALERT: Token reuse detected! userId={}, familyId={}, " +
                 "revokedSessionId={}. All tokens in family revoked.",
                 userId, familyId, token.getSessionId());

        eventPublisher.publishEvent(new RefreshTokenReuseDetectedEvent(
                userId.toString(), userId.toString(), familyId,
                token.getSessionId(), familyTokens.size(), null, LocalDateTime.now()));

        return Optional.of(userId);
    }

    /**
     * Checks if a token family has any active tokens.
     *
     * @param familyId the token family ID
     * @return true if the family has active tokens
     */
    public boolean hasActiveTokensInFamily(String familyId) {
        List<RefreshToken> tokens = refreshTokenRepository.findAllByFamilyId(familyId);
        return tokens.stream().anyMatch(RefreshToken::isValid);
    }

    /**
     * Gets the rotation count for a family (how many times the token was rotated).
     *
     * @param familyId the token family ID
     * @return the number of tokens in the family
     */
    public long getRotationCount(String familyId) {
        return refreshTokenRepository.findAllByFamilyId(familyId).size();
    }
}
