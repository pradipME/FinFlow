package com.finflow.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Response returned after successful token refresh")
public record RefreshTokenResponse(

        @Schema(
                description = "New JWT access token for authenticated requests",
                example = "eyJhbGciOiJIUzUxMiJ9..."
        )
        String accessToken,

        @Schema(
                description = "New refresh token (replace the old one immediately)",
                example = "eyJhbGciOiJIUzI1NiJ9..."
        )
        String refreshToken,

        @Schema(
                description = "Token type",
                example = "Bearer"
        )
        String tokenType,

        @Schema(
                description = "Access token expiration in seconds",
                example = "900"
        )
        long expiresIn,

        @Schema(
                description = "Timestamp when the response was generated",
                example = "2026-07-14T10:30:00Z"
        )
        LocalDateTime issuedAt
) {
    public static RefreshTokenResponse of(String accessToken, String refreshToken, long expiresInSeconds) {
        return new RefreshTokenResponse(
                accessToken,
                refreshToken,
                "Bearer",
                expiresInSeconds,
                LocalDateTime.now()
        );
    }
}
