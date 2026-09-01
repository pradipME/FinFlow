CREATE TABLE finflow_admin.admin_audit_log (
    id               CHAR(36)       NOT NULL,
    admin_user_id    CHAR(36)       NOT NULL,
    action           VARCHAR(100)   NOT NULL,
    target_type      VARCHAR(50)    NOT NULL,
    target_id        CHAR(36)       NOT NULL,
    details          TEXT           NULL,
    ip_address       VARCHAR(45)    NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE INDEX idx_audit_admin ON finflow_admin.admin_audit_log (admin_user_id);
CREATE INDEX idx_audit_target ON finflow_admin.admin_audit_log (target_type, target_id);
