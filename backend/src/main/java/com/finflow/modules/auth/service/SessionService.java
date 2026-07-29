package com.finflow.modules.auth.service;

import com.finflow.modules.auth.config.SessionProperties;
import com.finflow.modules.auth.domain.RefreshToken;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {

    private static final Logger log = LoggerFactory.getLogger(SessionService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisSessionCache redisSessionCache;
    private final TokenHashService tokenHashService;
    private final ApplicationEventPublisher eventPublisher;
    private final SessionProperties sessionProperties;
    private final TokenRotationService tokenRotationService;

    public SessionService(RefreshTokenRepository refreshTokenRepository,
                          RedisSessionCache redisSessionCache,
                          TokenHashService tokenHashService,
                          ApplicationEventPublisher eventPublisher,
                          SessionProperties sessionProperties,
                          TokenRotationService tokenRotationService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.redisSessionCache = redisSessionCache;
        this.tokenHashService = tokenHashService;
        this.eventPublisher = eventPublisher;
        this.sessionProperties = sessionProperties;
        this.tokenRotationService = tokenRotationService;
    }

    @Transactional
    public RefreshTokenSession createSession(User user, String ipAddress, String userAgent) {
        return createSession(user, ipAddress, userAgent, null);
    }

    @Transactional
    public RefreshTokenSession createSession(User user, String ipAddress, String userAgent, String familyId) {
        String rawToken = tokenHashService.generateRefreshToken();
        String tokenHash = tokenHashService.hashToken(rawToken);
        String sessionId = tokenHashService.generateSessionId();
        if (familyId == null) {
            familyId = tokenHashService.generateFamilyId();
        }

        LocalDateTime now = LocalDateTime.now();
        long ttlDays = sessionProperties.refreshTokenTtlDays();
        LocalDateTime expiresAt = now.plusDays(ttlDays);

        RefreshToken refreshToken = new RefreshToken(
                user, sessionId, familyId, tokenHash, expiresAt, ipAddress, userAgent);
        refreshToken = refreshTokenRepository.save(refreshToken);

        long ttlSeconds = ttlDays * 24 * 60 * 60;
        redisSessionCache.storeSession(sessionId, user.getId().toString(),
                                        tokenHash, ttlSeconds);

        log.info("Session created: userId={}, sessionId={}, expiresAt={}",
                 user.getId(), sessionId, expiresAt);

        eventPublisher.publishEvent(new RefreshTokenCreatedEvent(
                sessionId, user.getId().toString(), sessionId, familyId, ipAddress, now));

        enforceSessionLimit(user);

        return new RefreshTokenSession(rawToken, sessionId, familyId, tokenHash, expiresAt);
    }

    public Optional<RefreshTokenSession> validateSession(String rawToken, String ipAddress) {
        String tokenHash = tokenHashService.hashToken(rawToken);

        if (redisSessionCache.isRevoked(tokenHash)) {
            log.warn("Revoked token presented for validation: hash={}", tokenHash.substring(0, 8) + "...");
            return Optional.empty();
        }

        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findActiveByTokenHash(tokenHash);
        if (tokenOpt.isEmpty()) {
            Optional<RefreshToken> revokedToken = refreshTokenRepository.findByTokenHash(tokenHash);
                if (revokedToken.isPresent()) {
                log.warn("REUSE DETECTED: Revoked token presented: sessionId={}, familyId={}, userId={}",
                         revokedToken.get().getSessionId(),
                         revokedToken.get().getFamilyId(),
                         revokedToken.get().getUser().getId());

                tokenRotationService.handleTokenReuse(tokenHash);

                return Optional.empty();
            }
            return Optional.empty();
        }

        RefreshToken token = tokenOpt.get();
        token.recordUsage(ipAddress);
        refreshTokenRepository.save(token);

        return Optional.of(new RefreshTokenSession(
                rawToken, token.getSessionId(), token.getFamilyId(),
                token.getRefreshTokenHash(), token.getExpiresAt()));
    }

    @Transactional
    public boolean revokeSession(String rawToken, String ipAddress) {
        String tokenHash = tokenHashService.hashToken(rawToken);
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);

        if (tokenOpt.isEmpty()) {
            return false;
        }

        RefreshToken token = tokenOpt.get();
        token.revoke();
        refreshTokenRepository.save(token);

        redisSessionCache.removeSession(token.getSessionId(), token.getUser().getId().toString());
        long remainingSeconds = Duration.between(LocalDateTime.now(), token.getExpiresAt()).getSeconds();
        if (remainingSeconds > 0) {
            redisSessionCache.markRevoked(tokenHash, remainingSeconds);
        }

        log.info("Session revoked: userId={}, sessionId={}, ip={}",
                 token.getUser().getId(), token.getSessionId(), ipAddress);

        return true;
    }

    @Transactional
    public void revokeAllUserSessions(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId, LocalDateTime.now());
        redisSessionCache.removeAllUserSessions(userId.toString());
        log.info("All sessions revoked for userId={}", userId);
    }

    public long getActiveSessionCount(UUID userId) {
        return refreshTokenRepository.countActiveByUserId(userId);
    }

    public Optional<String> getUserIdFromSession(String sessionId) {
        return redisSessionCache.getSessionUserId(sessionId);
    }

    public long getRefreshTokenLifetimeDays() {
        return sessionProperties.refreshTokenTtlDays();
    }

    public long getRefreshTokenLifetimeSeconds() {
        return sessionProperties.refreshTokenTtlDays() * 24 * 60 * 60;
    }

    public int getMaxActiveSessions() {
        return sessionProperties.maxActiveSessions();
    }

    private void enforceSessionLimit(User user) {
        int maxSessions = sessionProperties.maxActiveSessions();
        long activeCount = refreshTokenRepository.countActiveByUserId(user.getId());

        if (activeCount <= maxSessions) {
            return;
        }

        int toRevoke = (int) (activeCount - maxSessions);
        List<RefreshToken> activeTokens = refreshTokenRepository.findActiveByUserId(user.getId());

        // Revoke oldest tokens (they appear last since query orders by createdAt DESC)
        for (int i = activeTokens.size() - 1; i >= 0 && toRevoke > 0; i--) {
            RefreshToken oldest = activeTokens.get(i);
            oldest.revoke();
            refreshTokenRepository.save(oldest);
            redisSessionCache.removeSession(oldest.getSessionId(), user.getId().toString());
            toRevoke--;
            log.info("Session limit exceeded: revoked oldest session userId={}, sessionId={}, maxSessions={}",
                     user.getId(), oldest.getSessionId(), maxSessions);
        }
    }

    public record RefreshTokenSession(
            String rawToken,
            String sessionId,
            String familyId,
            String tokenHash,
            LocalDateTime expiresAt
    ) {}
}
