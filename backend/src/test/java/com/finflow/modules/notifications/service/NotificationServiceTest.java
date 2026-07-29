package com.finflow.modules.notifications.service;

import com.finflow.modules.notifications.domain.Notification;
import com.finflow.modules.notifications.domain.NotificationType;
import com.finflow.modules.notifications.dto.MarkReadRequest;
import com.finflow.modules.notifications.dto.NotificationResponse;
import com.finflow.modules.notifications.mapper.NotificationMapper;
import com.finflow.modules.notifications.repository.NotificationRepository;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.util.SecurityUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private NotificationRepository notificationRepository;
    @Mock private NotificationMapper notificationMapper;

    @InjectMocks private NotificationService notificationService;

    private String testUserId;
    private UUID testNotificationId;
    private Notification testNotification;
    private NotificationResponse testResponse;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID().toString();
        testNotificationId = UUID.randomUUID();

        testNotification = new Notification(testUserId, NotificationType.SYSTEM, "Test Title", "Test Message");
        ReflectionTestUtils.setField(testNotification, "id", testNotificationId);

        testResponse = new NotificationResponse(
                testNotificationId.toString(), testUserId, NotificationType.SYSTEM,
                "Test Title", "Test Message", null, null,
                false, null, "2026-01-01T00:00:00", "2026-01-01T00:00:00");

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(testUserId, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("Get My Notifications")
    class GetMyNotifications {

        @Test
        @DisplayName("Should return paginated notifications")
        void getMyNotifications_success() {
            List<Notification> notifications = List.of(testNotification);
            Page<Notification> page = new PageImpl<>(notifications, PageRequest.of(0, 20), 1);

            when(notificationRepository.findByOwnerId(eq(testUserId), any(PageRequest.class))).thenReturn(page);
            when(notificationMapper.toResponseList(notifications)).thenReturn(List.of(testResponse));

            var result = notificationService.getMyNotifications(0, 20);

            assertThat(result).isNotNull();
            assertThat(result.content()).hasSize(1);
            assertThat(result.totalElements()).isEqualTo(1);
            verify(notificationRepository).findByOwnerId(eq(testUserId), any(PageRequest.class));
        }

        @Test
        @DisplayName("Should return empty paginated response when no notifications")
        void getMyNotifications_empty() {
            Page<Notification> emptyPage = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 20), 0);

            when(notificationRepository.findByOwnerId(anyString(), any(PageRequest.class))).thenReturn(emptyPage);
            when(notificationMapper.toResponseList(Collections.emptyList())).thenReturn(Collections.emptyList());

            var result = notificationService.getMyNotifications(0, 20);

            assertThat(result.content()).isEmpty();
            assertThat(result.totalElements()).isZero();
        }
    }

    @Nested
    @DisplayName("Get Notification")
    class GetNotification {

        @Test
        @DisplayName("Should return notification by ID")
        void getNotification_success() {
            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.of(testNotification));
            when(notificationMapper.toResponse(testNotification)).thenReturn(testResponse);

            NotificationResponse result = notificationService.getNotification(testNotificationId);

            assertThat(result).isNotNull();
            assertThat(result.title()).isEqualTo("Test Title");
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when not found")
        void getNotification_notFound() {
            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> notificationService.getNotification(testNotificationId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Notification");
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when not owned by user")
        void getNotification_notOwnedByUser() {
            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> notificationService.getNotification(testNotificationId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Unread Count")
    class UnreadCount {

        @Test
        @DisplayName("Should return the correct unread count")
        void getUnreadCount_success() {
            when(notificationRepository.countByOwnerIdAndIsReadFalse(testUserId)).thenReturn(5L);

            long count = notificationService.getUnreadCount();

            assertThat(count).isEqualTo(5L);
            verify(notificationRepository).countByOwnerIdAndIsReadFalse(testUserId);
        }

        @Test
        @DisplayName("Should return zero when all notifications are read")
        void getUnreadCount_zero() {
            when(notificationRepository.countByOwnerIdAndIsReadFalse(testUserId)).thenReturn(0L);

            long count = notificationService.getUnreadCount();

            assertThat(count).isZero();
        }
    }

    @Nested
    @DisplayName("Mark Read")
    class MarkRead {

        @Test
        @DisplayName("Should mark notification as read")
        void markRead_success() {
            MarkReadRequest request = new MarkReadRequest(true);

            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.of(testNotification));
            when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);
            when(notificationMapper.toResponse(testNotification)).thenReturn(testResponse);

            NotificationResponse result = notificationService.markRead(testNotificationId, request);

            assertThat(result).isNotNull();
            assertThat(testNotification.getIsRead()).isTrue();
            assertThat(testNotification.getReadAt()).isNotNull();
            verify(notificationRepository).save(testNotification);
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when notification not found")
        void markRead_notFound() {
            MarkReadRequest request = new MarkReadRequest(true);

            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> notificationService.markRead(testNotificationId, request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Mark All Read")
    class MarkAllRead {

        @Test
        @DisplayName("Should mark all notifications as read")
        void markAllRead_success() {
            notificationService.markAllRead();

            verify(notificationRepository).markAllAsRead(eq(testUserId), any(LocalDateTime.class));
        }
    }

    @Nested
    @DisplayName("Delete Notification")
    class DeleteNotification {

        @Test
        @DisplayName("Should delete a notification")
        void deleteNotification_success() {
            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.of(testNotification));

            notificationService.deleteNotification(testNotificationId);

            verify(notificationRepository).delete(testNotification);
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when notification not found")
        void deleteNotification_notFound() {
            when(notificationRepository.findByIdAndOwnerId(testNotificationId, testUserId))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> notificationService.deleteNotification(testNotificationId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}
