package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * JPA repository for {@link LoginHistory} entities.
 *
 * <p>Login history is append-only: no update or delete operations are
 * performed through this repository. Queries are read-only and used
 * for security monitoring, brute-force detection, and audit purposes.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    /**
     * Counts failed login attempts for a user within a time window.
     *
     * <p>Used by the lockout logic to determine whether the account
     * should be locked after a new failed attempt. Only counts rows
     * where {@code user_id} matches (non-null) and {@code success = false}.</p>
     *
     * @param userId    the user ID
     * @param since     the start of the time window (inclusive)
     * @return the number of failed attempts
     */
    @Query("SELECT COUNT(lh) FROM LoginHistory lh " +
           "WHERE lh.user.id = :userId " +
           "AND lh.success = false " +
           "AND lh.createdAt >= :since")
    long countFailedAttemptsByUserSince(
            @Param("userId") java.util.UUID userId,
            @Param("since") LocalDateTime since);

    /**
     * Finds the most recent login history entries for a user, ordered by time.
     *
     * <p>Used for display in account settings and security dashboards.
     * Results are ordered newest-first.</p>
     *
     * @param userId the user ID
     * @param limit  maximum number of results
     * @return list of login history entries, newest first
     */
    @Query("SELECT lh FROM LoginHistory lh " +
           "WHERE lh.user.id = :userId " +
           "ORDER BY lh.createdAt DESC")
    List<LoginHistory> findRecentByUser(
            @Param("userId") java.util.UUID userId,
            org.springframework.data.domain.Pageable limit);

    /**
     * Counts failed attempts for a given identifier (email or username)
     * regardless of whether the user exists.
     *
     * <p>Used for rate-limiting login attempts by identifier. This catches
     * brute-force attacks even when the attacker rotates between different
     * non-existent email addresses from the same IP.</p>
     *
     * @param identifier the submitted email or username
     * @param since      the start of the time window (inclusive)
     * @return the number of failed attempts with that identifier
     */
    @Query("SELECT COUNT(lh) FROM LoginHistory lh " +
           "WHERE lh.identifier = :identifier " +
           "AND lh.success = false " +
           "AND lh.createdAt >= :since")
    long countFailedAttemptsByIdentifierSince(
            @Param("identifier") String identifier,
            @Param("since") LocalDateTime since);

    /**
     * Counts failed login attempts from a specific IP address within a time window.
     *
     * <p>Used for IP-based rate limiting and brute-force detection across
     * multiple accounts.</p>
     *
     * @param ipAddress the client IP address
     * @param since     the start of the time window (inclusive)
     * @return the number of failed attempts from that IP
     */
    @Query("SELECT COUNT(lh) FROM LoginHistory lh " +
           "WHERE lh.ipAddress = :ipAddress " +
           "AND lh.success = false " +
           "AND lh.createdAt >= :since")
    long countFailedAttemptsByIpSince(
            @Param("ipAddress") String ipAddress,
            @Param("since") LocalDateTime since);
}
