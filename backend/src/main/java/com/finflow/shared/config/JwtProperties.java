package com.finflow.shared.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.Map;

public record JwtProperties(
        @NotBlank String secret,
        @Positive long accessTokenExpirationMs,
        @NotBlank String issuer,
        @NotBlank String audience,
        long clockSkewMs,
        Map<String, String> signingKeys,
        String activeKeyId
) {
    public JwtProperties {
        if (clockSkewMs < 0) clockSkewMs = 0;
        if (clockSkewMs > 300_000) clockSkewMs = 300_000;
    }

    public JwtProperties(String secret, long accessTokenExpirationMs, String issuer, String audience) {
        this(secret, accessTokenExpirationMs, issuer, audience, 30_000L, Map.of("primary", secret), "primary");
    }
}
