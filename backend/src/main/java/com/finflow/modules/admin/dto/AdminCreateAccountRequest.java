package com.finflow.modules.admin.dto;

import com.finflow.modules.accounts.domain.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for an admin creating an account on behalf of a customer.
 */
@Schema(description = "Request body for admin to create a bank account for a customer")
public record AdminCreateAccountRequest(
    @NotNull(message = "customerId is required")
    @Schema(description = "Customer user id that will own the account")
    String customerId,
    @NotNull(message = "accountType is required")
    @Schema(description = "Account type", example = "SAVINGS")
    AccountType accountType,
    @Schema(description = "Optional currency (defaults to USD)", example = "USD")
    String currency,
    @Schema(description = "Optional nickname", example = "My Savings")
    String nickname
) {}