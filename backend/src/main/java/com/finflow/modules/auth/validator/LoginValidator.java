package com.finflow.modules.auth.validator;

import com.finflow.modules.auth.dto.LoginRequest;
import com.finflow.shared.constants.ErrorCodes;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.exception.ValidationException.FieldError;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validates business rules for the login request that go beyond
 * bean validation constraints.
 *
 * <p>Ensures the identifier field contains a plausible email address
 * or username before the service layer performs database lookups.
 * This prevents unnecessary database queries for obviously malformed
 * inputs.</p>
 *
 * <h3>Validation Rules</h3>
 * <ul>
 *   <li>Identifier must match either an email pattern or a username pattern.</li>
 *   <li>Password must be between 1 and 128 characters (bean validation
 *       handles the lower bound; this validator adds no additional
 *       password rules — the service layer verifies against the hash).</li>
 * </ul>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Component
public class LoginValidator {

    /**
     * Minimal email pattern — validates the presence of {@code @} and at
     * least one dot in the domain part. Full RFC 5322 compliance is
     * enforced by Jakarta's {@code @Email} annotation on the DTO.
     */
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$");

    /**
     * Username pattern — 3 to 30 characters, alphanumeric and underscores only.
     */
    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("^[a-zA-Z0-9_]{3,30}$");

    /**
     * Validates the login request against all business rules.
     *
     * @param request the normalized login request
     * @throws ValidationException if any business rule is violated
     */
    public void validate(LoginRequest request) {
        List<FieldError> errors = new ArrayList<>();

        if (request.identifier() == null || request.identifier().isBlank()) {
            errors.add(new FieldError("identifier", ErrorCodes.REQUIRED_FIELD,
                    "Email or username is required"));
        } else {
            String identifier = request.identifier().trim();
            boolean isEmail = EMAIL_PATTERN.matcher(identifier).matches();
            boolean isUsername = USERNAME_PATTERN.matcher(identifier).matches();

            if (!isEmail && !isUsername) {
                errors.add(new FieldError("identifier", ErrorCodes.INVALID_FORMAT,
                        "Identifier must be a valid email address or username (3-30 chars, alphanumeric + underscore)"));
            }
        }

        if (request.password() == null || request.password().isBlank()) {
            errors.add(new FieldError("password", ErrorCodes.REQUIRED_FIELD,
                    "Password is required"));
        } else if (request.password().length() > 128) {
            errors.add(new FieldError("password", ErrorCodes.INVALID_FORMAT,
                    "Password must not exceed 128 characters"));
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }
}
