package com.finflow.modules.auth.dto;

import com.finflow.shared.constants.ErrorCodes;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Incoming request payload for the user login endpoint.
 *
 * <p>The {@code identifier} field accepts either an email address or a username.
 * This dual-input design allows users to authenticate with whichever credential
 * they remember, while the service layer resolves the identifier to a user record.</p>
 *
 * <p>Bean Validation handles format constraints. Business-rule validation
 * (account existence, lockout checks, credential verification) is performed
 * by the {@code AuthenticationService}.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Schema(description = "Request payload for user login")
public record LoginRequest(

        @Schema(
                description = "Email address or username to authenticate with",
                example = "john_doe",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        @Size(min = 3, max = 254, message = ErrorCodes.INVALID_FORMAT)
        String identifier,

        @Schema(
                description = "Account password",
                example = "Str0ng!Pass#2026",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        @Size(min = 1, max = 128, message = ErrorCodes.INVALID_FORMAT)
        String password
) {

        /**
         * Normalizes the identifier for consistent lookup.
         *
         * <p>If the identifier looks like an email (contains {@code @}),
         * it is lowercased and trimmed. Usernames are trimmed only —
         * case-sensitive username lookup is handled by the repository.</p>
         *
         * @return this request with the identifier normalized
         */
        public LoginRequest normalize() {
                String normalizedIdentifier = identifier != null ? identifier.trim() : null;
                if (normalizedIdentifier != null && normalizedIdentifier.contains("@")) {
                        normalizedIdentifier = normalizedIdentifier.toLowerCase();
                }
                return new LoginRequest(normalizedIdentifier, password);
        }
}
