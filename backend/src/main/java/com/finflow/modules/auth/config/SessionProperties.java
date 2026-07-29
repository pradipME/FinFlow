package com.finflow.modules.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "finflow.session")
public record SessionProperties(
        int maxActiveSessions,
        long refreshTokenTtlDays
) {
    public SessionProperties {
        if (maxActiveSessions < 1) maxActiveSessions = 5;
        if (refreshTokenTtlDays < 1) refreshTokenTtlDays = 30;
    }

    public static SessionProperties defaults() {
        return new SessionProperties(5, 30);
    }
}
