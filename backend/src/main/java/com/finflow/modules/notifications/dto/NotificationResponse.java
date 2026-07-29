package com.finflow.modules.notifications.dto;

import com.finflow.modules.notifications.domain.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Notification response payload")
public record NotificationResponse(
        @Schema(description = "Notification ID") String id,
        @Schema(description = "Owner ID") String ownerId,
        @Schema(description = "Type") NotificationType notificationType,
        @Schema(description = "Title") String title,
        @Schema(description = "Message") String message,
        @Schema(description = "Reference type") String referenceType,
        @Schema(description = "Reference ID") String referenceId,
        @Schema(description = "Is read") Boolean isRead,
        @Schema(description = "Read at") String readAt,
        @Schema(description = "Created at") String createdAt,
        @Schema(description = "Updated at") String updatedAt
) {}
