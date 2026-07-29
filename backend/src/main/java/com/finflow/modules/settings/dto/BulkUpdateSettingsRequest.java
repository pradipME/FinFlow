package com.finflow.modules.settings.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

@Schema(description = "Request body for bulk updating settings")
public record BulkUpdateSettingsRequest(
    @NotEmpty(message = "Settings map must not be empty")
    @Schema(description = "Map of setting key to setting value")
    Map<String, String> settings
) {}
