package com.finflow.modules.settings.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Setting response DTO")
public record SettingResponse(
    @Schema(description = "Setting ID")
    String id,

    @Schema(description = "Setting key")
    String settingKey,

    @Schema(description = "Setting value")
    String settingValue,

    @Schema(description = "Created timestamp")
    String createdAt,

    @Schema(description = "Updated timestamp")
    String updatedAt
) {}
