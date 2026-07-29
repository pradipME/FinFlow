package com.finflow.shared.constants;

import java.util.Set;

public final class SecurityConstants {

    private SecurityConstants() {}

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String PUBLIC_PATHS_PATTERN = "/api/v1/auth/**";

    public static final Set<String> WHITELIST_PATHS = Set.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/auth/revoke",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/api/v1/auth/verify-email",
            "/api/v1/health",
            "/api/v1/health/**",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/actuator/health"
    );

    public static final long OAUTH_TOKEN_EXPIRY_MS = 1_800_000L;
}
