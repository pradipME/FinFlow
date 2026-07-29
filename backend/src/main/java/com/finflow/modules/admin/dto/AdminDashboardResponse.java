package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Admin dashboard statistics response DTO")
public record AdminDashboardResponse(
    @Schema(description = "Total registered users")
    long totalUsers,
    @Schema(description = "Total active accounts")
    long totalAccounts,
    @Schema(description = "Total transactions processed")
    long totalTransactions,
    @Schema(description = "Recent admin activity count")
    int recentActivity
) {}
