package com.finflow.modules.auth.domain;

import com.finflow.shared.domain.BaseSoftDeletableEntity;
import jakarta.persistence.*;

/**
 * Authentication secrets (hashed passwords, passkey keys, biometric assertions)
 * associated with a {@link User}.
 *
 * <p>Supports multiple credential types per user. Only one credential per type
 * may be active at a time. Passwords are hashed with Argon2id.</p>
 *
 * <p>Table: {@code finflow_auth.user_credentials}</p>
 *
 * <h3>Business Rules</h3>
 * <ul>
 *   <li>One active credential per type per user.</li>
 *   <li>Password change creates a new credential and revokes the old one.</li>
 *   <li>Revoked credentials retained 90 days for security audit.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 * @see User
 * @see CredentialType
 */
@Entity
@Table(name = "user_credentials", catalog = "finflow_auth")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class UserCredential extends BaseSoftDeletableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_uc_user"))
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "credential_type", nullable = false, length = 20)
    private CredentialType credentialType;

    @Column(name = "hashed_value", nullable = false, length = 255)
    private String hashedValue;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_used_at")
    private java.time.LocalDateTime lastUsedAt;

    @Column(name = "expires_at")
    private java.time.LocalDateTime expiresAt;

    /** Default constructor required by JPA. */
    protected UserCredential() {}

    /**
     * Creates a new credential for the given user.
     *
     * @param user           the owning user
     * @param credentialType the type of credential
     * @param hashedValue    the Argon2-hashed (or passkey) value
     */
    public UserCredential(User user, CredentialType credentialType, String hashedValue) {
        this.user = user;
        this.credentialType = credentialType;
        this.hashedValue = hashedValue;
        this.isActive = true;
    }

    /**
     * Revokes (deactivates) this credential.
     */
    public void revoke() {
        this.isActive = false;
        softDelete(user.getId().toString());
    }

    /**
     * Records that this credential was used at the given time.
     */
    public void recordUsage() {
        this.lastUsedAt = java.time.LocalDateTime.now();
    }

    // ---- Getters ----

    public User getUser() {
        return user;
    }

    public CredentialType getCredentialType() {
        return credentialType;
    }

    public String getHashedValue() {
        return hashedValue;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public java.time.LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }

    public java.time.LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}
