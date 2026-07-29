package com.finflow.modules.auth.domain;

/**
 * Represents the lifecycle status of a user account on the FinFlow platform.
 *
 * <p>Users begin in {@link #PENDING_VERIFICATION} after registration and
 * transition to {@link #ACTIVE} once their email address is verified.
 * Accounts may be {@link #SUSPENDED} for security reasons or {@link #CLOSED}
 * at the user's request.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
public enum UserStatus {

    /** Initial state after registration; email verification pending. */
    PENDING_VERIFICATION,

    /** Fully verified and active user. */
    ACTIVE,

    /** Temporarily restricted due to security concerns. */
    SUSPENDED,

    /** Permanently closed by user or admin action. */
    CLOSED
}
