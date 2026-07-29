package com.finflow.modules.auth.dto;

import com.finflow.shared.constants.ErrorCodes;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request payload for refreshing an access token")
public record RefreshTokenRequest(

        @Schema(
                description = "The refresh token obtained during login or previous refresh",
                example = "eyJhbGciOiJIUzI1NiJ9..."
        )
        @NotBlank(message = ErrorCodes.REQUIRED_FIELD)
        String refreshToken
) {}
