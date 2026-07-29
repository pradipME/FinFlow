package com.finflow.modules.admin.service;

import com.finflow.modules.admin.domain.AdminAuditLog;
import com.finflow.modules.admin.dto.AdminDashboardResponse;
import com.finflow.modules.admin.dto.AuditLogResponse;
import com.finflow.modules.admin.dto.UserManagementResponse;
import com.finflow.modules.admin.mapper.AdminMapper;
import com.finflow.modules.admin.repository.AdminAuditLogRepository;
import com.finflow.shared.dto.PageResponse;
import com.finflow.shared.exception.BusinessRuleException;
import com.finflow.shared.util.SecurityUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    private final AdminAuditLogRepository auditLogRepository;
    private final AdminMapper adminMapper;

    public AdminService(AdminAuditLogRepository auditLogRepository, AdminMapper adminMapper) {
        this.auditLogRepository = auditLogRepository;
        this.adminMapper = adminMapper;
    }

    private void requireAdmin() {
        if (!SecurityUtil.isAdmin() && !SecurityUtil.isSuperAdmin()) {
            throw new BusinessRuleException("FORBIDDEN", "Admin access required");
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> getAuditLogs(Pageable pageable) {
        requireAdmin();
        Page<AdminAuditLog> page = auditLogRepository.findAllLogs(pageable);
        return PageResponse.of(
            page.getContent().stream().map(adminMapper::toAuditLogResponse).toList(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements()
        );
    }

    public AuditLogResponse logAction(String adminUserId, String action, String targetType, String targetId, String details) {
        AdminAuditLog log = new AdminAuditLog(adminUserId, action, targetType, targetId, details, null);
        return adminMapper.toAuditLogResponse(auditLogRepository.save(log));
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        requireAdmin();
        return new AdminDashboardResponse(0L, 0L, 0L, 0);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserManagementResponse> getUserList(Pageable pageable) {
        requireAdmin();
        return PageResponse.of(java.util.List.of(), pageable.getPageNumber(), pageable.getPageSize(), 0L);
    }
}
