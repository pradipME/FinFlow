package com.finflow.modules.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Redis-backed session cache for active refresh token sessions.
 *
 * <p>Provides fast in-memory lookup for refresh token validation, bypassing
 * the database for the common case. The cache stores session metadata
 * (session ID, user ID, token hash) with TTL matching the refresh token lifetime.</p>
 *
 * <h3>Architecture</h3>
 * <ul>
 *   <li><strong>Write-through:</strong> Sessions are written to both Redis and MySQL.</li>
 *   <li><strong>Read-through:</strong> On Redis miss, the system falls back to MySQL.</li>
 *   <li><strong>Invalidation:</strong> On revocation, both Redis and MySQL are updated.</li>
 * </ul>
 *
 * <h3>Redis Key Structure</h3>
 * <pre>
 *   finflow:session:{sessionId}           → {userId, tokenHash, expiresAt}
 *   finflow:user:sessions:{userId}        → Set of active sessionIds
 *   finflow:revoked:{tokenHash}           → "1" (TTL = token remaining lifetime)
 * </pre>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Component
public class RedisSessionCache {

    private static final Logger log = LoggerFactory.getLogger(RedisSessionCache.class);

    private static final String SESSION_KEY_PREFIX = "finflow:session:";
    private static final String USER_SESSIONS_KEY_PREFIX = "finflow:user:sessions:";
    private static final String REVOKED_KEY_PREFIX = "finflow:revoked:";

    private final StringRedisTemplate redisTemplate;

    public RedisSessionCache(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Stores a session in the Redis cache.
     *
     * @param sessionId   the session identifier
     * @param userId      the user ID
     * @param tokenHash   the SHA-256 hash of the refresh token
     * @param ttlSeconds  time-to-live in seconds
     */
    public void storeSession(String sessionId, String userId, String tokenHash, long ttlSeconds) {
        try {
            String sessionKey = SESSION_KEY_PREFIX + sessionId;
            String userSessionsKey = USER_SESSIONS_KEY_PREFIX + userId;

            redisTemplate.opsForHash().put(sessionKey, "userId", userId);
            redisTemplate.opsForHash().put(sessionKey, "tokenHash", tokenHash);
            redisTemplate.opsForHash().put(sessionKey, "sessionId", sessionId);
            redisTemplate.expire(sessionKey, Duration.ofSeconds(ttlSeconds));

            redisTemplate.opsForSet().add(userSessionsKey, sessionId);
            redisTemplate.expire(userSessionsKey, Duration.ofSeconds(ttlSeconds));

            log.debug("Session stored in Redis: sessionId={}, userId={}, ttl={}s",
                      sessionId, userId, ttlSeconds);
        } catch (Exception e) {
            log.error("Failed to store session in Redis: sessionId={}", sessionId, e);
        }
    }

    /**
     * Retrieves session data from Redis.
     *
     * @param sessionId the session identifier
     * @return an Optional containing the token hash if found, empty otherwise
     */
    public Optional<String> getSessionTokenHash(String sessionId) {
        try {
            String sessionKey = SESSION_KEY_PREFIX + sessionId;
            Object tokenHash = redisTemplate.opsForHash().get(sessionKey, "tokenHash");
            if (tokenHash != null) {
                return Optional.of(tokenHash.toString());
            }
        } catch (Exception e) {
            log.error("Failed to retrieve session from Redis: sessionId={}", sessionId, e);
        }
        return Optional.empty();
    }

    /**
     * Retrieves the user ID for a session.
     *
     * @param sessionId the session identifier
     * @return an Optional containing the user ID if found, empty otherwise
     */
    public Optional<String> getSessionUserId(String sessionId) {
        try {
            String sessionKey = SESSION_KEY_PREFIX + sessionId;
            Object userId = redisTemplate.opsForHash().get(sessionKey, "userId");
            if (userId != null) {
                return Optional.of(userId.toString());
            }
        } catch (Exception e) {
            log.error("Failed to retrieve session userId from Redis: sessionId={}", sessionId, e);
        }
        return Optional.empty();
    }

    /**
     * Removes a session from the Redis cache.
     *
     * @param sessionId the session identifier
     * @param userId    the user ID (for user sessions set cleanup)
     */
    public void removeSession(String sessionId, String userId) {
        try {
            String sessionKey = SESSION_KEY_PREFIX + sessionId;
            String userSessionsKey = USER_SESSIONS_KEY_PREFIX + userId;

            redisTemplate.delete(sessionKey);
            redisTemplate.opsForSet().remove(userSessionsKey, sessionId);

            log.debug("Session removed from Redis: sessionId={}", sessionId);
        } catch (Exception e) {
            log.error("Failed to remove session from Redis: sessionId={}", sessionId, e);
        }
    }

    /**
     * Marks a token hash as revoked in Redis.
     *
     * <p>Used for fast revocation checks without hitting the database.
     * The revoked marker expires automatically after the token's remaining lifetime.</p>
     *
     * @param tokenHash   the SHA-256 hash of the revoked token
     * @param ttlSeconds  remaining token lifetime in seconds
     */
    public void markRevoked(String tokenHash, long ttlSeconds) {
        try {
            String revokedKey = REVOKED_KEY_PREFIX + tokenHash;
            redisTemplate.opsForValue().set(revokedKey, "1", Duration.ofSeconds(ttlSeconds));
            log.debug("Token marked as revoked in Redis: hash={}", tokenHash.substring(0, 8) + "...");
        } catch (Exception e) {
            log.error("Failed to mark token as revoked in Redis", e);
        }
    }

    /**
     * Checks if a token hash is marked as revoked in Redis.
     *
     * @param tokenHash the SHA-256 hash to check
     * @return {@code true} if the token is revoked
     */
    public boolean isRevoked(String tokenHash) {
        try {
            String revokedKey = REVOKED_KEY_PREFIX + tokenHash;
            return Boolean.TRUE.equals(redisTemplate.hasKey(revokedKey));
        } catch (Exception e) {
            log.error("Failed to check revoked status in Redis", e);
            return false;
        }
    }

    /**
     * Removes all sessions for a user from Redis.
     *
     * @param userId the user ID
     */
    public void removeAllUserSessions(String userId) {
        try {
            String userSessionsKey = USER_SESSIONS_KEY_PREFIX + userId;
            Set<String> sessionIds = redisTemplate.opsForSet().members(userSessionsKey);
            if (sessionIds != null) {
                for (String sessionId : sessionIds) {
                    redisTemplate.delete(SESSION_KEY_PREFIX + sessionId);
                }
            }
            redisTemplate.delete(userSessionsKey);
            log.debug("All sessions removed from Redis for user={}", userId);
        } catch (Exception e) {
            log.error("Failed to remove all user sessions from Redis: userId={}", userId, e);
        }
    }

    /**
     * Gets the count of active sessions for a user.
     *
     * @param userId the user ID
     * @return the number of active sessions
     */
    public long getUserSessionCount(String userId) {
        try {
            String userSessionsKey = USER_SESSIONS_KEY_PREFIX + userId;
            Long count = redisTemplate.opsForSet().size(userSessionsKey);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Failed to get session count from Redis: userId={}", userId, e);
            return 0;
        }
    }
}
