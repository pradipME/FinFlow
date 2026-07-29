package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Account summary DTO for list views")
public record AccountSummaryResponse(
    @Schema(description = "Account ID", example = "550e8400-e29b-41d4-a716-446655440000")
    String id,

    @Schema(description = "Masked account number", example = "****1234")
    String accountNumber,

    @Schema(description = "Account type")
    AccountType accountType,

    @Schema(description = "Account status")
    AccountStatus accountStatus,

    @Schema(description = "Account nickname", example = "My Checking")
    String nickname,

    @Schema(description = "Currency code", example = "USD")
    String currency,

    @Schema(description = "Available balance in cents", example = "125000")
    Long availableBalanceCents,

    @Schema(description = "Date the account was created")
    String createdAt
) {}
