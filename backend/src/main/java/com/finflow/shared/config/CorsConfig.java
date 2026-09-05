package com.finflow.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class CorsConfig {

    private final List<String> configuredOrigins;

    public CorsConfig(@Value("${finflow.cors.allowed-origins:}") String allowedOrigins) {
        this.configuredOrigins = parseOrigins(allowedOrigins);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        Set<String> origins = new LinkedHashSet<>();
        origins.add("https://*.finflow.com");
        origins.add("http://localhost:3000");
        origins.add("http://localhost:5173");
        // Vite dev server picks the first free port (5173, 5174, 5175, ...).
        // Allow any localhost port so local development works regardless of
        // which port Vite binds to.
        origins.add("http://localhost:*");
        origins.addAll(configuredOrigins);

        config.setAllowedOriginPatterns(List.copyOf(origins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of(
                "Authorization", "Content-Type", "X-Request-Id",
                "X-Idempotency-Key", "Idempotency-Key", "Accept", "Origin",
                "X-Device-Fingerprint"
        ));
        config.setExposedHeaders(List.of(
                "X-Request-Id", "X-RateLimit-Limit", "X-RateLimit-Remaining",
                "X-RateLimit-Reset", "Api-Version"
        ));
        config.setAllowCredentials(true);
        config.setMaxAge(86400L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private static List<String> parseOrigins(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();
    }
}