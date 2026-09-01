-- =============================================
-- FinFlow — Profiles Schema: User Profiles
-- =============================================

CREATE TABLE IF NOT EXISTS finflow_profiles.user_profiles (
    id               CHAR(36)       NOT NULL,
    user_id          CHAR(36)       NOT NULL,
    first_name       VARCHAR(100)   NULL,
    last_name        VARCHAR(100)   NULL,
    date_of_birth    DATE           NULL,
    address_line1    VARCHAR(255)   NULL,
    address_line2    VARCHAR(255)   NULL,
    city             VARCHAR(100)   NULL,
    state            VARCHAR(100)   NULL,
    postal_code      VARCHAR(20)    NULL,
    country          CHAR(2)        NULL,
    avatar_url       VARCHAR(500)   NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_profile_user ON finflow_profiles.user_profiles (user_id);
