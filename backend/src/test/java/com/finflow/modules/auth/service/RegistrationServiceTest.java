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
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RegistrationService")
class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserCredentialRepository credentialRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private UserRoleRepository userRoleRepository;
    @Mock
    private RegistrationValidator validator;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegistrationService registrationService;

    private RegisterRequest validRequest;
    private User savedUser;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest(
                "test@finflow.com",
                "+2348012345678",
                "testuser",
                "Str0ng!Pass#2026",
                true
        );

        savedUser = new User("test@finflow.com", "testuser", "+2348012345678", LocalDateTime.now());
        savedUser.setId(UUID.randomUUID());

        customerRole = new Role("CUSTOMER", "Standard customer role", true);
        customerRole.setId(UUID.randomUUID());
    }

    @Nested
    @DisplayName("register()")
    class Register {

        @Test
        @DisplayName("should create user, store credential, assign role, and return response")
        void shouldRegisterSuccessfully() {
            // Arrange
            when(passwordEncoder.encode("Str0ng!Pass#2026")).thenReturn("$argon2id$hashed");
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(roleRepository.findByNameAndIsActiveTrue("CUSTOMER")).thenReturn(Optional.of(customerRole));

            RegisterResponse expectedResponse = new RegisterResponse(
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getUsername(),
                    "ACTIVE",
                    LocalDateTime.now()
            );
            when(userMapper.toRegisterResponse(savedUser)).thenReturn(expectedResponse);

            // Act
            RegisterResponse response = registrationService.register(validRequest);

            // Assert
            verify(validator).validate(validRequest.normalize());
            verify(userRepository).save(any(User.class));
            verify(passwordEncoder).encode("Str0ng!Pass#2026");
            verify(credentialRepository).save(any(UserCredential.class));
            verify(userRoleRepository).save(any(UserRole.class));
            verify(userMapper).toRegisterResponse(savedUser);

            assertThat(response).isNotNull();
            assertThat(response.id()).isEqualTo(savedUser.getId());
            assertThat(response.email()).isEqualTo("test@finflow.com");
            assertThat(response.username()).isEqualTo("testuser");
            assertThat(response.status()).isEqualTo("ACTIVE");
        }

        @Test
        @DisplayName("should propagate validation exception when validator fails")
        void shouldPropagateValidationException() {
            // Arrange
            doThrow(new ValidationException(List.of(
                    new ValidationException.FieldError("email", "DUPLICATE_RESOURCE", "Email already exists")
            ))).when(validator).validate(any());

            // Act & Assert
            assertThatThrownBy(() -> registrationService.register(validRequest))
                    .isInstanceOf(ValidationException.class);

            verify(userRepository, never()).save(any());
            verify(credentialRepository, never()).save(any());
            verify(userRoleRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw IllegalStateException when CUSTOMER role not found")
        void shouldThrowWhenCustomerRoleMissing() {
            // Arrange
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(roleRepository.findByNameAndIsActiveTrue("CUSTOMER")).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> registrationService.register(validRequest))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("CUSTOMER role not found");

            verify(credentialRepository, never()).save(any());
        }

        @Test
        @DisplayName("should hash password with PasswordEncoder")
        void shouldHashPassword() {
            // Arrange
            when(passwordEncoder.encode("Str0ng!Pass#2026")).thenReturn("$argon2id$v=19$m=65536$t=1$p=4$hashed");
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(roleRepository.findByNameAndIsActiveTrue("CUSTOMER")).thenReturn(Optional.of(customerRole));

            RegisterResponse mockResponse = new RegisterResponse(
                    savedUser.getId(), "test@finflow.com", "testuser",
                    "ACTIVE", true, LocalDateTime.now()
            );
            when(userMapper.toRegisterResponse(savedUser)).thenReturn(mockResponse);

            // Act
            registrationService.register(validRequest);

            // Assert
            ArgumentCaptor<UserCredential> captor = ArgumentCaptor.forClass(UserCredential.class);
            verify(credentialRepository).save(captor.capture());

            UserCredential stored = captor.getValue();
            assertThat(stored.getUser()).isEqualTo(savedUser);
            assertThat(stored.getCredentialType()).isEqualTo(CredentialType.PASSWORD);
            assertThat(stored.getHashedValue()).isEqualTo("$argon2id$v=19$m=65536$t=1$p=4$hashed");
            assertThat(stored.getIsActive()).isTrue();
        }
    }
}
