package com.finflow.modules.accounts.dto;

import com.finflow.modules.accounts.domain.AccountStatusHistory;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Account status history entry")
public record StatusHistoryResponse(
    @Schema(description = "History entry ID")
    Long id,

    @Schema(description = "Previous status")
    String previousStatus,

    @Schema(description = "New status")
    String newStatus,

    @Schema(description = "Reason for change")
    String reason,

    @Schema(description = "User who made the change")
    String changedBy,

    @Schema(description = "When the change was made")
    String changedAt
) {}
