package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for an admin funding (crediting) a customer account.
 */
@Schema(description = "Request body for admin to fund a customer account")
public record FundAccountRequest(
    @NotNull(message = "amountCents is required")
    @Schema(description = "Amount to credit in cents", example = "100000")
    Long amountCents,
    @Schema(description = "Optional description", example = "Admin funding")
    String description
) {}