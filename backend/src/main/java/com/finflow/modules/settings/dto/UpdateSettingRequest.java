package com.finflow.modules.settings.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request body for updating a setting")
public record UpdateSettingRequest(
    @NotBlank(message = "Setting value is required")
    @Schema(description = "Setting value", example = "true")
    String settingValue
) {}
