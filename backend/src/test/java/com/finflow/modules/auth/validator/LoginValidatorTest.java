package com.finflow.modules.auth.validator;

import com.finflow.modules.auth.dto.LoginRequest;
import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
@DisplayName("LoginValidator")
class LoginValidatorTest {

    @InjectMocks
    private LoginValidator validator;

    @Nested
    @DisplayName("validate()")
    class Validate {

        @Test
        @DisplayName("should pass with valid email identifier")
        void shouldPassWithValidEmail() {
            LoginRequest request = new LoginRequest("user@finflow.com", "password123");
            assertThatCode(() -> validator.validate(request))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should pass with valid username identifier")
        void shouldPassWithValidUsername() {
            LoginRequest request = new LoginRequest("john_doe", "password123");
            assertThatCode(() -> validator.validate(request))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should throw when identifier is blank")
        void shouldThrowWhenIdentifierBlank() {
            LoginRequest request = new LoginRequest("", "password123");
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).isNotEmpty();
                    });
        }

        @Test
        @DisplayName("should throw when identifier is null")
        void shouldThrowWhenIdentifierNull() {
            LoginRequest request = new LoginRequest(null, "password123");
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class);
        }

        @Test
        @DisplayName("should throw when identifier is invalid format")
        void shouldThrowWhenIdentifierInvalid() {
            LoginRequest request = new LoginRequest("a!", "password123");
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("identifier");
                    });
        }

        @ParameterizedTest
        @ValueSource(strings = {"ab", "a", ""})
        @DisplayName("should throw for short identifiers")
        void shouldThrowForShortIdentifiers(String identifier) {
            LoginRequest request = new LoginRequest(identifier, "password123");
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class);
        }

        @Test
        @DisplayName("should throw when password is blank")
        void shouldThrowWhenPasswordBlank() {
            LoginRequest request = new LoginRequest("user@finflow.com", "");
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("password");
                    });
        }

        @Test
        @DisplayName("should throw when password is null")
        void shouldThrowWhenPasswordNull() {
            LoginRequest request = new LoginRequest("user@finflow.com", null);
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class);
        }

        @Test
        @DisplayName("should throw when password exceeds 128 chars")
        void shouldThrowWhenPasswordTooLong() {
            String longPassword = "a".repeat(129);
            LoginRequest request = new LoginRequest("user@finflow.com", longPassword);
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class);
        }

        @Test
        @DisplayName("should accumulate multiple errors")
        void shouldAccumulateMultipleErrors() {
            LoginRequest request = new LoginRequest("", "");
            assertThatThrownBy(() -> validator.validate(request))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(2);
                    });
        }
    }
}
