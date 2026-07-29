package com.finflow.modules.auth.domain;

/**
 * Enumerates the supported credential types for user authentication.
 *
 * <p>Each user may hold one active credential per type. The primary type
 * for registration is {@link #PASSWORD}; passkeys and biometrics are
 * registered post-authentication.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
public enum CredentialType {

    /** Argon2-hashed password credential. */
    PASSWORD,

    /** FIDO2/WebAuthn passkey credential. */
    PASSKEY,

    /** Biometric credential (client-side verified assertion). */
    BIOMETRIC
}
