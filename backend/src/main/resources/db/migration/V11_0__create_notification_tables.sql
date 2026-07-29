CREATE TABLE finflow_notifications.notifications (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    notification_type VARCHAR(50)   NOT NULL,
    title            VARCHAR(255)   NOT NULL,
    message          TEXT           NOT NULL,
    reference_type   VARCHAR(50)    NULL,
    reference_id     CHAR(36)       NULL,
    is_read          BOOLEAN        NOT NULL DEFAULT FALSE,
    read_at          DATETIME(6)    NULL,
    created_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    INDEX idx_notifications_owner (owner_id),
    INDEX idx_notifications_unread (owner_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
