package com.finflow.modules.transfers.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request body for creating a transfer template")
public record CreateTemplateRequest(
    @NotNull(message = "Template name is required")
    @Schema(description = "Template name", example = "Monthly Rent")
    String templateName,

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
    String description
) {}
