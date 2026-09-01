-- =============================================
-- FinFlow — Auth Schema: Users, Credentials,
--           Roles, User-Roles
-- =============================================
-- Story:  AUTH-001 — User Registration
-- Author: FinFlow Engineering
-- Date:   2026-07-13
-- =============================================

-- -------------------------------------------------------
-- 1. roles  (seed data — no FK dependencies)
-- -------------------------------------------------------
CREATE TABLE finflow_auth.roles (
    id              CHAR(36)     NOT NULL,
    name            VARCHAR(50)  NOT NULL,
    description     VARCHAR(255) NULL,
    is_system_role  BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP(6) NOT NULL,
    updated_at      TIMESTAMP(6) NOT NULL,
    created_by      VARCHAR(36)  NOT NULL DEFAULT 'system',
    modified_by     VARCHAR(36)  NOT NULL DEFAULT 'system',
    version         BIGINT       NOT NULL DEFAULT 0,

    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uniq_roles_name UNIQUE (name)
);

-- Seed default roles
INSERT INTO finflow_auth.roles (id, name, description, is_system_role, is_active, created_at, updated_at, created_by, modified_by, version)
VALUES
    (gen_random_uuid(), 'CUSTOMER',    'Default role for registered banking customers',              TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0),
    (gen_random_uuid(), 'ADMIN',       'Platform administrator with full access',                    TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0),
    (gen_random_uuid(), 'SUPER_ADMIN', 'Super administrator with unrestricted access',               TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0),
    (gen_random_uuid(), 'AGENT',       'Customer support agent with limited access',                 TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0),
    (gen_random_uuid(), 'COMPLIANCE',  'Compliance officer with regulatory access',                  TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0),
    (gen_random_uuid(), 'SUPPORT',     'Support staff with read-only customer access',               TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0);

-- -------------------------------------------------------
-- 2. users  (core identity record)
-- -------------------------------------------------------
CREATE TABLE finflow_auth.users (
    id                  CHAR(36)      NOT NULL,
    email               VARCHAR(254)  NOT NULL,
    phone_number        VARCHAR(20)   NULL,
    username            VARCHAR(30)   NOT NULL,
    status              VARCHAR(25)   NOT NULL DEFAULT 'PENDING_VERIFICATION',
    email_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
    phone_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
    terms_accepted_at   TIMESTAMP(6)  NULL,
    last_login_at       TIMESTAMP(6)  NULL,
    failed_login_count  INT           NOT NULL DEFAULT 0,
    locked_until        TIMESTAMP(6)  NULL,

    -- soft-delete
    is_deleted          BOOLEAN       NOT NULL DEFAULT FALSE,
    deleted_at          TIMESTAMP(6)  NULL,
    deleted_by          VARCHAR(36)   NULL,

    -- audit
    created_at          TIMESTAMP(6)  NOT NULL,
    updated_at          TIMESTAMP(6)  NOT NULL,
    created_by          VARCHAR(36)   NOT NULL DEFAULT 'system',
    modified_by         VARCHAR(36)   NOT NULL DEFAULT 'system',
    version             BIGINT        NOT NULL DEFAULT 0,

    CONSTRAINT pk_users PRIMARY KEY (id)
);

-- Unique constraints (partial — exclude soft-deleted rows)
CREATE UNIQUE INDEX uniq_users_email    ON finflow_auth.users (email);
CREATE UNIQUE INDEX uniq_users_phone    ON finflow_auth.users (phone_number);
CREATE UNIQUE INDEX uniq_users_username ON finflow_auth.users (username);

-- Query indexes
CREATE INDEX idx_users_status    ON finflow_auth.users (status);
CREATE INDEX idx_users_created   ON finflow_auth.users (created_at);

-- -------------------------------------------------------
-- 3. user_credentials  (hashed passwords / passkeys)
-- -------------------------------------------------------
CREATE TABLE finflow_auth.user_credentials (
    id              CHAR(36)     NOT NULL,
    user_id         CHAR(36)     NOT NULL,
    credential_type VARCHAR(20)  NOT NULL DEFAULT 'PASSWORD',
    hashed_value    VARCHAR(255) NOT NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    last_used_at    TIMESTAMP(6) NULL,
    expires_at      TIMESTAMP(6) NULL,

    -- soft-delete
    is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMP(6) NULL,
    deleted_by      VARCHAR(36)  NULL,

    -- audit
    created_at      TIMESTAMP(6) NOT NULL,
    updated_at      TIMESTAMP(6) NOT NULL,
    created_by      VARCHAR(36)  NOT NULL DEFAULT 'system',
    modified_by     VARCHAR(36)  NOT NULL DEFAULT 'system',
    version         BIGINT       NOT NULL DEFAULT 0,

    CONSTRAINT pk_user_credentials PRIMARY KEY (id),
    CONSTRAINT fk_uc_user FOREIGN KEY (user_id)
        REFERENCES finflow_auth.users (id) ON DELETE RESTRICT,
    CONSTRAINT uniq_uc_user_type_active UNIQUE (user_id, credential_type, is_active)
);

CREATE INDEX idx_uc_user_id ON finflow_auth.user_credentials (user_id);

-- -------------------------------------------------------
-- 4. user_roles  (many-to-many join)
-- -------------------------------------------------------
CREATE TABLE finflow_auth.user_roles (
    id          CHAR(36)    NOT NULL,
    user_id     CHAR(36)    NOT NULL,
    role_id     CHAR(36)    NOT NULL,
    granted_at  TIMESTAMP(6) NOT NULL,
    granted_by  VARCHAR(36) NOT NULL DEFAULT 'system',
    created_at  TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version     BIGINT      NOT NULL DEFAULT 0,

    CONSTRAINT pk_user_roles PRIMARY KEY (id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id)
        REFERENCES finflow_auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id)
        REFERENCES finflow_auth.roles (id) ON DELETE RESTRICT,
    CONSTRAINT uniq_user_role UNIQUE (user_id, role_id)
);

CREATE INDEX idx_ur_user_id ON finflow_auth.user_roles (user_id);
CREATE INDEX idx_ur_role_id ON finflow_auth.user_roles (role_id);
