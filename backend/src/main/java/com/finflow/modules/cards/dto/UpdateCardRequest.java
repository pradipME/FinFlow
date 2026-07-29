package com.finflow.modules.cards.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for updating card details")
public record UpdateCardRequest(
    @Schema(description = "Cardholder name")
    String cardholderName,
    @Schema(description = "Daily spending limit in cents")
    Long dailyLimitCents,
    @Schema(description = "Monthly spending limit in cents")
    Long monthlyLimitCents
) {}
