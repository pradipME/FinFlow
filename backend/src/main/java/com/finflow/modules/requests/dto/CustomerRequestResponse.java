package com.finflow.modules.requests.dto;

import com.finflow.modules.requests.domain.CustomerRequestStatus;
import com.finflow.modules.requests.domain.CustomerRequestType;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response DTO for a customer request (used by both customer and admin views).
 */
@Schema(description = "Customer request response DTO")
public record CustomerRequestResponse(
    @Schema(description = "Request ID")
    String id,
    @Schema(description = "Customer who filed the request")
    String customerId,
    @Schema(description = "Request type")
    CustomerRequestType requestType,
    @Schema(description = "Current status")
    CustomerRequestStatus requestStatus,
    @Schema(description = "Target account id (card requests)")
    String targetAccountId,
    @Schema(description = "Structured request details")
    RequestDetails details,
    @Schema(description = "Admin who reviewed the request")
    String reviewedBy,
    @Schema(description = "When the request was reviewed")
    String reviewedAt,
    @Schema(description = "Rejection reason, when rejected")
    String rejectionReason,
    @Schema(description = "When the request was created")
    String createdAt
) {}