package com.finflow.modules.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("TokenHashService")
class TokenHashServiceTest {

    private TokenHashService tokenHashService;

    @BeforeEach
    void setUp() {
        tokenHashService = new TokenHashService();
    }

    @Nested
    @DisplayName("generateRefreshToken()")
    class GenerateRefreshToken {

        @Test
        @DisplayName("returns non-empty string")
        void returnsNonEmptyString() {
            String token = tokenHashService.generateRefreshToken();
            assertThat(token).isNotBlank();
        }

        @Test
        @DisplayName("returns unique tokens on each call")
        void returnsUniqueTokens() {
            String token1 = tokenHashService.generateRefreshToken();
            String token2 = tokenHashService.generateRefreshToken();
            assertThat(token1).isNotEqualTo(token2);
        }

        @Test
        @DisplayName("token is Base64URL-safe")
        void tokenIsBase64UrlSafe() {
            String token = tokenHashService.generateRefreshToken();
            assertThat(token).matches("^[A-Za-z0-9_-]+$");
        }

        @Test
        @DisplayName("token length is at least 60 characters (48 bytes Base64URL)")
        void tokenHasMinimumLength() {
            String token = tokenHashService.generateRefreshToken();
            assertThat(token.length()).isGreaterThanOrEqualTo(60);
        }
    }

    @Nested
    @DisplayName("hashToken()")
    class HashToken {

        @Test
        @DisplayName("returns 64-character hex string")
        void returns64CharHex() {
            String hash = tokenHashService.hashToken("test-token");
            assertThat(hash).hasSize(64);
            assertThat(hash).matches("^[0-9a-f]{64}$");
        }

        @Test
        @DisplayName("same input produces same hash")
        void deterministicHash() {
            String hash1 = tokenHashService.hashToken("my-token");
            String hash2 = tokenHashService.hashToken("my-token");
            assertThat(hash1).isEqualTo(hash2);
        }

        @Test
        @DisplayName("different inputs produce different hashes")
        void differentInputsDifferentHashes() {
            String hash1 = tokenHashService.hashToken("token-a");
            String hash2 = tokenHashService.hashToken("token-b");
            assertThat(hash1).isNotEqualTo(hash2);
        }

        @Test
        @DisplayName("hash of generated token matches manual hash")
        void hashOfGeneratedToken() {
            String rawToken = tokenHashService.generateRefreshToken();
            String hash = tokenHashService.hashToken(rawToken);

            // Manual SHA-256 verification
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] expected = digest.digest(rawToken.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            String expectedHex = bytesToHex(expected);

            assertThat(hash).isEqualTo(expectedHex);
        }
    }

    @Nested
    @DisplayName("constantTimeEquals()")
    class ConstantTimeEquals {

        @Test
        @DisplayName("returns true for identical hashes")
        void identicalHashesMatch() {
            assertThat(tokenHashService.constantTimeEquals("abc", "abc")).isTrue();
        }

        @Test
        @DisplayName("returns false for different hashes")
        void differentHashesNoMatch() {
            assertThat(tokenHashService.constantTimeEquals("abc", "def")).isFalse();
        }

        @Test
        @DisplayName("returns false when first is null")
        void firstNull() {
            assertThat(tokenHashService.constantTimeEquals(null, "abc")).isFalse();
        }

        @Test
        @DisplayName("returns false when second is null")
        void secondNull() {
            assertThat(tokenHashService.constantTimeEquals("abc", null)).isFalse();
        }

        @Test
        @DisplayName("returns false when both null")
        void bothNull() {
            assertThat(tokenHashService.constantTimeEquals(null, null)).isFalse();
        }
    }

    @Nested
    @DisplayName("generateSessionId()")
    class GenerateSessionId {

        @Test
        @DisplayName("returns valid UUID format")
        void returnsValidUuid() {
            String sessionId = tokenHashService.generateSessionId();
            assertThat(sessionId).matches(
                    "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
        }

        @Test
        @DisplayName("returns unique session IDs")
        void returnsUniqueIds() {
            String id1 = tokenHashService.generateSessionId();
            String id2 = tokenHashService.generateSessionId();
            assertThat(id1).isNotEqualTo(id2);
        }
    }

    @Nested
    @DisplayName("generateFamilyId()")
    class GenerateFamilyId {

        @Test
        @DisplayName("returns valid UUID format")
        void returnsValidUuid() {
            String familyId = tokenHashService.generateFamilyId();
            assertThat(familyId).matches(
                    "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
        }

        @Test
        @DisplayName("returns unique family IDs")
        void returnsUniqueIds() {
            String id1 = tokenHashService.generateFamilyId();
            String id2 = tokenHashService.generateFamilyId();
            assertThat(id1).isNotEqualTo(id2);
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
