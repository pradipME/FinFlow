package com.finflow.modules.auth.dto;

import com.finflow.shared.constants.ErrorCodes;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request payload for revoking a refresh token")
public record RevokeTokenRequest(

        @Schema(
                description = "The refresh token to revoke",
                example = "eyJhbGciOiJIUzI1NiJ9..."
        )
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        String refreshToken
) {}
