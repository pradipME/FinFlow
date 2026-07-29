package com.finflow.modules.notifications.repository;

import com.finflow.modules.notifications.domain.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("SELECT n FROM Notification n WHERE n.ownerId = :ownerId ORDER BY n.createdAt DESC")
    Page<Notification> findByOwnerId(@Param("ownerId") String ownerId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.id = :id AND n.ownerId = :ownerId")
    Optional<Notification> findByIdAndOwnerId(@Param("id") UUID id, @Param("ownerId") String ownerId);

    long countByOwnerIdAndIsReadFalse(String ownerId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.ownerId = :ownerId AND n.isRead = false")
    void markAllAsRead(@Param("ownerId") String ownerId, @Param("readAt") LocalDateTime readAt);
}
