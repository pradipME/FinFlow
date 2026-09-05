package com.finflow.modules.auth.dto;

import com.finflow.shared.constants.ErrorCodes;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

/**
 * Incoming request payload for the user registration endpoint.
 *
 * <p>All fields are validated against the FinFlow Global API Validation Standard.
 * Email uniqueness is checked by the service layer after format validation passes.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Schema(description = "Request payload for user registration")
public record RegisterRequest(

        @Schema(description = "User's email address", example = "user@finflow.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        @Size(min = 5, max = 254, message = ErrorCodes.INVALID_FORMAT)
        @Email(message = ErrorCodes.INVALID_FORMAT)
        String email,

        @Schema(description = "Phone number in E.164 format", example = "+2348012345678", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = ErrorCodes.INVALID_FORMAT)
        String phoneNumber,

        @Schema(description = "Desired username (3-30 chars, alphanumeric + underscore)", example = "john_doe", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        @Size(min = 3, max = 30, message = ErrorCodes.INVALID_FORMAT)
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = ErrorCodes.INVALID_FORMAT)
        String username,

        @Schema(description = "Password meeting FinFlow security policy", example = "Str0ng!Pass#2026", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        @Size(min = 8, max = 128, message = ErrorCodes.INVALID_FORMAT)
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
                 message = ErrorCodes.INVALID_FORMAT)
        String password,

        @Schema(description = "Terms acceptance confirmation", example = "true", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = ErrorCodes.REQUIRED_FIELD)
        @AssertTrue(message = ErrorCodes.REQUIRED_FIELD)
        Boolean termsAccepted
) {

        /**
         * Normalizes the email to lowercase for consistent storage.
         *
         * @return this request with email normalized
         */
        public RegisterRequest normalize() {
            return new RegisterRequest(
                    email != null ? email.trim().toLowerCase() : null,
                    phoneNumber != null ? phoneNumber.trim() : null,
                    username != null ? username.trim() : null,
                    password,
                    termsAccepted
            );
        }
}
