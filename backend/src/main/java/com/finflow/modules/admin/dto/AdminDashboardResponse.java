package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Admin dashboard statistics response DTO")
public record AdminDashboardResponse(
    @Schema(description = "Total registered users")
    long totalUsers,
    @Schema(description = "Users with ACTIVE status")
    long activeUsers,
    @Schema(description = "Total active accounts (all statuses)")
    long totalAccounts,
    @Schema(description = "Accounts with ACTIVE status")
    long activeAccounts,
    @Schema(description = "Total cards issued")
    long totalCards,
    @Schema(description = "Cards with ACTIVE status")
    long activeCards,
    @Schema(description = "Total funds across all customer accounts (sum of available balances in cents)")
    long totalFundsCents,
    @Schema(description = "Pending account requests")
    long pendingAccountRequests,
    @Schema(description = "Pending card requests")
    long pendingCardRequests,
    @Schema(description = "Total pending requests (account + card)")
    long pendingRequests,
    @Schema(description = "Pending customer requests submitted in the last 7 days")
    long recentCustomerRequests,
    @Schema(description = "Total transactions in the system")
    long totalTransactions,
    @Schema(description = "Transactions processed in the last 7 days")
    long recentTransactions
) {}