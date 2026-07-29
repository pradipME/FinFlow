CREATE TABLE finflow_admin.admin_audit_log (
    id               CHAR(36)       NOT NULL,
    admin_user_id    CHAR(36)       NOT NULL,
    action           VARCHAR(100)   NOT NULL,
    target_type      VARCHAR(50)    NOT NULL,
    target_id        CHAR(36)       NOT NULL,
    details          TEXT           NULL,
    ip_address       VARCHAR(45)    NULL,
    created_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    INDEX idx_audit_admin (admin_user_id),
    INDEX idx_audit_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
