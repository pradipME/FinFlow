package com.finflow.modules.accounts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for placing a hold on an account")
public record PlaceHoldRequest(
    @Schema(description = "Hold amount in cents", example = "5000")
    @NotNull(message = "Amount is required")
    Long amountCents,

    @Schema(description = "Reason for the hold", example = "Pending transaction")
    @NotNull(message = "Reason is required")
    String reason,

    @Schema(description = "Source type (e.g. TRANSACTION)", example = "TRANSACTION")
    String sourceType,

    @Schema(description = "Source ID", example = "txn-123")
    String sourceId,

    @Schema(description = "Hold expiry date-time (ISO-8601)", example = "2026-01-15T12:00:00")
    String expiresAt
) {}
