package com.finflow.modules.notifications.service;

import com.finflow.modules.notifications.domain.Notification;
import com.finflow.modules.notifications.dto.MarkReadRequest;
import com.finflow.modules.notifications.dto.NotificationResponse;
import com.finflow.modules.notifications.mapper.NotificationMapper;
import com.finflow.modules.notifications.repository.NotificationRepository;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.ResourceNotFoundException;
import com.finflow.shared.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getMyNotifications(int page, int size) {
        String userId = SecurityUtil.getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notificationPage = notificationRepository.findByOwnerId(userId, pageable);
        return PageResponse.of(
                notificationMapper.toResponseList(notificationPage.getContent()),
                notificationPage.getNumber(), notificationPage.getSize(), notificationPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public NotificationResponse getNotification(UUID notificationId) {
        String userId = SecurityUtil.getCurrentUserId();
        Notification notification = notificationRepository.findByIdAndOwnerId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId.toString()));
        return notificationMapper.toResponse(notification);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        String userId = SecurityUtil.getCurrentUserId();
        return notificationRepository.countByOwnerIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markRead(UUID notificationId, MarkReadRequest request) {
        String userId = SecurityUtil.getCurrentUserId();
        Notification notification = notificationRepository.findByIdAndOwnerId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId.toString()));
        notification.setIsRead(request.isRead());
        notification.setReadAt(request.isRead() ? LocalDateTime.now() : null);
        notification = notificationRepository.save(notification);
        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public void markAllRead() {
        String userId = SecurityUtil.getCurrentUserId();
        log.info("Marking all notifications read for user: {}", userId);
        notificationRepository.markAllAsRead(userId, LocalDateTime.now());
    }

    @Transactional
    public NotificationResponse createNotification(String ownerId, String title, String message,
                                                    com.finflow.modules.notifications.domain.NotificationType notificationType,
                                                    String referenceType, String referenceId) {
        Notification notification = new Notification(ownerId, notificationType, title, message);
        notification.setReferenceType(referenceType);
        notification.setReferenceId(referenceId);
        notification = notificationRepository.save(notification);
        log.info("Notification created: id={}, type={}, ownerId={}", notification.getId(), notificationType, ownerId);
        return notificationMapper.toResponse(notification);
    }

    @Transactional
    public void deleteNotification(UUID notificationId) {
        String userId = SecurityUtil.getCurrentUserId();
        Notification notification = notificationRepository.findByIdAndOwnerId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId.toString()));
        notificationRepository.delete(notification);
        log.info("Notification deleted: id={}, userId={}", notificationId, userId);
    }
}
