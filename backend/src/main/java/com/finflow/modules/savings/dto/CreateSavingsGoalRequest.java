package com.finflow.modules.savings.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a savings goal")
public record CreateSavingsGoalRequest(
    @NotNull(message = "Account ID is required")
    @Schema(description = "Linked account ID")
    String accountId,

    @NotNull(message = "Goal name is required")
    @Schema(description = "Goal name")
    String goalName,

    @NotNull(message = "Target amount is required")
    @Schema(description = "Target amount in cents")
    Long targetAmountCents,

    @Schema(description = "Currency code")
    String currency,

    @Schema(description = "Deadline (ISO-8601 date)")
    String deadline,

    @Schema(description = "Description")
    String description
) {}
