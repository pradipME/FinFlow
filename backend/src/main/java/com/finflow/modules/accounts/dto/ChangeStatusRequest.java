package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.AccountStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for changing account status")
public record ChangeStatusRequest(
    @NotNull(message = "New status is required")
    @Schema(description = "New account status")
    AccountStatus newStatus,

    @Schema(description = "Reason for the status change")
    String reason
) {}
