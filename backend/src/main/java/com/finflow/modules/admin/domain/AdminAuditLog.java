package com.finflow.modules.admin.domain;

import com.finflow.shared.domain.BaseAuditableEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "admin_audit_log", catalog = "finflow_admin")
public class AdminAuditLog extends BaseAuditableEntity {

    @Column(name = "admin_user_id", nullable = false, length = 36)
    private String adminUserId;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;

    @Column(name = "target_id", nullable = false, length = 36)
    private String targetId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    protected AdminAuditLog() {}

    public AdminAuditLog(String adminUserId, String action, String targetType, String targetId, String details, String ipAddress) {
        this.adminUserId = adminUserId;
        this.action = action;
        this.targetType = targetType;
        this.targetId = targetId;
        this.details = details;
        this.ipAddress = ipAddress;
    }

    public String getAdminUserId() { return adminUserId; }
    public String getAction() { return action; }
    public String getTargetType() { return targetType; }
    public String getTargetId() { return targetId; }
    public String getDetails() { return details; }
    public String getIpAddress() { return ipAddress; }
}
