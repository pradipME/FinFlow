package com.finflow.modules.transactions.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a withdrawal")
public record WithdrawalRequest(
    @NotNull(message = "Account ID is required")
    @Schema(description = "Source account ID")
    String accountId,

    @NotNull(message = "Amount is required")
    @Schema(description = "Amount in cents", example = "5000")
    Long amountCents,

    @Schema(description = "Currency code", example = "USD")
    String currency,

    @Schema(description = "Description", example = "ATM withdrawal")
    String description,

    @Schema(description = "Idempotency key")
    String idempotencyKey
) {}
