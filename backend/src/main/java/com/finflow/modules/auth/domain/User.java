package com.finflow.modules.auth.domain;

import com.finflow.shared.domain.BaseSoftDeletableEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Core identity record for every person on the FinFlow platform.
 *
 * <p>A {@code User} represents platform identity distinct from a banking
 * relationship (Customer). A user may register without completing KYC.
 * This separation enables the onboarding funnel and regulatory scope
 * management.</p>
 *
 * <p>Table: {@code finflow_auth.users}</p>
 *
 * <h3>Business Rules</h3>
 * <ul>
 *   <li>Email is globally unique (case-insensitive, excluding soft-deleted).</li>
 *   <li>Phone number is globally unique when present.</li>
 *   <li>Username is globally unique.</li>
 *   <li>Users start as {@link UserStatus#ACTIVE}.</li>
 *   <li>Soft-deleted users cannot authenticate.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 * @see UserCredential
 * @see com.finflow.modules.auth.domain.UserRole
 */
@Entity
@Table(name = "users", schema = "finflow_auth")
@EntityListeners({com.finflow.shared.domain.BaseEntityListener.class, org.springframework.data.jpa.domain.support.AuditingEntityListener.class})
public class User extends BaseSoftDeletableEntity {

    @Column(name = "email", nullable = false, length = 254)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "username", nullable = false, length = 30)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 25)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "phone_verified", nullable = false)
    private Boolean phoneVerified = false;

    @Column(name = "terms_accepted_at")
    private LocalDateTime termsAcceptedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "failed_login_count", nullable = false)
    private Integer failedLoginCount = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserCredential> credentials = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserRole> roles = new HashSet<>();

    /** Default constructor required by JPA. */
    protected User() {}

    /**
     * Creates a new User with the required identity fields.
     *
     * @param email              the user's email address (unique)
     * @param username           the desired username (unique)
     * @param phoneNumber        optional phone number in international format
     * @param termsAcceptedAt    timestamp when terms were accepted (required)
     */
    public User(String email, String username, String phoneNumber, LocalDateTime termsAcceptedAt) {
        this.email = email;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.termsAcceptedAt = termsAcceptedAt;
        this.status = UserStatus.ACTIVE;
        this.phoneVerified = false;
        this.failedLoginCount = 0;
    }

    // ---- Business Methods ----

    /**
     * Ensures the user is active.
     *
     * @throws IllegalStateException if the user is soft-deleted
     */
    public void activate() {
        if (Boolean.TRUE.equals(getIsDeleted())) {
            throw new IllegalStateException("Cannot activate a deleted user");
        }
        this.status = UserStatus.ACTIVE;
    }

    /**
     * Suspends the user account for security reasons.
     *
     * @throws IllegalStateException if the user is already closed
     */
    public void suspend() {
        if (this.status == UserStatus.CLOSED) {
            throw new IllegalStateException("Cannot suspend a closed user");
        }
        this.status = UserStatus.SUSPENDED;
    }

    /**
     * Permanently closes the user account.
     *
     * @throws IllegalStateException if the user is already closed
     */
    public void close() {
        if (this.status == UserStatus.CLOSED) {
            throw new IllegalStateException("User is already closed");
        }
        this.status = UserStatus.CLOSED;
    }

    /**
     * Records a failed login attempt and applies lockout if threshold exceeded.
     * Lockout after 5 failures (30 min), escalates after 10 failures (24 hr).
     */
    public void recordFailedLogin() {
        this.failedLoginCount++;
        if (this.failedLoginCount >= 10) {
            this.lockedUntil = LocalDateTime.now().plusHours(24);
        } else if (this.failedLoginCount >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(30);
        }
    }

    /**
     * Resets the failed login counter and clears any lockout.
     */
    public void resetFailedLogins() {
        this.failedLoginCount = 0;
        this.lockedUntil = null;
    }

    /**
     * Records a successful login timestamp.
     */
    public void recordLogin() {
        this.lastLoginAt = LocalDateTime.now();
        resetFailedLogins();
    }

    /**
     * Checks whether the account is currently locked.
     *
     * @return true if the account is locked and the lock period has not expired
     */
    public boolean isLocked() {
        return lockedUntil != null && LocalDateTime.now().isBefore(lockedUntil);
    }

    // ---- Getters ----

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public UserStatus getStatus() {
        return status;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public LocalDateTime getTermsAcceptedAt() {
        return termsAcceptedAt;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public Integer getFailedLoginCount() {
        return failedLoginCount;
    }

    public LocalDateTime getLockedUntil() {
        return lockedUntil;
    }

    public Set<UserCredential> getCredentials() {
        return credentials;
    }

    public Set<UserRole> getRoles() {
        return roles;
    }
}
