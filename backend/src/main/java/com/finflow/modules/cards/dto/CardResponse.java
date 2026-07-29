package com.finflow.modules.cards.dto;

import com.finflow.modules.cards.domain.CardStatus;
import com.finflow.modules.cards.domain.CardType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Card response DTO")
public record CardResponse(
    @Schema(description = "Card ID")
    String id,
    @Schema(description = "Account ID")
    String accountId,
    @Schema(description = "Masked card number")
    String cardLastFour,
    @Schema(description = "Card type")
    CardType cardType,
    @Schema(description = "Card status")
    CardStatus cardStatus,
    @Schema(description = "Cardholder name")
    String cardholderName,
    @Schema(description = "Expiry month")
    Integer expiryMonth,
    @Schema(description = "Expiry year")
    Integer expiryYear,
    @Schema(description = "Credit limit in cents")
    Long creditLimitCents,
    @Schema(description = "Daily limit in cents")
    Long dailyLimitCents,
    @Schema(description = "Monthly limit in cents")
    Long monthlyLimitCents,
    @Schema(description = "Currency")
    String currency,
    @Schema(description = "PIN set")
    Boolean pinSet,
    @Schema(description = "Created timestamp")
    String createdAt
) {}
