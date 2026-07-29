package com.finflow.modules.transactions.dto;

import com.finflow.modules.transactions.domain.EntryType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Transaction entry response DTO")
public record TransactionEntryResponse(
    @Schema(description = "Entry ID")
    String id,

    @Schema(description = "Account ID")
    String accountId,

    @Schema(description = "Entry type (DEBIT or CREDIT)")
    EntryType entryType,

    @Schema(description = "Amount in cents")
    Long amountCents,

    @Schema(description = "Currency code")
    String currency,

    @Schema(description = "Balance before this entry in cents")
    Long balanceBeforeCents,

    @Schema(description = "Balance after this entry in cents")
    Long balanceAfterCents,

    @Schema(description = "Description")
    String description,

    @Schema(description = "Created timestamp")
    String createdAt
) {}
