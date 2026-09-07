package com.finflow.modules.auth.validator;

import com.finflow.shared.exception.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("RefreshTokenValidator")
class RefreshTokenValidatorTest {

    /** The full url-safe base64 alphabet used by generated refresh tokens. */
    private static final String BASE64URL_ALPHABET =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";

    private final RefreshTokenValidator validator = new RefreshTokenValidator();

    @Nested
    @DisplayName("validateRefreshToken()")
    class ValidateRefreshToken {

        @Test
        @DisplayName("should accept a typical opaque refresh token with url-safe characters")
        void shouldAcceptTypicalToken() {
            // 64 chars, exactly what TokenHashService#generateRefreshToken() emits
            // (48 random bytes → padded-less base64url).
            String token = (BASE64URL_ALPHABET + BASE64URL_ALPHABET).substring(7, 71);
            assertThat(token.length()).isEqualTo(64);
            assertThat(token).matches("^[A-Za-z0-9_-]+$");
            assertThatCode(() -> validator.validateRefreshToken(token))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should accept a token at the minimum boundary length (32)")
        void shouldAcceptMinimumBoundary() {
            String token = BASE64URL_ALPHABET.substring(0, 32);
            assertThat(token.length()).isEqualTo(32);
            assertThatCode(() -> validator.validateRefreshToken(token))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should accept a token at the maximum boundary length (64)")
        void shouldAcceptMaximumBoundary() {
            String token = BASE64URL_ALPHABET;
            assertThat(token.length()).isEqualTo(64);
            assertThatCode(() -> validator.validateRefreshToken(token))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should accept tokens mixing both allowed symbols [- and _]")
        void shouldAcceptMixedSymbols() {
            String token = "ABcDeFgHiJkLmNoPqRsTuVwXyZ012345-_abcdefghijkl";
            assertThatCode(() -> validator.validateRefreshToken(token))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("should reject a JWT-style dotted token")
        void shouldRejectJwtFormat() {
            String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signature";
            assertThatThrownBy(() -> validator.validateRefreshToken(token))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("refreshToken");
                        assertThat(ve.getFieldErrors().get(0).code()).isEqualTo("INVALID_FORMAT");
                    });
        }

        @Test
        @DisplayName("should reject a token shorter than 32 characters")
        void shouldRejectTooShort() {
            String token = "abc123";
            assertThat(token.length()).isLessThan(32);
            assertThatThrownBy(() -> validator.validateRefreshToken(token))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("refreshToken");
                    });
        }

        @Test
        @DisplayName("should reject a token longer than 64 characters")
        void shouldRejectTooLong() {
            String token = "A".repeat(65);
            assertThat(token.length()).isGreaterThan(64);
            assertThatThrownBy(() -> validator.validateRefreshToken(token))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("refreshToken");
                    });
        }

        @Test
        @DisplayName("should reject tokens containing characters outside the url-safe alphabet")
        void shouldRejectInvalidCharacters() {
            // '+' and '=' are not allowed in the opaque token charset.
            String token = "abc+def=ghi-jkl_mno-pqr_stu-vwx_yz0123456789";
            assertThat(token.length()).isGreaterThan(32);
            assertThatThrownBy(() -> validator.validateRefreshToken(token))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors()).hasSize(1);
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("refreshToken");
                        assertThat(ve.getFieldErrors().get(0).code()).isEqualTo("INVALID_FORMAT");
                    });
        }

        @Test
        @DisplayName("should reject null, blank, and empty tokens as required field")
        void shouldRejectMissingTokens() {
            for (String token : new String[] { null, "", "   " }) {
                assertThatThrownBy(() -> validator.validateRefreshToken(token))
                        .isInstanceOf(ValidationException.class)
                        .satisfies(ex -> {
                            ValidationException ve = (ValidationException) ex;
                            assertThat(ve.getFieldErrors()).hasSize(1);
                            assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("refreshToken");
                            assertThat(ve.getFieldErrors().get(0).code()).isEqualTo("REQUIRED_FIELD");
                        });
            }
        }

        @Test
        @DisplayName("should reject an excessively long token beyond the maximum length")
        void shouldRejectExcessiveLength() {
            String token = "A".repeat(2049);
            assertThatThrownBy(() -> validator.validateRefreshToken(token))
                    .isInstanceOf(ValidationException.class)
                    .satisfies(ex -> {
                        ValidationException ve = (ValidationException) ex;
                        assertThat(ve.getFieldErrors().get(0).field()).isEqualTo("refreshToken");
                    });
        }

        @Test
        @DisplayName("should trim surrounding whitespace before validating")
        void shouldTrimWhitespace() {
            String token = " " + BASE64URL_ALPHABET + "\n";
            assertThatCode(() -> validator.validateRefreshToken(token))
                    .doesNotThrowAnyException();
        }
    }
}