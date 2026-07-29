package com.finflow.shared.config;

import java.time.Instant;
import java.util.List;

public record JwtClaims(
        String subject,
        String id,
        Instant issuedAt,
        Instant expiresAt,
        String issuer,
        String audience,
        List<String> roles,
        List<String> permissions,
        String keyId
) {
    public JwtClaims(String subject, String id, Instant issuedAt, Instant expiresAt,
                     String issuer, String audience, List<String> roles, List<String> permissions) {
        this(subject, id, issuedAt, expiresAt, issuer, audience, roles, permissions, null);
    }
}
