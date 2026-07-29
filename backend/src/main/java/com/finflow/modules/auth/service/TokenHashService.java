package com.finflow.modules.auth.service;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Service for secure refresh token hashing and generation.
 *
 * <p>Refresh tokens are high-entropy random values (not JWTs) that are hashed
 * with SHA-256 before storage. This ensures:</p>
 * <ul>
 *   <li>Raw tokens are never persisted — only hashes.</li>
 *   <li>Database compromise does not expose valid tokens.</li>
 *   <li>Constant-time comparison prevents timing attacks.</li>
 * </ul>
 *
 * <h3>Security Design</h3>
 * <ul>
 *   <li>Token generation uses {@link SecureRandom} for cryptographic randomness.</li>
 *   <li>SHA-256 produces a fixed 32-byte (64 hex char) hash.</li>
 *   <li>Comparison uses {@link MessageDigest#isEqual} for constant-time behavior.</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Service
public class TokenHashService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String SHA_256 = "SHA-256";
    private static final int TOKEN_BYTE_LENGTH = 48; // 384 bits of entropy

    /**
     * Generates a cryptographically secure random refresh token.
     *
     * <p>The token is a Base64URL-encoded string of 48 random bytes (384 bits).
     * This exceeds the minimum 256-bit security recommendation for long-lived tokens.</p>
     *
     * @return a URL-safe Base64-encoded refresh token
     */
    public String generateRefreshToken() {
        byte[] tokenBytes = new byte[TOKEN_BYTE_LENGTH];
        SECURE_RANDOM.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    /**
     * Hashes a refresh token using SHA-256.
     *
     * <p>The raw token is never stored. Only the SHA-256 hash is persisted
     * in the database and Redis cache.</p>
     *
     * @param rawToken the raw refresh token to hash
     * @return a 64-character lowercase hex string representing the SHA-256 hash
     */
    public String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance(SHA_256);
            byte[] hashBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is guaranteed to be available in all JVM implementations
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Compares two token hashes using constant-time comparison.
     *
     * <p>Uses {@link MessageDigest#isEqual} to prevent timing attacks that
     * could leak information about the hash value.</p>
     *
     * @param hash1 the first hash (from database)
     * @param hash2 the second hash (from presented token)
     * @return {@code true} if the hashes match
     */
    public boolean constantTimeEquals(String hash1, String hash2) {
        if (hash1 == null || hash2 == null) {
            return false;
        }
        return MessageDigestisEqual(hash1.getBytes(StandardCharsets.UTF_8),
                                     hash2.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a UUID v4 for session and family identifiers.
     *
     * @return a random UUID string
     */
    public String generateSessionId() {
        return java.util.UUID.randomUUID().toString();
    }

    /**
     * Generates a UUID v4 for token family identifiers.
     *
     * @return a random UUID string
     */
    public String generateFamilyId() {
        return java.util.UUID.randomUUID().toString();
    }

    private static boolean MessageDigestisEqual(byte[] a, byte[] b) {
        return MessageDigest.isEqual(a, b);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
