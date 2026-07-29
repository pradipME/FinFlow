package com.finflow.modules.transactions.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a transfer")
public record TransferRequest(
    @NotNull(message = "Source account ID is required")
    @Schema(description = "Source account ID")
    String sourceAccountId,

    @NotNull(message = "Target account ID is required")
    @Schema(description = "Target account ID")
    String targetAccountId,

    @NotNull(message = "Amount is required")
    @Schema(description = "Amount in cents", example = "5000")
    Long amountCents,

    @Schema(description = "Currency code", example = "USD")
    String currency,

    @Schema(description = "Description", example = "Rent payment")
    String description,

    @Schema(description = "Idempotency key")
    String idempotencyKey
) {}
