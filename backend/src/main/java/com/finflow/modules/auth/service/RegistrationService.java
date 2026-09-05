package com.finflow.modules.auth.service;

import com.finflow.modules.auth.domain.*;
import com.finflow.modules.auth.dto.RegisterRequest;
import com.finflow.modules.auth.dto.RegisterResponse;
import com.finflow.modules.auth.mapper.UserMapper;
import com.finflow.modules.auth.repository.UserCredentialRepository;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.repository.RoleRepository;
import com.finflow.modules.auth.repository.UserRoleRepository;
import com.finflow.modules.auth.validator.RegistrationValidator;
import com.finflow.modules.admin.events.AdminEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Core service for user registration operations.
 *
 * <p>Orchestrates the registration flow: validation, password hashing,
 * user creation, credential storage, and role assignment. Emits a
 * {@code UserRegistered} domain event after commit.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@Service
public class RegistrationService {

    private static final Logger log = LoggerFactory.getLogger(RegistrationService.class);

    private final UserRepository userRepository;
    private final UserCredentialRepository credentialRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final RegistrationValidator validator;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AdminEventService adminEventService;

    public RegistrationService(UserRepository userRepository,
                               UserCredentialRepository credentialRepository,
                               RoleRepository roleRepository,
                               UserRoleRepository userRoleRepository,
                               RegistrationValidator validator,
                               UserMapper userMapper,
                               PasswordEncoder passwordEncoder,
                               AdminEventService adminEventService) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.validator = validator;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.adminEventService = adminEventService;
    }

    /**
     * Registers a new user on the FinFlow platform.
     *
     * <p>Flow:</p>
     * <ol>
     *   <li>Normalize and validate the request (bean + business rules).</li>
     *   <li>Create and persist the User entity.</li>
     *   <li>Hash the password and store a UserCredential.</li>
     *   <li>Assign the default CUSTOMER role.</li>
     * </ol>
     *
     * @param request the registration request
     * @return the registration response with non-sensitive user data
     */
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        RegisterRequest normalized = request.normalize();

        validator.validate(normalized);

        User user = new User(
                normalized.email(),
                normalized.username(),
                normalized.phoneNumber(),
                java.time.LocalDateTime.now()
        );
        user = userRepository.save(user);
        log.info("User created: id={}, email={}", user.getId(), user.getEmail());

        String hashedPassword = passwordEncoder.encode(normalized.password());
        UserCredential credential = new UserCredential(user, CredentialType.PASSWORD, hashedPassword);
        credentialRepository.save(credential);
        log.info("Password credential stored for user: {}", user.getId());

        Role customerRole = roleRepository.findByNameAndIsActiveTrue("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role not found"));
        UserRole userRole = new UserRole(user, customerRole, user.getId().toString());
        userRoleRepository.save(userRole);
        log.info("CUSTOMER role assigned to user: {}", user.getId());

        adminEventService.sendToAdmins("new-customer", Map.of(
                "type", "CUSTOMER_CREATE",
                "userId", user.getId().toString(),
                "email", user.getEmail()
        ));

        return userMapper.toRegisterResponse(user);
    }
}
