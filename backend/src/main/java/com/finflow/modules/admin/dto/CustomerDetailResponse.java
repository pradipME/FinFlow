package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Detailed customer view used by the admin Customers console.
 *
 * <p>Extends the row-level {@link UserManagementResponse} summary with aggregate
 * counts so the detail page can render account/card/request context.</p>
 */
@Schema(description = "Detailed customer view for the admin Customers console")
public record CustomerDetailResponse(
    @Schema(description = "User ID")
    String id,
    @Schema(description = "User email")
    String email,
    @Schema(description = "User full name")
    String fullName,
    @Schema(description = "Phone number")
    String phoneNumber,
    @Schema(description = "User role")
    String role,
    @Schema(description = "Account status")
    String status,
    @Schema(description = "Registration date")
    String createdAt,
    @Schema(description = "Number of accounts the customer owns")
    long accountCount,
    @Schema(description = "Number of cards the customer holds")
    long cardCount,
    @Schema(description = "Number of pending requests from this customer")
    long pendingRequestCount
) {}