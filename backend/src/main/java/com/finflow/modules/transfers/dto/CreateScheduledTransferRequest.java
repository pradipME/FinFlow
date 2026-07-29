package com.finflow.modules.transfers.dto;

import com.finflow.modules.transfers.domain.ScheduleStatus;
import com.finflow.modules.transfers.domain.ScheduleType;
import com.finflow.modules.transfers.domain.TransferFrequency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a scheduled transfer")
public record CreateScheduledTransferRequest(
    @Schema(description = "Template ID")
    String templateId,

    @NotNull(message = "Source account is required")
    @Schema(description = "Source account ID")
    String sourceAccountId,

    @Schema(description = "Target account ID")
    String targetAccountId,

    @Schema(description = "Target beneficiary ID")
    String targetBeneficiaryId,

    @NotNull(message = "Amount is required")
    @Schema(description = "Amount in cents")
    Long amountCents,

    @Schema(description = "Currency code")
    String currency,

    @Schema(description = "Description")
    String description,

    @NotNull(message = "Schedule type is required")
    @Schema(description = "Schedule type (ONE_TIME or RECURRING)")
    ScheduleType scheduleType,

    @Schema(description = "Frequency for recurring transfers")
    TransferFrequency frequency,

    @NotNull(message = "Next execution date is required")
    @Schema(description = "Next execution date-time (ISO-8601)")
    String nextExecution,

    @Schema(description = "End date for recurring transfers")
    String endDate,

    @Schema(description = "Maximum number of executions")
    Integer maxExecutions
) {}
