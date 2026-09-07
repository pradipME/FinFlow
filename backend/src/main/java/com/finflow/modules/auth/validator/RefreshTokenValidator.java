package com.finflow.modules.auth.validator;

import com.finflow.shared.constants.ErrorCodes;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.exception.ValidationException.FieldError;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validates refresh token request parameters.
 *
 * <p>Enforces format and security constraints on refresh token operations
 * before they reach the service layer.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Component
public class RefreshTokenValidator {

    /**
     * Refresh token format: url-safe base64 without padding as emitted by
     * {@code TokenHashService#generateRefreshToken()} (48 random bytes →
     * 64 chars). Generated tokens are opaque values, not JWTs.
     */
    private static final Pattern REFRESH_TOKEN_PATTERN =
            Pattern.compile("^[A-Za-z0-9_-]{32,64}$");

    /**
     * Maximum refresh token length (JWT typically ~500 chars).
     */
    private static final int MAX_TOKEN_LENGTH = 2048;

    /**
     * Validates a refresh token string for format and security constraints.
     *
     * @param refreshToken the raw refresh token to validate
     * @throws ValidationException if the token format is invalid
     */
    public void validateRefreshToken(String refreshToken) {
        List<FieldError> errors = new ArrayList<>();

        if (refreshToken == null || refreshToken.isBlank()) {
            errors.add(new FieldError("refreshToken", ErrorCodes.REQUIRED_FIELD,
                    "Refresh token is required"));
        } else {
            String trimmed = refreshToken.trim();

            if (trimmed.length() > MAX_TOKEN_LENGTH) {
                errors.add(new FieldError("refreshToken", ErrorCodes.INVALID_FORMAT,
                        "Refresh token exceeds maximum length"));
            }

            if (!REFRESH_TOKEN_PATTERN.matcher(trimmed).matches()) {
                errors.add(new FieldError("refreshToken", ErrorCodes.INVALID_FORMAT,
                        "Refresh token must be a valid url-safe base64 value"));
            }
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }

    /**
     * Validates a revoke token request.
     *
     * @param refreshToken the refresh token to revoke
     * @throws ValidationException if the token is missing
     */
    public void validateRevokeRequest(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ValidationException(List.of(
                    new FieldError("refreshToken", ErrorCodes.REQUIRED_FIELD,
                            "Refresh token is required for revocation")));
        }
    }
}
