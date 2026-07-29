package com.finflow.modules.notifications.controller;

import com.finflow.modules.notifications.dto.MarkReadRequest;
import com.finflow.modules.notifications.dto.NotificationResponse;
import com.finflow.modules.notifications.service.NotificationService;
import com.finflow.shared.dto.ApiResponse;
import com.finflow.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Notification management endpoints")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get my notifications")
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<NotificationResponse> response = notificationService.getMyNotifications(page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{notificationId}")
    @Operation(summary = "Get notification details")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotification(
            @PathVariable UUID notificationId) {
        NotificationResponse response = notificationService.getNotification(notificationId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(ApiResponse.ok(count));
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Mark a notification as read or unread")
    public ResponseEntity<ApiResponse<NotificationResponse>> markRead(
            @PathVariable UUID notificationId,
            @Valid @RequestBody MarkReadRequest request) {
        NotificationResponse response = notificationService.markRead(notificationId, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Notification updated successfully"));
    }

    @PostMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllRead() {
        notificationService.markAllRead();
        return ResponseEntity.ok(ApiResponse.ok(null, "All notifications marked as read"));
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable UUID notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Notification deleted successfully"));
    }
}
