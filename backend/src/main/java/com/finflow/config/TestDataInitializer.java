package com.finflow.config;

import com.finflow.modules.auth.domain.CredentialType;
import com.finflow.modules.auth.domain.Role;
import com.finflow.modules.auth.domain.User;
import com.finflow.modules.auth.domain.UserCredential;
import com.finflow.modules.auth.domain.UserRole;
import com.finflow.modules.auth.repository.RoleRepository;
import com.finflow.modules.auth.repository.UserCredentialRepository;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.repository.UserRoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Initializes test data for the "test" profile.
 *
 * <p>Creates ADMIN and CUSTOMER roles, an admin user with password "Admin@1111",
 * and a sample customer user (via registration) can be created through the API.
 * This component runs only for the test profile to avoid affecting production.
 */
@Profile("test")
@Component
public class TestDataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserCredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;

    public TestDataInitializer(UserRepository userRepository,
                               RoleRepository roleRepository,
                               UserRoleRepository userRoleRepository,
                               UserCredentialRepository credentialRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.credentialRepository = credentialRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    public void init() {
        // --- Roles ---
        Role adminRole = roleRepository.findByNameAndIsActiveTrue("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ADMIN", "Administrator role", true)));
        Role customerRole = roleRepository.findByNameAndIsActiveTrue("CUSTOMER")
                .orElseGet(() -> roleRepository.save(new Role("CUSTOMER", "Customer role", true)));

        // --- Admin user ---
        String adminEmail = "admin@gmail.com";
        if (userRepository.findByEmailIgnoreCaseAndIsDeletedFalse(adminEmail).isEmpty()) {
            User admin = new User(adminEmail, "admin", null, LocalDateTime.now());
            admin = userRepository.save(admin);
            // password hash
            String hashed = passwordEncoder.encode("Admin@1111");
            UserCredential cred = new UserCredential(admin, CredentialType.PASSWORD, hashed);
            credentialRepository.save(cred);
            // assign ADMIN role
            UserRole adminRoleLink = new UserRole(admin, adminRole, admin.getId().toString());
            userRoleRepository.save(adminRoleLink);
        }
    }
}
