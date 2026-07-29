package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.HoldStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Account hold response DTO")
public record HoldResponse(
    @Schema(description = "Hold ID")
    String id,

    @Schema(description = "Hold amount in cents")
    Long amountCents,

    @Schema(description = "Hold reason")
    String reason,

    @Schema(description = "Source type")
    String sourceType,

    @Schema(description = "Source ID")
    String sourceId,

    @Schema(description = "Hold status")
    HoldStatus holdStatus,

    @Schema(description = "When the hold was released")
    String releasedAt,

    @Schema(description = "When the hold expires")
    String expiresAt,

    @Schema(description = "When the hold was created")
    String createdAt
) {}
