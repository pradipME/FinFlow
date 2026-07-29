package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link RefreshToken} entities.
 *
 * <p>Refresh tokens are append-only with soft revocation: rows are never deleted.
 * Queries support token lookup, rotation, reuse detection, and cleanup operations.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /**
     * Finds an active (not revoked, not expired) refresh token by its SHA-256 hash.
     *
     * <p>Primary lookup path for refresh operations. Returns empty if the token
     * has been revoked or expired.</p>
     *
     * @param tokenHash the SHA-256 hash of the raw refresh token
     * @return the active token if found, empty otherwise
     */
    @Query("SELECT rt FROM RefreshToken rt " +
           "WHERE rt.refreshTokenHash = :tokenHash " +
           "AND rt.isRevoked = false " +
           "AND rt.expiresAt > CURRENT_TIMESTAMP")
    Optional<RefreshToken> findActiveByTokenHash(@Param("tokenHash") String tokenHash);

    /**
     * Finds any refresh token by its hash, regardless of revocation or expiry status.
     *
     * <p>Used for reuse detection: if a revoked token is presented, this query
     * confirms its existence and allows checking its revocation state.</p>
     *
     * @param tokenHash the SHA-256 hash of the raw refresh token
     * @return the token if found, empty otherwise
     */
    @Query("SELECT rt FROM RefreshToken rt " +
           "WHERE rt.refreshTokenHash = :tokenHash")
    Optional<RefreshToken> findByTokenHash(@Param("tokenHash") String tokenHash);

    /**
     * Finds the active refresh token for a given session.
     *
     * @param sessionId the session identifier
     * @return the active token if found, empty otherwise
     */
    @Query("SELECT rt FROM RefreshToken rt " +
           "WHERE rt.sessionId = :sessionId " +
           "AND rt.isRevoked = false " +
           "AND rt.expiresAt > CURRENT_TIMESTAMP")
    Optional<RefreshToken> findActiveBySessionId(@Param("sessionId") String sessionId);

    /**
     * Finds all active refresh tokens for a user.
     *
     * <p>Used for session listing and bulk revocation operations.</p>
     *
     * @param userId the user ID
     * @return list of active tokens
     */
    @Query("SELECT rt FROM RefreshToken rt " +
           "WHERE rt.user.id = :userId " +
           "AND rt.isRevoked = false " +
           "AND rt.expiresAt > CURRENT_TIMESTAMP " +
           "ORDER BY rt.createdAt DESC")
    List<RefreshToken> findActiveByUserId(@Param("userId") UUID userId);

    /**
     * Finds all tokens in a family for reuse detection.
     *
     * <p>When a revoked token is reused, all tokens in the same family
     * must be revoked to prevent further unauthorized access.</p>
     *
     * @param familyId the token family identifier
     * @return list of tokens in the family
     */
    @Query("SELECT rt FROM RefreshToken rt " +
           "WHERE rt.familyId = :familyId " +
           "ORDER BY rt.createdAt DESC")
    List<RefreshToken> findAllByFamilyId(@Param("familyId") String familyId);

    /**
     * Revokes all active tokens in a family.
     *
     * <p>Used during reuse detection to immediately revoke all tokens
     * that share the same family ID as the compromised token.</p>
     *
     * @param familyId  the token family identifier
     * @param revokedAt the revocation timestamp
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true, rt.revokedAt = :revokedAt " +
           "WHERE rt.familyId = :familyId " +
           "AND rt.isRevoked = false")
    void revokeAllByFamilyId(@Param("familyId") String familyId,
                             @Param("revokedAt") LocalDateTime revokedAt);

    /**
     * Revokes all active tokens for a user.
     *
     * <p>Used for security events like password change, compromise detection,
     * or administrative lockout.</p>
     *
     * @param userId    the user ID
     * @param revokedAt the revocation timestamp
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true, rt.revokedAt = :revokedAt " +
           "WHERE rt.user.id = :userId " +
           "AND rt.isRevoked = false")
    void revokeAllByUserId(@Param("userId") UUID userId,
                           @Param("revokedAt") LocalDateTime revokedAt);

    /**
     * Finds expired tokens that have not been revoked.
     *
     * <p>Used for periodic cleanup to remove expired token records
     * from the database.</p>
     *
     * @param expiresBefore the expiration cutoff
     * @return list of expired, non-revoked tokens
     */
    @Query("SELECT rt FROM RefreshToken rt " +
           "WHERE rt.expiresAt < :expiresBefore " +
           "AND rt.isRevoked = false")
    List<RefreshToken> findExpiredNotRevoked(@Param("expiresBefore") LocalDateTime expiresBefore);

    /**
     * Counts active sessions for a user.
     *
     * <p>Used for session management UI and security monitoring.</p>
     *
     * @param userId the user ID
     * @return the count of active sessions
     */
    @Query("SELECT COUNT(rt) FROM RefreshToken rt " +
           "WHERE rt.user.id = :userId " +
           "AND rt.isRevoked = false " +
           "AND rt.expiresAt > CURRENT_TIMESTAMP")
    long countActiveByUserId(@Param("userId") UUID userId);
}
