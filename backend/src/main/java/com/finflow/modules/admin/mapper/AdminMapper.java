package com.finflow.modules.admin.mapper;

import com.finflow.modules.admin.domain.AdminAuditLog;
import com.finflow.modules.admin.dto.AuditLogResponse;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {

    public AuditLogResponse toAuditLogResponse(AdminAuditLog log) {
        return new AuditLogResponse(
            log.getId() != null ? log.getId().toString() : null,
            log.getAdminUserId(),
            log.getAction(),
            log.getTargetType(),
            log.getTargetId(),
            log.getDetails(),
            log.getIpAddress(),
            log.getCreatedAt() != null ? log.getCreatedAt().toString() : null
        );
    }
}
