package com.finflow.modules.savings.dto;

import com.finflow.modules.savings.domain.SavingsGoalStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Savings goal response DTO")
public record SavingsGoalResponse(
    @Schema(description = "Goal ID")
    String id,
    @Schema(description = "Account ID")
    String accountId,
    @Schema(description = "Goal name")
    String goalName,
    @Schema(description = "Target amount in cents")
    Long targetAmountCents,
    @Schema(description = "Current amount in cents")
    Long currentAmountCents,
    @Schema(description = "Currency")
    String currency,
    @Schema(description = "Goal status")
    SavingsGoalStatus goalStatus,
    @Schema(description = "Deadline")
    String deadline,
    @Schema(description = "Description")
    String description,
    @Schema(description = "Progress percent")
    double progressPercent,
    @Schema(description = "Created timestamp")
    String createdAt
) {}
