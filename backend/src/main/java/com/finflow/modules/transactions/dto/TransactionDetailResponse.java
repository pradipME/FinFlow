package com.finflow.modules.transactions.dto;

import com.finflow.modules.transactions.domain.TransactionStatus;
import com.finflow.modules.transactions.domain.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Full transaction detail DTO")
public record TransactionDetailResponse(
    @Schema(description = "Transaction ID")
    String id,

    @Schema(description = "Transaction type")
    TransactionType transactionType,

    @Schema(description = "Transaction status")
    TransactionStatus transactionStatus,

    @Schema(description = "Description")
    String description,

    @Schema(description = "Reference number")
    String referenceNumber,

    @Schema(description = "Amount in cents")
    Long amountCents,

    @Schema(description = "Currency code")
    String currency,

    @Schema(description = "Source account ID")
    String sourceAccountId,

    @Schema(description = "Target account ID")
    String targetAccountId,

    @Schema(description = "Fee amount in cents")
    Long feeAmountCents,

    @Schema(description = "User ID")
    String userId,

    @Schema(description = "Completed timestamp")
    String completedAt,

    @Schema(description = "Failed reason")
    String failedReason,

    @Schema(description = "Transaction entries")
    List<TransactionEntryResponse> entries,

    @Schema(description = "Created timestamp")
    String createdAt,

    @Schema(description = "Last updated timestamp")
    String updatedAt
) {}
