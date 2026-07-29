package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.AccountStatus;
import com.finflow.modules.accounts.domain.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Full account detail DTO")
public record AccountDetailResponse(
    @Schema(description = "Account ID")
    String id,

    @Schema(description = "Owner user ID")
    String ownerId,

    @Schema(description = "Account number (masked)")
    String accountNumber,

    @Schema(description = "Account type")
    AccountType accountType,

    @Schema(description = "Account status")
    AccountStatus accountStatus,

    @Schema(description = "Account nickname")
    String nickname,

    @Schema(description = "Currency code")
    String currency,

    @Schema(description = "Ledger balance in cents")
    Long ledgerBalanceCents,

    @Schema(description = "Available balance in cents")
    Long availableBalanceCents,

    @Schema(description = "Number of active holds")
    int activeHoldCount,

    @Schema(description = "Active holds summary")
    List<HoldResponse> activeHolds,

    @Schema(description = "Date the account was created")
    String createdAt,

    @Schema(description = "Last updated timestamp")
    String updatedAt
) {}
