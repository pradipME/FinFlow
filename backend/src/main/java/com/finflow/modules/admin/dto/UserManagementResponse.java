package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Admin user management summary DTO")
public record UserManagementResponse(
    @Schema(description = "User ID")
    String id,
    @Schema(description = "User email")
    String email,
    @Schema(description = "User full name")
    String fullName,
    @Schema(description = "User role")
    String role,
    @Schema(description = "Account status")
    String status,
    @Schema(description = "Registration date")
    String createdAt
) {}
