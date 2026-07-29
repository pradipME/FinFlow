package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a new account")
public record CreateAccountRequest(
    @NotNull(message = "Account type is required")
    @Schema(description = "Account type", example = "CHECKING")
    AccountType accountType,

    @Schema(description = "Optional nickname", example = "My Savings")
    String nickname,

    @Schema(description = "Currency code", example = "USD")
    String currency
) {}
