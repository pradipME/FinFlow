package com.finflow.shared.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtSigningKeyProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtSigningKeyProvider.class);

    private final JwtProperties jwtProperties;
    private final Map<String, SecretKey> keyCache = new ConcurrentHashMap<>();
    private volatile SecretKey activeKey;
    private volatile String activeKeyId;

    public JwtSigningKeyProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        reloadKeys();
    }

    public void reloadKeys() {
        keyCache.clear();
        Map<String, String> configuredKeys = jwtProperties.signingKeys();
        if (configuredKeys != null) {
            for (Map.Entry<String, String> entry : configuredKeys.entrySet()) {
                byte[] keyBytes = entry.getValue().getBytes(StandardCharsets.UTF_8);
                if (keyBytes.length < 64) {
                    log.warn("JWT signing key '{}' is below minimum 512 bits ({} bytes). " +
                             "This may cause security issues.", entry.getKey(), keyBytes.length);
                }
                keyCache.put(entry.getKey(), Keys.hmacShaKeyFor(keyBytes));
            }
        }

        String activeId = jwtProperties.activeKeyId();
        if (activeId == null || !keyCache.containsKey(activeId)) {
            if (!keyCache.isEmpty()) {
                activeId = keyCache.keySet().iterator().next();
                log.warn("Configured activeKeyId '{}' not found in signing keys. Using '{}'.",
                         jwtProperties.activeKeyId(), activeId);
            } else {
                throw new IllegalStateException("No JWT signing keys configured");
            }
        }

        this.activeKeyId = activeId;
        this.activeKey = keyCache.get(activeId);
        log.info("JWT signing keys loaded. Active key: '{}', total keys: {}",
                 activeId, keyCache.size());
    }

    public SecretKey getActiveKey() {
        return activeKey;
    }

    public String getActiveKeyId() {
        return activeKeyId;
    }

    public SecretKey getKeyForSigning() {
        return activeKey;
    }

    public SecretKey resolveKey(String kid) {
        if (kid == null) {
            log.debug("No kid header found, using active key");
            return activeKey;
        }
        SecretKey key = keyCache.get(kid);
        if (key == null) {
            log.warn("Unknown kid '{}' in JWT header. Rejecting token.", kid);
            return null;
        }
        return key;
    }

    public SecretKey resolveKeyFromToken(String token) {
        try {
            var parsed = Jwts.parser()
                .verifyWith(activeKey)
                .build()
                .parseSignedClaims(token);
            String kid = parsed.getHeader().getKeyId();
            return resolveKey(kid);
        } catch (Exception e) {
            log.debug("Could not extract kid from token: {}", e.getMessage());
            return null;
        }
    }

    public boolean isKeyKnown(String kid) {
        return kid != null && keyCache.containsKey(kid);
    }

    public Map<String, SecretKey> getAllKeys() {
        return Map.copyOf(keyCache);
    }

    public int getKeyCount() {
        return keyCache.size();
    }
}
