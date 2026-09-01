CREATE TABLE finflow_notifications.notifications (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    notification_type VARCHAR(50)   NOT NULL,
    title            VARCHAR(255)   NOT NULL,
    message          TEXT           NOT NULL,
    reference_type   VARCHAR(50)    NULL,
    reference_id     CHAR(36)       NULL,
    is_read          BOOLEAN        NOT NULL DEFAULT FALSE,
    read_at          TIMESTAMP(6)    NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE INDEX idx_notifications_owner ON finflow_notifications.notifications (owner_id);
CREATE INDEX idx_notifications_unread ON finflow_notifications.notifications (owner_id, is_read);
