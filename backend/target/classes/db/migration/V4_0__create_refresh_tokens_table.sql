-- =============================================
-- FinFlow — Refresh Token Infrastructure
-- =============================================
-- Stores persistent refresh token records for session management,
-- token rotation, reuse detection, and security audit.
--
-- DESIGN:
--   - refresh_token_hash: SHA-256 of the raw token (never stored raw)
--   - session_id: UUID linking MySQL record to Redis session cache
--   - revoked: Soft revocation flag (never delete rows)
--   - family_id: Links rotated tokens for reuse detection
--
-- SECURITY:
--   - Indexes support fast lookup by token hash and user
--   - Soft-delete via revoked flag preserves audit trail
--   - family_id enables detection of token reuse after rotation
-- =============================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id                  CHAR(36)        NOT NULL,
    user_id             CHAR(36)        NOT NULL,
    session_id          CHAR(36)        NOT NULL,
    family_id           CHAR(36)        NOT NULL,
    refresh_token_hash  VARCHAR(64)     NOT NULL COMMENT 'SHA-256 hex of raw refresh token',
    is_revoked          BOOLEAN         NOT NULL DEFAULT FALSE,
    revoked_at          DATETIME(6)     NULL,
    created_at          DATETIME(6)     NOT NULL,
    expires_at          DATETIME(6)     NOT NULL,
    created_ip          VARCHAR(45)     NULL COMMENT 'Client IP at token creation',
    created_user_agent  VARCHAR(500)    NULL COMMENT 'User-Agent at token creation',
    last_used_at        DATETIME(6)     NULL COMMENT 'Last time this token was used for refresh',
    last_used_ip        VARCHAR(45)     NULL COMMENT 'IP of last refresh request',
    updated_at          DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    version             BIGINT          NOT NULL DEFAULT 0,

    PRIMARY KEY (id),

    -- Fast lookup by token hash (authentication)
    INDEX idx_rt_token_hash (refresh_token_hash),

    -- Lookup all active tokens for a user (session management)
    INDEX idx_rt_user_active (user_id, is_revoked, expires_at),

    -- Lookup by session ID (Redis miss recovery)
    INDEX idx_rt_session (session_id),

    -- Reuse detection: find all tokens in a family
    INDEX idx_rt_family (family_id, is_revoked),

    -- Cleanup: find expired tokens
    INDEX idx_rt_expires (expires_at, is_revoked),

    -- Foreign key to users table
    CONSTRAINT fk_rt_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Refresh token sessions with rotation and reuse detection support';
