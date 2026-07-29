package com.finflow.shared.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final JwtProperties jwtProperties;
    private final JwtSigningKeyProvider keyProvider;

    public JwtTokenProvider(JwtProperties jwtProperties, JwtSigningKeyProvider keyProvider) {
        this.jwtProperties = jwtProperties;
        this.keyProvider = keyProvider;
    }

    public String generateAccessToken(String userId, String email,
                                      List<String> roles, List<String> permissions) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusMillis(jwtProperties.accessTokenExpirationMs());

        return Jwts.builder()
                .id(java.util.UUID.randomUUID().toString())
                .subject(userId)
                .claim("email", email)
                .claim("roles", roles)
                .claim("permissions", permissions)
                .issuer(jwtProperties.issuer())
                .audience().add(jwtProperties.audience()).and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .header().keyId(keyProvider.getActiveKeyId()).and()
                .signWith(keyProvider.getKeyForSigning())
                .compact();
    }

    public JwtClaims parseToken(String token) {
        Jws<Claims> parsed = Jwts.parser()
                .verifyWith(keyProvider.getActiveKey())
                .build()
                .parseSignedClaims(token);
        Claims claims = parsed.getPayload();

        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        @SuppressWarnings("unchecked")
        List<String> permissions = claims.get("permissions", List.class);

        String kid = parsed.getHeader().getKeyId();

        return new JwtClaims(
                claims.getSubject(),
                claims.getId(),
                claims.getIssuedAt().toInstant(),
                claims.getExpiration().toInstant(),
                claims.getIssuer(),
                claims.getAudience() != null ? String.join(",", claims.getAudience()) : null,
                roles != null ? roles : List.of(),
                permissions != null ? permissions : List.of(),
                kid
        );
    }

    public boolean validateToken(String token) {
        try {
            resolveKeyAndParse(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.debug("JWT token expired: {}", e.getMessage());
            return false;
        } catch (SignatureException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Claims claims = resolveKeyAndParse(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (JwtException e) {
            return true;
        }
    }

    public String extractUserId(String token) {
        return parseToken(token).subject();
    }

    public String extractEmail(String token) {
        Claims claims = resolveKeyAndParse(token);
        return claims.get("email", String.class);
    }

    private Claims resolveKeyAndParse(String token) {
        SecretKey key = keyProvider.resolveKeyFromToken(token);
        if (key == null) {
            key = keyProvider.getActiveKey();
        }

        return Jwts.parser()
                .verifyWith(key)
                .requireIssuer(jwtProperties.issuer())
                .requireAudience(jwtProperties.audience())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
