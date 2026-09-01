CREATE TABLE finflow_settings.user_settings (
    id               CHAR(36)       NOT NULL,
    user_id          CHAR(36)       NOT NULL,
    setting_key      VARCHAR(100)   NOT NULL,
    setting_value    TEXT           NOT NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_settings_user_key ON finflow_settings.user_settings (user_id, setting_key);
