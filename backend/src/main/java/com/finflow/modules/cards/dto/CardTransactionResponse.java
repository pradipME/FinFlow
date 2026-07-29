package com.finflow.modules.cards.dto;

import com.finflow.modules.cards.domain.CardTransactionStatus;
import com.finflow.modules.cards.domain.CardTransactionType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Card transaction response DTO")
public record CardTransactionResponse(
    @Schema(description = "Transaction ID")
    String id,
    @Schema(description = "Card ID")
    String cardId,
    @Schema(description = "Transaction type")
    CardTransactionType transactionType,
    @Schema(description = "Amount in cents")
    Long amountCents,
    @Schema(description = "Currency")
    String currency,
    @Schema(description = "Merchant name")
    String merchantName,
    @Schema(description = "Merchant category")
    String merchantCategory,
    @Schema(description = "Status")
    CardTransactionStatus status,
    @Schema(description = "Authorization code")
    String authorizationCode,
    @Schema(description = "Created timestamp")
    String createdAt
) {}
