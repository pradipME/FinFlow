package com.finflow.modules.transactions.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Request body for paying another customer by mobile number")
public record MobilePaymentRequest(
    @NotNull(message = "Source account ID is required")
    @Schema(description = "Sender's account ID")
    String sourceAccountId,

    @NotBlank(message = "Recipient mobile number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid mobile number format")
    @Schema(description = "Recipient mobile number in E.164 format", example = "+9876543210")
    String recipientMobile,

    @NotNull(message = "Amount is required")
    @Schema(description = "Amount in cents", example = "500000")
    Long amountCents,

    @Schema(description = "Currency code", example = "USD")
    String currency,

    @Schema(description = "Payment description", example = "Coffee payment")
    String description,

    @Schema(description = "Idempotency key")
    String idempotencyKey
) {}
