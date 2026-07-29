package com.finflow.modules.admin.repository;

import com.finflow.modules.admin.domain.AdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, UUID> {

    @Query("SELECT a FROM AdminAuditLog a ORDER BY a.createdAt DESC")
    Page<AdminAuditLog> findAllLogs(Pageable pageable);

    @Query("SELECT a FROM AdminAuditLog a WHERE a.adminUserId = :adminUserId ORDER BY a.createdAt DESC")
    Page<AdminAuditLog> findByAdminUserId(@Param("adminUserId") String adminUserId, Pageable pageable);

    @Query("SELECT a FROM AdminAuditLog a WHERE a.targetType = :targetType AND a.targetId = :targetId ORDER BY a.createdAt DESC")
    List<AdminAuditLog> findByTargetTypeAndTargetId(@Param("targetType") String targetType, @Param("targetId") String targetId);
}
