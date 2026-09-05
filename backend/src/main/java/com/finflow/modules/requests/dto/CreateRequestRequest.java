package com.finflow.modules.requests.dto;

import com.finflow.modules.requests.domain.CustomerRequestType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for a customer filing a new request (account or card).
 */
@Schema(description = "Request body for creating a customer request")
public record CreateRequestRequest(
    @NotNull(message = "requestType is required")
    @Schema(description = "Request type", example = "ACCOUNT_REQUEST")
    CustomerRequestType requestType,

    @Schema(description = "Target account id (required for CARD_REQUEST, ignored for ACCOUNT_REQUEST)")
    String targetAccountId,

    @Schema(description = "Structured request details")
    RequestDetails details
) {}