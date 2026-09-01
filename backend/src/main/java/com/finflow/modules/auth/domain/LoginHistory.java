package com.finflow.modules.auth.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Immutable record of a single authentication attempt on the FinFlow platform.
 *
 * <p>Every login attempt — whether successful or failed — is recorded in this
 * table for security monitoring, forensic investigation, and regulatory compliance
 * (PCI-DSS SAQ-D, SOC 2 CC6.1). The entity is append-only: rows are never
 * updated or deleted.</p>
 *
 * <p>Table: {@code finflow_auth.login_history}</p>
 *
 * <h3>Design Notes</h3>
 * <ul>
 *   <li>Uses {@code BIGINT AUTO_INCREMENT} instead of UUID because this is a
 *       high-volume, append-only event log where monotonic ordering and compact
 *       storage outweigh distributed-system benefits of UUIDs.</li>
 *   <li>{@code user_id} is nullable because attempts for non-existent emails
 *       must still be logged for brute-force detection, but there is no
 *       user FK to reference.</li>
 *   <li>Extends {@code BaseEntity} is intentionally avoided — the table has no
 *       {@code updated_at}, {@code version}, or soft-delete columns.</li>
 * </ul>
 *
 * <h3>Business Rules</h3>
 * <ul>
 *   <li>Rows are immutable — no UPDATE or DELETE operations.</li>
 *   <li>{@code failure_reason} is NULL on success, populated on failure.</li>
 *   <li>{@code identifier} stores the raw input (email or username) for
 *       forensic lookup even when {@code user_id} is NULL.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 * @see User
 * @see UserCredential
 */
@Entity
@Table(name = "login_history", schema = "finflow_auth")
public class LoginHistory {

    /**
     * Machine-readable classification of why a login attempt failed.
     *
     * <p>Values map to distinct rejection paths in the authentication flow.
     * The {@code code} field is stored in the {@code failure_reason} column
     * and can be used by security tooling for automated threat response.</p>
     */
    public enum FailureReason {

        /** Submitted credentials do not match any active credential. */
        INVALID_CREDENTIALS("INVALID_CREDENTIALS"),

        /** Account exists but email has not been verified. */
        ACCOUNT_NOT_VERIFIED("ACCOUNT_NOT_VERIFIED"),

        /** Account is temporarily locked due to excessive failed attempts. */
        ACCOUNT_LOCKED("ACCOUNT_LOCKED"),

        /** Account has been suspended by an administrator. */
        ACCOUNT_SUSPENDED("ACCOUNT_SUSPENDED"),

        /** Account has been permanently closed. */
        ACCOUNT_CLOSED("ACCOUNT_CLOSED");

        private final String code;

        FailureReason(String code) {
            this.code = code;
        }

        public String getCode() {
            return code;
        }
    }

    // ---- Primary Key ----

    /**
     * Auto-incrementing surrogate key.
     *
     * <p>Uses {@code BIGINT IDENTITY} instead of UUID because login history
     * is a high-volume, append-only log where sequential writes outperform
     * random UUID distribution, and 8-byte keys reduce index size vs 36-byte
     * UUIDs.</p>
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    // ---- Foreign Key (nullable) ----

    /**
     * The authenticated user, or {@code null} if the submitted identifier
     * did not match any existing account.
     *
     * <p>Nullable by design: login attempts for non-existent emails must
     * still be recorded for brute-force detection and rate limiting.
     * {@code ON DELETE SET NULL} in the migration ensures historical rows
     * survive user deletion.</p>
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",
                referencedColumnName = "id",
                foreignKey = @ForeignKey(name = "fk_lh_user"))
    private User user;

    // ---- Attempt Data ----

    /**
     * The raw identifier submitted by the user (email address or username).
     *
     * <p>Stored for forensic lookup and brute-force analysis even when
     * {@code user_id} is NULL. Normalized to lowercase if the input was
     * an email address.</p>
     */
    @Column(name = "identifier", nullable = false, length = 254)
    private String identifier;

    /**
     * Whether the authentication attempt was successful.
     *
     * <p>{@code true} = credentials verified and account was active.
     * {@code false} = some rejection occurred (see {@link #failureReason}).</p>
     */
    @Column(name = "success", nullable = false)
    private Boolean success;

    /**
     * Machine-readable reason for failure, or {@code null} on success.
     *
     * @see FailureReason
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "failure_reason", length = 50)
    private FailureReason failureReason;

    // ---- Client Context ----

    /**
     * Client IP address (IPv4 or IPv6) from the {@code X-Forwarded-For}
     * or {@code RemoteAddr} header.
     *
     * <p>Max 45 characters to accommodate the longest possible IPv6
     * representation ({@code 0000:0000:0000:0000:0000:0000:0000:0000}).</p>
     */
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /**
     * HTTP {@code User-Agent} header value for device fingerprinting.
     *
     * <p>Truncated to 500 characters to prevent abuse via oversized headers.
     * Useful for detecting credential-stuffing tools, bots, and anomalous
     * client software.</p>
     */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    // ---- Timestamp ----

    /**
     * Microsecond-precision timestamp of when the attempt occurred.
     *
     * <p>Set automatically via {@link #onCreate()} at persist time.
     * Uses {@code DATETIME(6)} for sub-second precision required by
     * high-frequency security analytics.</p>
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ---- JPA Lifecycle ----

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ---- Constructors ----

    /** Default constructor required by JPA. */
    protected LoginHistory() {}

    /**
     * Creates a login history record for an attempt against a known user.
     *
     * @param user           the user who attempted to authenticate (must not be null)
     * @param identifier     the raw email or username submitted
     * @param success        whether the attempt was successful
     * @param failureReason  the reason for failure, or {@code null} on success
     * @param ipAddress      client IP address, or {@code null} if unavailable
     * @param userAgent      HTTP User-Agent header, or {@code null} if unavailable
     */
    public LoginHistory(User user, String identifier, boolean success,
                        FailureReason failureReason, String ipAddress, String userAgent) {
        this.user = user;
        this.identifier = identifier;
        this.success = success;
        this.failureReason = failureReason;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    /**
     * Creates a login history record for an attempt against a non-existent user.
     *
     * <p>Used when the submitted identifier does not match any account.
     * {@code user_id} will be NULL in the database.</p>
     *
     * @param identifier     the raw email or username submitted
     * @param ipAddress      client IP address, or {@code null} if unavailable
     * @param userAgent      HTTP User-Agent header, or {@code null} if unavailable
     * @return a new LoginHistory with {@code success=false} and
     *         {@code failureReason=INVALID_CREDENTIALS}
     */
    public static LoginHistory failedAttempt(String identifier, String ipAddress, String userAgent) {
        return new LoginHistory(null, identifier, false,
                FailureReason.INVALID_CREDENTIALS, ipAddress, userAgent);
    }

    /**
     * Creates a login history record for a successful authentication.
     *
     * @param user       the authenticated user
     * @param identifier the raw email or username submitted
     * @param ipAddress  client IP address
     * @param userAgent  HTTP User-Agent header
     * @return a new LoginHistory with {@code success=true}
     */
    public static LoginHistory successfulAttempt(User user, String identifier,
                                                  String ipAddress, String userAgent) {
        return new LoginHistory(user, identifier, true, null, ipAddress, userAgent);
    }

    // ---- Getters ----

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Boolean getSuccess() {
        return success;
    }

    public FailureReason getFailureReason() {
        return failureReason;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ---- equals / hashCode ----

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LoginHistory that = (LoginHistory) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
