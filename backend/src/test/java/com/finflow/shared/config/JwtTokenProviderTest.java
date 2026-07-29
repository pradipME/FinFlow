package com.finflow.shared.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtTokenProvider")
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private static final String TEST_SECRET = "Y2hva2Vja2V5Zm9yZmluZmxvd2JhY2tlbmRzZWN1cml0eXN0b3JlZ2VuZXJhdGlvbjEyMzQ1Njc4";
    private static final long TEST_EXPIRATION_MS = 900_000L;
    private static final String TEST_ISSUER = "finflow";
    private static final String TEST_AUDIENCE = "finflow-api";

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties(
                TEST_SECRET,
                TEST_EXPIRATION_MS,
                TEST_ISSUER,
                TEST_AUDIENCE,
                30_000L,
                Map.of("primary", TEST_SECRET),
                "primary"
        );
        JwtSigningKeyProvider keyProvider = new JwtSigningKeyProvider(properties);
        jwtTokenProvider = new JwtTokenProvider(properties, keyProvider);
    }

    @Test
    @DisplayName("should generate valid access token with kid header")
    void generateAccessToken_returnsValidToken() {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER"),
                List.of("read", "write")
        );

        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("should parse generated token correctly")
    void parseToken_returnsCorrectClaims() {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER", "ADMIN"),
                List.of("read")
        );

        JwtClaims claims = jwtTokenProvider.parseToken(token);

        assertThat(claims.subject()).isEqualTo("user-123");
        assertThat(claims.roles()).containsExactlyInAnyOrder("CUSTOMER", "ADMIN");
        assertThat(claims.permissions()).containsExactly("read");
        assertThat(claims.issuer()).isEqualTo(TEST_ISSUER);
        assertThat(claims.audience()).isEqualTo(TEST_AUDIENCE);
        assertThat(claims.keyId()).isEqualTo("primary");
    }

    @Test
    @DisplayName("should validate a valid token")
    void validateToken_returnsTrueForValidToken() {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER"),
                List.of()
        );

        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("should reject invalid token")
    void validateToken_returnsFalseForInvalidToken() {
        assertThat(jwtTokenProvider.validateToken("invalid.token.here")).isFalse();
    }

    @Test
    @DisplayName("should reject token with wrong issuer")
    void validateToken_returnsFalseForWrongIssuer() {
        JwtProperties wrongIssuerProps = new JwtProperties(
                TEST_SECRET,
                TEST_EXPIRATION_MS,
                "wrong-issuer",
                TEST_AUDIENCE,
                30_000L,
                Map.of("primary", TEST_SECRET),
                "primary"
        );
        JwtSigningKeyProvider wrongKeyProvider = new JwtSigningKeyProvider(wrongIssuerProps);
        JwtTokenProvider wrongIssuerProvider = new JwtTokenProvider(wrongIssuerProps, wrongKeyProvider);

        String token = jwtTokenProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER"),
                List.of()
        );

        assertThat(wrongIssuerProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("should extract userId from token")
    void extractUserId_returnsCorrectUserId() {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER"),
                List.of()
        );

        assertThat(jwtTokenProvider.extractUserId(token)).isEqualTo("user-123");
    }

    @Test
    @DisplayName("should extract email from token")
    void extractEmail_returnsCorrectEmail() {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER"),
                List.of()
        );

        assertThat(jwtTokenProvider.extractEmail(token)).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("should reject token signed with different key")
    void validateToken_returnsFalseForWrongKey() {
        String otherSecret = "YW5vdGhlcmpvY2VrZXlmb3JmaW5mbG93YmFja2VuZHNlY3VyaXR5c3RvcmVnZW5lcmF0aW9uMTIzNDU2Nzg=";
        JwtProperties otherProps = new JwtProperties(
                otherSecret,
                TEST_EXPIRATION_MS,
                TEST_ISSUER,
                TEST_AUDIENCE,
                30_000L,
                Map.of("other", otherSecret),
                "other"
        );
        JwtSigningKeyProvider otherKeyProvider = new JwtSigningKeyProvider(otherProps);
        JwtTokenProvider otherProvider = new JwtTokenProvider(otherProps, otherKeyProvider);

        String token = otherProvider.generateAccessToken(
                "user-123",
                "test@example.com",
                List.of("CUSTOMER"),
                List.of()
        );

        assertThat(jwtTokenProvider.validateToken(token)).isFalse();
    }
}
