package com.finflow.modules.cards.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a card")
public record CreateCardRequest(
    @NotNull(message = "Account ID is required")
    @Schema(description = "Account ID to link card to")
    String accountId,

    @NotNull(message = "Card type is required")
    @Schema(description = "Card type (DEBIT, CREDIT, PREPAID)")
    String cardType,

    @NotNull(message = "Cardholder name is required")
    @Schema(description = "Cardholder name")
    String cardholderName,

    @Schema(description = "Credit limit in cents (for credit cards)")
    Long creditLimitCents,

    @Schema(description = "Daily spending limit in cents")
    Long dailyLimitCents,

    @Schema(description = "Monthly spending limit in cents")
    Long monthlyLimitCents,

    @Schema(description = "Currency code")
    String currency
) {}
