package com.finflow.modules.auth.repository;

import com.finflow.modules.auth.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for auth module repositories.
 *
 * <p>Uses H2 in-memory database to verify repository queries without
 * requiring a running MySQL instance.</p>
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:finflow_auth_test;DB_CLOSE_DELAY=-1;MODE=MYSQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false",
        "spring.sql.init.mode=always",
        "spring.sql.init.schema-locations=classpath:schemas.sql"
})
@DisplayName("Auth Repository Integration Tests")
class AuthRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCredentialRepository credentialRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    private User testUser;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        customerRole = new Role("CUSTOMER", "Standard customer role", true);
        customerRole = roleRepository.save(customerRole);

        testUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        ReflectionTestUtils.setField(testUser, "createdBy", "test-user");
        ReflectionTestUtils.setField(testUser, "modifiedBy", "test-user");
        testUser = userRepository.save(testUser);
    }

    @Nested
    @DisplayName("UserRepository")
    class UserRepositoryTests {

        @Test
        @DisplayName("should find user by email")
        void shouldFindByEmail() {
            Optional<User> found = userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com");
            assertThat(found).isPresent();
            assertThat(found.get().getUsername()).isEqualTo("testuser");
        }

        @Test
        @DisplayName("should return empty for non-existent email")
        void shouldReturnEmptyForNonExistentEmail() {
            Optional<User> found = userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("nonexistent@finflow.com");
            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("should check email existence")
        void shouldCheckEmailExistence() {
            assertThat(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com")).isTrue();
            assertThat(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("nonexistent@finflow.com")).isFalse();
        }

        @Test
        @DisplayName("should check username existence")
        void shouldCheckUsernameExistence() {
            assertThat(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("testuser")).isTrue();
            assertThat(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("otheruser")).isFalse();
        }

        @Test
        @DisplayName("should check phone number existence")
        void shouldCheckPhoneNumberExistence() {
            assertThat(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348012345678")).isTrue();
            assertThat(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348099999999")).isFalse();
        }

        @Test
        @DisplayName("should not find soft-deleted user by email")
        void shouldNotFindSoftDeletedUser() {
            testUser.softDelete("admin");
            userRepository.save(testUser);

            Optional<User> found = userRepository.findByEmailIgnoreCaseAndIsDeletedFalse("test@finflow.com");
            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("should count users by status")
        void shouldCountByStatus() {
            long count = userRepository.countByStatusAndIsDeletedFalse(UserStatus.ACTIVE);
            assertThat(count).isGreaterThanOrEqualTo(1);
        }
    }

    @Nested
    @DisplayName("UserCredentialRepository")
    class UserCredentialRepositoryTests {

        @Test
        @DisplayName("should save and find active credential")
        void shouldSaveAndFindActiveCredential() {
            UserCredential credential = new UserCredential(
                    testUser, CredentialType.PASSWORD, "$argon2id$hashed");
            ReflectionTestUtils.setField(credential, "createdBy", "test-user");
            ReflectionTestUtils.setField(credential, "modifiedBy", "test-user");
            credentialRepository.save(credential);

            Optional<UserCredential> found = credentialRepository.findByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(
                    testUser, CredentialType.PASSWORD);

            assertThat(found).isPresent();
            assertThat(found.get().getHashedValue()).isEqualTo("$argon2id$hashed");
            assertThat(found.get().getIsActive()).isTrue();
        }

        @Test
        @DisplayName("should check active credential existence")
        void shouldCheckActiveCredentialExistence() {
            UserCredential credential = new UserCredential(
                    testUser, CredentialType.PASSWORD, "$argon2id$hashed");
            ReflectionTestUtils.setField(credential, "createdBy", "test-user");
            ReflectionTestUtils.setField(credential, "modifiedBy", "test-user");
            credentialRepository.save(credential);

            assertThat(credentialRepository.existsByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(
                    testUser, CredentialType.PASSWORD)).isTrue();
            assertThat(credentialRepository.existsByUserAndCredentialTypeAndIsActiveTrueAndIsDeletedFalse(
                    testUser, CredentialType.PASSKEY)).isFalse();
        }
    }

    @Nested
    @DisplayName("RoleRepository")
    class RoleRepositoryTests {

        @Test
        @DisplayName("should find role by name")
        void shouldFindByName() {
            Optional<Role> found = roleRepository.findByNameAndIsActiveTrue("CUSTOMER");
            assertThat(found).isPresent();
            assertThat(found.get().getIsSystemRole()).isTrue();
        }

        @Test
        @DisplayName("should check role existence by name")
        void shouldCheckExistenceByName() {
            assertThat(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).isTrue();
            assertThat(roleRepository.existsByNameAndIsActiveTrue("NONEXISTENT")).isFalse();
        }
    }

    @Nested
    @DisplayName("UserRoleRepository")
    class UserRoleRepositoryTests {

        @Test
        @DisplayName("should save and find user role")
        void shouldSaveAndFindUserRole() {
            UserRole userRole = new UserRole(testUser, customerRole, "system");
            userRoleRepository.save(userRole);

            var roles = userRoleRepository.findByUser(testUser);
            assertThat(roles).hasSize(1);
            assertThat(roles.get(0).getRole().getName()).isEqualTo("CUSTOMER");
        }

        @Test
        @DisplayName("should check user role by name")
        void shouldCheckUserRoleByName() {
            UserRole userRole = new UserRole(testUser, customerRole, "system");
            userRoleRepository.save(userRole);

            assertThat(userRoleRepository.existsByUserAndRole_NameAndRole_IsActiveTrue(testUser, "CUSTOMER")).isTrue();
            assertThat(userRoleRepository.existsByUserAndRole_NameAndRole_IsActiveTrue(testUser, "ADMIN")).isFalse();
        }
    }
}
