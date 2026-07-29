package com.finflow.modules.notifications.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Mark notification as read request")
public record MarkReadRequest(
        @NotNull
        @Schema(description = "Whether the notification is read (always true)", example = "true")
        Boolean isRead
) {}
