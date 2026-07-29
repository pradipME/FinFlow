package com.finflow.modules.auth.validator;

import com.finflow.modules.auth.dto.RegisterRequest;
import com.finflow.modules.auth.repository.UserRepository;
import com.finflow.modules.auth.repository.RoleRepository;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RegistrationValidator")
class RegistrationValidatorTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RegistrationValidator validator;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest(
                "newuser@finflow.com",
                "+2348012345678",
                "newuser",
                "Str0ng!Pass#2026",
                true
        );
    }

    @Nested
    @DisplayName("validate()")
    class Validate {

        @Test
        @DisplayName("should pass validation with valid request")
        void shouldPassValidation() {
            when(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("newuser@finflow.com")).thenReturn(false);
            when(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348012345678")).thenReturn(false);
            when(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("newuser")).thenReturn(false);
            when(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).thenReturn(true);

            assertThatCode(() -> validator.validate(validRequest))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should throw when email already exists")
        void shouldThrowWhenEmailExists() {
            when(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("newuser@finflow.com")).thenReturn(true);
            when(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348012345678")).thenReturn(false);
            when(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("newuser")).thenReturn(false);
            when(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).thenReturn(true);

            assertThatThrownBy(() -> validator.validate(validRequest))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("email");
                    });
        }

        @Test
        @DisplayName("should throw when username already exists")
        void shouldThrowWhenUsernameExists() {
            when(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("newuser@finflow.com")).thenReturn(false);
            when(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348012345678")).thenReturn(false);
            when(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("newuser")).thenReturn(true);
            when(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).thenReturn(true);

            assertThatThrownBy(() -> validator.validate(validRequest))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("username");
                    });
        }

        @Test
        @DisplayName("should throw when phone number already exists")
        void shouldThrowWhenPhoneExists() {
            when(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("newuser@finflow.com")).thenReturn(false);
            when(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348012345678")).thenReturn(true);
            when(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("newuser")).thenReturn(false);
            when(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).thenReturn(true);

            assertThatThrownBy(() -> validator.validate(validRequest))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("phoneNumber");
                    });
        }

        @Test
        @DisplayName("should report multiple errors when multiple rules violated")
        void shouldReportMultipleErrors() {
            when(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("newuser@finflow.com")).thenReturn(true);
            when(userRepository.existsByPhoneNumberAndIsDeletedFalse("+2348012345678")).thenReturn(true);
            when(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("newuser")).thenReturn(true);
            when(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).thenReturn(false);

            assertThatThrownBy(() -> validator.validate(validRequest))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(4);
                    });
        }

        @Test
        @DisplayName("should skip phone validation when phone is null")
        void shouldSkipPhoneValidationWhenNull() {
            RegisterRequest noPhoneRequest = new RegisterRequest(
                    "newuser@finflow.com", null, "newuser", "Str0ng!Pass#2026", true
            );

            when(userRepository.existsByEmailIgnoreCaseAndIsDeletedFalse("newuser@finflow.com")).thenReturn(false);
            when(userRepository.existsByUsernameIgnoreCaseAndIsDeletedFalse("newuser")).thenReturn(false);
            when(roleRepository.existsByNameAndIsActiveTrue("CUSTOMER")).thenReturn(true);

            assertThatCode(() -> validator.validate(noPhoneRequest))
                    .doesNotThrowAnyException();

            verify(userRepository, never()).existsByPhoneNumberAndIsDeletedFalse(any());
        }
    }
}
