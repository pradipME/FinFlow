package com.finflow.modules.savings.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for updating a savings goal")
public record UpdateSavingsGoalRequest(
    @Schema(description = "Goal name")
    String goalName,
    @Schema(description = "Target amount in cents")
    Long targetAmountCents,
    @Schema(description = "Deadline (ISO-8601 date)")
    String deadline,
    @Schema(description = "Description")
    String description
) {}
