package com.finflow.modules.savings.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for depositing to a savings goal")
public record DepositToSavingsGoalRequest(
    @NotNull(message = "Amount is required")
    @Schema(description = "Amount in cents")
    Long amountCents
) {}
