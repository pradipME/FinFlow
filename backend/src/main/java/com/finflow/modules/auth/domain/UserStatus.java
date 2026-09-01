package com.finflow.modules.auth.domain;

/**
 * Represents the lifecycle status of a user account on the FinFlow platform.
 *
 * <p>Users begin as {@link #ACTIVE} after registration.
 * Accounts may be {@link #SUSPENDED} for security reasons or {@link #CLOSED}
 * at the user's request.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
public enum UserStatus {

    /** Active user. */
    ACTIVE,

    /** Temporarily restricted due to security concerns. */
    SUSPENDED,

    /** Permanently closed by user or admin action. */
    CLOSED
}
