package com.finflow.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response payload returned after successful user registration.
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Schema(description = "Response returned after successful user registration")
public record RegisterResponse(

        @Schema(description = "Unique user identifier (UUID v4)",
                example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "User's email address",
                example = "user@finflow.com")
        String email,

        @Schema(description = "Chosen username",
                example = "john_doe")
        String username,

        @Schema(description = "Account status",
                example = "ACTIVE")
        String status,

        @Schema(description = "Timestamp of account creation (ISO 8601)",
                example = "2026-07-13T16:30:00Z")
        LocalDateTime createdAt
) {}
