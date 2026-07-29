package com.finflow.modules.transfers.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for updating a transfer template")
public record UpdateTemplateRequest(
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
    String description
) {}
