package com.finflow.modules.admin.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Admin audit log response DTO")
public record AuditLogResponse(
    @Schema(description = "Audit log ID")
    String id,
    @Schema(description = "Admin user who performed the action")
    String adminUserId,
    @Schema(description = "Action performed")
    String action,
    @Schema(description = "Target entity type")
    String targetType,
    @Schema(description = "Target entity ID")
    String targetId,
    @Schema(description = "Additional details")
    String details,
    @Schema(description = "IP address of the admin")
    String ipAddress,
    @Schema(description = "Timestamp of the action")
    String createdAt
) {}
