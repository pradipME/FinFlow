package com.finflow.modules.notifications.mapper;

import com.finflow.modules.notifications.domain.Notification;
import com.finflow.modules.notifications.dto.NotificationResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId().toString(),
                notification.getOwnerId(),
                notification.getNotificationType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getReferenceType(),
                notification.getReferenceId(),
                notification.getIsRead(),
                formatDateTime(notification.getReadAt()),
                formatDateTime(notification.getCreatedAt()),
                formatDateTime(notification.getUpdatedAt())
        );
    }

    public List<NotificationResponse> toResponseList(List<Notification> notifications) {
        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(FORMATTER);
    }
}
