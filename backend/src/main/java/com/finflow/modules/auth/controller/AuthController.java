package com.finflow.modules.auth.controller;

import com.finflow.modules.auth.dto.*;
import com.finflow.modules.auth.service.AuthenticationService;
import com.finflow.modules.auth.service.RefreshTokenService;
import com.finflow.modules.auth.service.RegistrationService;
import com.finflow.modules.auth.service.TokenHashService;
import com.finflow.modules.auth.service.TokenRevocationService;
import com.finflow.modules.auth.validator.RefreshTokenValidator;
import com.finflow.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for user registration and authentication.
 *
 * <p>Exposes unauthenticated endpoints for sign-up, login, token refresh,
 * and token revocation.</p>
 *
 * @author FinFlow Engineering
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "User registration, authentication, and token management endpoints")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final RegistrationService registrationService;
    private final AuthenticationService authenticationService;
    private final RefreshTokenService refreshTokenService;
    private final TokenRevocationService tokenRevocationService;
    private final RefreshTokenValidator refreshTokenValidator;
    private final TokenHashService tokenHashService;

    public AuthController(RegistrationService registrationService,
                          AuthenticationService authenticationService,
                          RefreshTokenService refreshTokenService,
                          TokenRevocationService tokenRevocationService,
                          RefreshTokenValidator refreshTokenValidator,
                          TokenHashService tokenHashService) {
        this.registrationService = registrationService;
        this.authenticationService = authenticationService;
        this.refreshTokenService = refreshTokenService;
        this.tokenRevocationService = tokenRevocationService;
        this.refreshTokenValidator = refreshTokenValidator;
        this.tokenHashService = tokenHashService;
    }

    /**
     * Registers a new user on the FinFlow platform.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account. "
                    + "Password must meet FinFlow security policy (min 8 chars, upper, lower, digit, special char).",
            security = {}
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Email or username already exists",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Registration request for email={}", request.email());
        RegisterResponse response = registrationService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "User registered successfully"));
    }

    /**
     * Authenticates a user with email/username and password.
     *
     * <p>Returns an access token and a refresh token. The client must store
     * both tokens and use the refresh token to obtain new access tokens.</p>
     */
    @PostMapping("/login")
    @Operation(
            summary = "Authenticate a user",
            description = "Authenticates a user with email address or username and password. "
                    + "Returns access token and refresh token.",
            security = {}
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Authentication successful",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Validation error or account locked",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        log.info("Login request for identifier={}", request.identifier());
        RefreshTokenResponse result = authenticationService.authenticateWithRefresh(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.ok(result, "Authentication successful"));
    }

    /**
     * Refreshes the access token using a valid refresh token.
     *
     * <p>Implements mandatory token rotation: the old refresh token is revoked
     * and a new refresh token is issued along with the new access token.</p>
     */
    @PostMapping("/refresh")
    @Operation(
            summary = "Refresh access token",
            description = "Exchanges a valid refresh token for a new access token and refresh token. "
                    + "The old refresh token is immediately revoked (mandatory rotation).",
            security = {}
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Invalid, expired, or revoked refresh token",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = extractClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        log.info("Token refresh request from ip={}", ipAddress);
        refreshTokenValidator.validateRefreshToken(request.refreshToken());

        RefreshTokenService.RefreshResult refreshResult =
                refreshTokenService.refresh(request.refreshToken(), ipAddress, userAgent);

        RefreshTokenResponse response = RefreshTokenResponse.of(
                refreshResult.accessToken(),
                refreshResult.refreshToken(),
                900);

        return ResponseEntity.ok(ApiResponse.ok(response, "Token refreshed successfully"));
    }

    /**
     * Revokes a specific refresh token.
     *
     * <p>The revoked token can no longer be used for refresh operations.
     * The associated session is terminated.</p>
     */
    @PostMapping("/revoke")
    @Operation(
            summary = "Revoke a refresh token",
            description = "Revokes a specific refresh token, terminating the associated session. "
                    + "The revoked token cannot be used for future refresh operations.",
            security = {}
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Token revoked successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid or missing refresh token",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> revoke(
            @Valid @RequestBody RevokeTokenRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = extractClientIp(httpRequest);
        refreshTokenValidator.validateRevokeRequest(request.refreshToken());

        log.info("Token revocation request from ip={}", ipAddress);
        boolean revoked = tokenRevocationService.revokeByTokenHash(
                tokenHashService.hashToken(request.refreshToken()),
                ipAddress);

        return ResponseEntity.ok(ApiResponse.ok(Map.of("revoked", revoked), "Token revocation processed"));
    }

    /**
     * Extracts the client IP address from the request, considering
     * reverse-proxy headers.
     */
    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
