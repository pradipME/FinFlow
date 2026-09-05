package com.finflow.modules.requests.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Structured, order-independent payload describing a customer request.
 *
 * <p>Stored as JSON in the {@code details} column. Field usage depends on the
 * request type:</p>
 * <ul>
 *   <li><b>ACCOUNT_REQUEST</b> — uses {@code accountType}, {@code nickname}, {@code currency}.</li>
 *   <li><b>CARD_REQUEST</b> — uses {@code cardType}, {@code cardholderName}, limit fields; the
 *       target account id is carried by {@code targetAccountId} on the request itself.</li>
 * </ul>
 */
@Schema(description = "Structured details payload for a customer request")
public record RequestDetails(
    @Schema(description = "Requested account type (account requests)", example = "SAVINGS")
    String accountType,
    @Schema(description = "Requested account nickname (account requests)", example = "My Savings")
    String nickname,
    @Schema(description = "Requested currency", example = "USD")
    String currency,
    @Schema(description = "Requested card type (card requests)", example = "DEBIT")
    String cardType,
    @Schema(description = "Cardholder name (card requests)", example = "John Doe")
    String cardholderName,
    @Schema(description = "Credit limit in cents (credit cards)")
    Long creditLimitCents,
    @Schema(description = "Daily limit in cents (card requests)")
    Long dailyLimitCents,
    @Schema(description = "Monthly limit in cents (card requests)")
    Long monthlyLimitCents
) {
    public static RequestDetails empty() {
        return new RequestDetails(null, null, null, null, null, null, null, null);
    }
}