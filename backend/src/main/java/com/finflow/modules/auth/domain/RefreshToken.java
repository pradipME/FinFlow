package com.finflow.modules.auth.domain;

import com.finflow.shared.domain.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

/**
 * Persistent refresh token record for session management and security audit.
 *
 * <p>A {@code RefreshToken} represents an active user session on the FinFlow
 * platform. The raw token is never stored — only its SHA-256 hash is persisted.
 * Each token belongs to a {@link User} and tracks device context (IP, User-Agent).</p>
 *
 * <p>Table: {@code finflow_auth.refresh_tokens}</p>
 *
 * <h3>Security Design</h3>
 * <ul>
 *   <li>Raw refresh tokens are NEVER stored — only SHA-256 hashes.</li>
 *   <li>Token rotation creates a new record and revokes the old one.</li>
 *   <li>{@code family_id} links rotated tokens for reuse detection.</li>
 *   <li>If a revoked token is reused, it indicates a token theft — the entire
 *       family must be revoked and a security alert triggered.</li>
 *   <li>Rows are soft-revoked (never deleted) to preserve audit trail.</li>
 * </ul>
 *
 * <h3>Business Rules</h3>
 * <ul>
 *   <li>Refresh tokens expire after 30 days.</li>
 *   <li>Each refresh request generates new access + refresh tokens.</li>
 *   <li>The old refresh token is immediately revoked upon rotation.</li>
 *   <li>Reuse of a revoked token triggers revocation of the entire family.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Entity
@Table(name = "refresh_tokens", schema = "finflow_auth")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class RefreshToken extends BaseEntity {

    /**
     * The user who owns this refresh token.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_rt_user"))
    private User user;

    /**
     * Unique session identifier linking this record to the Redis session cache.
     * Generated as UUID v4 on token creation.
     */
    @Column(name = "session_id", nullable = false, unique = true, length = 36, columnDefinition = "CHAR(36)")
    private String sessionId;

    /**
     * Family identifier linking all tokens produced by rotation from the same
     * original token. Used for reuse detection — if a revoked token is presented,
     * all tokens in the same family are revoked.
     */
    @Column(name = "family_id", nullable = false, length = 36, columnDefinition = "CHAR(36)")
    private String familyId;

    /**
     * SHA-256 hash of the raw refresh token. The raw token is returned to the
     * client exactly once and never stored.
     */
    @Column(name = "refresh_token_hash", nullable = false, length = 64)
    private String refreshTokenHash;

    /**
     * Soft revocation flag. When {@code true}, this token can no longer be used
     * for refresh operations.
     */
    @Column(name = "is_revoked", nullable = false)
    private Boolean isRevoked = false;

    /**
     * Timestamp when the token was revoked. {@code null} if not yet revoked.
     */
    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    /**
     * When the token expires. After this time, the token is automatically invalid.
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Client IP address at the time of token creation.
     */
    @Column(name = "created_ip", length = 45)
    private String createdIp;

    /**
     * HTTP User-Agent at the time of token creation.
     */
    @Column(name = "created_user_agent", length = 500)
    private String createdUserAgent;

    /**
     * Last time this token was used to refresh. Updated on each rotation.
     */
    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    /**
     * IP address of the last refresh request using this token.
     */
    @Column(name = "last_used_ip", length = 45)
    private String lastUsedIp;

    /** Default constructor required by JPA. */
    protected RefreshToken() {}

    /**
     * Creates a new refresh token record.
     *
     * @param user              the owning user
     * @param sessionId         unique session identifier (UUID)
     * @param familyId          token family identifier for reuse detection
     * @param refreshTokenHash  SHA-256 hash of the raw token
     * @param expiresAt         when this token expires
     * @param createdIp         client IP at creation
     * @param createdUserAgent  client User-Agent at creation
     */
    public RefreshToken(User user, String sessionId, String familyId,
                        String refreshTokenHash, LocalDateTime expiresAt,
                        String createdIp, String createdUserAgent) {
        this.user = user;
        this.sessionId = sessionId;
        this.familyId = familyId;
        this.refreshTokenHash = refreshTokenHash;
        this.expiresAt = expiresAt;
        this.createdIp = createdIp;
        this.createdUserAgent = createdUserAgent;
        this.isRevoked = false;
    }

    // ---- Business Methods ----

    /**
     * Marks this token as revoked.
     *
     * @throws IllegalStateException if the token is already revoked
     */
    public void revoke() {
        if (Boolean.TRUE.equals(this.isRevoked)) {
            throw new IllegalStateException("Token is already revoked: " + this.sessionId);
        }
        this.isRevoked = true;
        this.revokedAt = LocalDateTime.now();
    }

    /**
     * Records that this token was used for a refresh operation.
     *
     * @param usedIp the IP address of the refresh request
     */
    public void recordUsage(String usedIp) {
        this.lastUsedAt = LocalDateTime.now();
        this.lastUsedIp = usedIp;
    }

    /**
     * Checks whether this token has expired.
     *
     * @return {@code true} if the current time is after the expiration time
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    /**
     * Checks whether this token is currently valid (not revoked and not expired).
     *
     * @return {@code true} if the token can be used for refresh operations
     */
    public boolean isValid() {
        return !Boolean.TRUE.equals(this.isRevoked) && !isExpired();
    }

    // ---- Getters ----

    public User getUser() {
        return user;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getFamilyId() {
        return familyId;
    }

    public String getRefreshTokenHash() {
        return refreshTokenHash;
    }

    public Boolean getIsRevoked() {
        return isRevoked;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public String getCreatedIp() {
        return createdIp;
    }

    public String getCreatedUserAgent() {
        return createdUserAgent;
    }

    public LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }

    public String getLastUsedIp() {
        return lastUsedIp;
    }

    // ---- equals / hashCode ----

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RefreshToken that = (RefreshToken) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
