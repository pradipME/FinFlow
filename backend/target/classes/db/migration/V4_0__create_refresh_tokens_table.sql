-- =============================================
-- FinFlow — Refresh Token Infrastructure
-- =============================================
-- Stores persistent refresh token records for session management,
-- token rotation, reuse detection, and security audit.
--
-- DESIGN:
--   - refresh_token_hash: SHA-256 of the raw token (never stored raw)
--   - session_id: UUID linking the record to Redis session cache
--   - revoked: Soft revocation flag (never delete rows)
--   - family_id: Links rotated tokens for reuse detection
--
-- SECURITY:
--   - Indexes support fast lookup by token hash and user
--   - Soft-delete via revoked flag preserves audit trail
--   - family_id enables detection of token reuse after rotation
--
-- SCHEMA:
--   - Table and FK live in finflow_auth (matching the RefreshToken
--     entity mapping `@Table(name = "refresh_tokens", catalog = "finflow_auth")`).
--     PostgreSQL requires schema-qualified references so the table
--     is never accidentally created in the public schema.
-- =============================================

CREATE TABLE IF NOT EXISTS finflow_auth.refresh_tokens (
    id                  CHAR(36)        NOT NULL,
    user_id             CHAR(36)        NOT NULL,
    session_id          CHAR(36)        NOT NULL,
    family_id           CHAR(36)        NOT NULL,
    refresh_token_hash  VARCHAR(64)     NOT NULL,
    is_revoked          BOOLEAN         NOT NULL DEFAULT FALSE,
    revoked_at          TIMESTAMP(6)     NULL,
    created_at          TIMESTAMP(6)     NOT NULL,
    expires_at          TIMESTAMP(6)     NOT NULL,
    created_ip          VARCHAR(45)     NULL,
    created_user_agent  VARCHAR(500)    NULL,
    last_used_at        TIMESTAMP(6)     NULL,
    last_used_ip        VARCHAR(45)     NULL,
    updated_at          TIMESTAMP(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             BIGINT          NOT NULL DEFAULT 0,

    PRIMARY KEY (id),

    -- Foreign key to auth users table
    CONSTRAINT fk_rt_user
        FOREIGN KEY (user_id) REFERENCES finflow_auth.users(id)
        ON DELETE CASCADE
);

-- Fast lookup by token hash (authentication)
CREATE INDEX idx_rt_token_hash ON finflow_auth.refresh_tokens (refresh_token_hash);

-- Lookup all active tokens for a user (session management)
CREATE INDEX idx_rt_user_active ON finflow_auth.refresh_tokens (user_id, is_revoked, expires_at);

-- Lookup by session ID (Redis miss recovery)
CREATE INDEX idx_rt_session ON finflow_auth.refresh_tokens (session_id);

-- Reuse detection: find all tokens in a family
CREATE INDEX idx_rt_family ON finflow_auth.refresh_tokens (family_id, is_revoked);

-- Cleanup: find expired tokens
CREATE INDEX idx_rt_expires ON finflow_auth.refresh_tokens (expires_at, is_revoked);