package com.finflow.modules.requests.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Request body for an ADMIN reviewing (approving or rejecting) a customer request.
 */
@Schema(description = "Request body for admin review of a customer request")
public record ReviewRequestRequest(
    @Schema(description = "Rejection reason (required when rejecting)", example = "Missing KYC documentation")
    String rejectionReason
) {}