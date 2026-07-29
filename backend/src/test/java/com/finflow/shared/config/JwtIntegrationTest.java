package com.finflow.shared.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("JwtTokenProvider Integration")
class JwtIntegrationTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtSigningKeyProvider keyProvider;

    @Test
    @DisplayName("should generate and parse token with kid header")
    void shouldGenerateAndParseToken() {
        String userId = "550e8400-e29b-41d4-a716-446655440000";
        String email = "integration@finflow.com";
        List<String> roles = List.of("CUSTOMER", "ADMIN");
        List<String> permissions = List.of("read", "write");

        String token = jwtTokenProvider.generateAccessToken(userId, email, roles, permissions);

        assertThat(token).isNotBlank();

        JwtClaims claims = jwtTokenProvider.parseToken(token);

        assertThat(claims.subject()).isEqualTo(userId);
        assertThat(claims.email()).isEqualTo(email);
        assertThat(claims.roles()).containsExactlyInAnyOrder("CUSTOMER", "ADMIN");
        assertThat(claims.permissions()).containsExactly("read", "write");
        assertThat(claims.issuer()).isEqualTo("finflow");
        assertThat(claims.audience()).isEqualTo("finflow-api");
        assertThat(claims.keyId()).isEqualTo("primary");
    }

    @Test
    @DisplayName("should validate token successfully")
    void shouldValidateToken() {
        String token = jwtTokenProvider.generateAccessToken(
                "user-123", "test@finflow.com", List.of("CUSTOMER"), List.of());

        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("should detect expired token")
    void shouldDetectExpiredToken() {
        assertThat(jwtTokenProvider.isTokenExpired("invalid.token.here")).isTrue();
    }

    @Test
    @DisplayName("should have active key provider loaded")
    void shouldHaveKeyProviderLoaded() {
        assertThat(keyProvider.getActiveKeyId()).isEqualTo("primary");
        assertThat(keyProvider.getKeyCount()).isGreaterThanOrEqualTo(1);
    }
}
