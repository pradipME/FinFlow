package com.finflow.shared.config;

import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class JwtPropertiesConfiguration {

    @Bean
    public JwtProperties jwtProperties(Environment env) {
        Binder binder = Binder.get(env);

        String secret = env.getRequiredProperty("finflow.jwt.secret");
        long accessTokenExpirationMs = env.getRequiredProperty("finflow.jwt.access-token-expiration-ms", Long.class);
        String issuer = env.getRequiredProperty("finflow.jwt.issuer");
        String audience = env.getRequiredProperty("finflow.jwt.audience");
        long clockSkewMs = env.getProperty("finflow.jwt.clock-skew-ms", Long.class, 30_000L);

        Map<String, String> signingKeys = new LinkedHashMap<>(binder
                .bind("finflow.jwt.signing-keys", Bindable.mapOf(String.class, String.class))
                .orElse(Map.of("primary", secret)));

        String previousSecret = env.getProperty("FINFLOW_JWT_KEY_PREVIOUS");
        if (previousSecret != null && !previousSecret.isBlank()) {
            signingKeys.put("previous", previousSecret);
        }

        String activeKeyId = env.getProperty("finflow.jwt.active-key-id", "primary");

        return new JwtProperties(secret, accessTokenExpirationMs, issuer, audience,
                clockSkewMs, signingKeys, activeKeyId);
    }
}
