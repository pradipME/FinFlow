package com.finflow.modules.transfers.dto;

import com.finflow.modules.transfers.domain.ScheduleStatus;
import com.finflow.modules.transfers.domain.ScheduleType;
import com.finflow.modules.transfers.domain.TransferFrequency;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Scheduled transfer response DTO")
public record ScheduledTransferResponse(
    @Schema(description = "Transfer ID")
    String id,
    @Schema(description = "Template ID")
    String templateId,
    @Schema(description = "Source account ID")
    String sourceAccountId,
    @Schema(description = "Target account ID")
    String targetAccountId,
    @Schema(description = "Target beneficiary ID")
    String targetBeneficiaryId,
    @Schema(description = "Amount in cents")
    Long amountCents,
    @Schema(description = "Currency code")
    String currency,
    @Schema(description = "Description")
    String description,
    @Schema(description = "Schedule type")
    ScheduleType scheduleType,
    @Schema(description = "Frequency")
    TransferFrequency frequency,
    @Schema(description = "Next execution")
    String nextExecution,
    @Schema(description = "Last execution")
    String lastExecution,
    @Schema(description = "End date")
    String endDate,
    @Schema(description = "Execution count")
    Integer executionCount,
    @Schema(description = "Max executions")
    Integer maxExecutions,
    @Schema(description = "Schedule status")
    ScheduleStatus scheduleStatus,
    @Schema(description = "Created timestamp")
    String createdAt
) {}
