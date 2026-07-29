package com.finflow.modules.auth.validator;

import com.finflow.modules.auth.dto.RegisterRequest;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.repository.RoleRepository;
import com.finflow.shared.constants.ErrorCodes;
import com.finflow.shared.exception.ValidationException;
import com.finflow.shared.exception.ValidationException.FieldError;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Validates business rules for the registration request that go beyond
 * bean validation constraints.
 *
 * <p>Checks uniqueness of email, phone number, and username against
 * the database. Validates that the CUSTOMER role exists.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Component
public class RegistrationValidator {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public RegistrationValidator(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Validates the registration request against all business rules.
     *
     * @param request the normalized registration request
     * @throws ValidationException if any business rule is violated
     */
    public void validate(RegisterRequest request) {
        List<FieldError> errors = new ArrayList<>();

        if (userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse(request.email())) {
            errors.add(new FieldError("email", ErrorCodes.DUPLICATE_RESOURCE,
                    "Email address is already registered"));
        }

        if (request.phoneNumber() != null && userRepository.existsByPhoneNumberAndIsDeletedFalse(request.phoneNumber())) {
            errors.add(new FieldError("phoneNumber", ErrorCodes.DUPLICATE_RESOURCE,
                    "Phone number is already registered"));
        }

        if (userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse(request.username())) {
            errors.add(new FieldError("username", ErrorCodes.DUPLICATE_RESOURCE,
                    "Username is already taken"));
        }

        if (!roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")) {
            errors.add(new FieldError("role", ErrorCodes.INTERNAL_ERROR,
                    "Default customer role not configured"));
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }
}
