package com.finflow.modules.transfers.dto;

import com.finflow.modules.transfers.domain.ScheduleStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Transfer template response DTO")
public record TemplateResponse(
    @Schema(description = "Template ID")
    String id,
    @Schema(description = "Template name")
    String templateName,
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
    @Schema(description = "Template status")
    ScheduleStatus templateStatus,
    @Schema(description = "Created timestamp")
    String createdAt
) {}
