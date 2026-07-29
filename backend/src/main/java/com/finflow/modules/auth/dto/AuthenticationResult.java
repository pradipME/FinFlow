package com.finflow.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Domain model representing the result of a successful authentication.
 *
 * <p>Returned by the {@code AuthenticationService} after credential verification.
 * Contains only business-safe information — no password hashes, internal flags,
 * or security-sensitive metadata.</p>
 *
 * <p>This object is mapped to an {@code ApiResponse} wrapper by the controller
 * layer. Clients use the {@code userId} and {@code roles} for subsequent
 * authorization decisions.</p>
 *
 * <h3>Security Notes</h3>
 * <ul>
 *   <li>Password hashes are never included.</li>
 *   <li>{@code failedLoginCount} and {@code lockedUntil} are omitted —
 *       these are internal security state.</li>
 *   <li>{@code lastLoginAt} reflects the <em>previous</em> login, not this one,
 *       for display purposes ("last seen" widget).</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Schema(description = "Authentication result containing user identity and session context")
public record AuthenticationResult(

        @Schema(
                description = "JWT access token for subsequent authenticated requests",
                example = "eyJhbGciOiJIUzUxMiJ9..."
        )
        String accessToken,

        @Schema(
                description = "Authenticated user's unique identifier",
                example = "550e8400-e29b-41d4-a716-446655440000"
        )
        UUID userId,

        @Schema(
                description = "User's email address",
                example = "john@finflow.com"
        )
        String email,

        @Schema(
                description = "User's username",
                example = "john_doe"
        )
        String username,

        @Schema(
                description = "Current account status",
                example = "ACTIVE"
        )
        String status,

        @Schema(
                description = "Roles assigned to the user",
                example = "[\"CUSTOMER\"]"
        )
        List<String> roles,

        @Schema(
                description = "Timestamp of the successful authentication (ISO 8601)",
                example = "2026-07-13T16:30:00Z"
        )
        LocalDateTime authenticatedAt,

        @Schema(
                description = "Timestamp of the user's previous login, if any (ISO 8601)",
                example = "2026-07-12T09:15:00Z"
        )
        LocalDateTime lastLoginAt
) {}
