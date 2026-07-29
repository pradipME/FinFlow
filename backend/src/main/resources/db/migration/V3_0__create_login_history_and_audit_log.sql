-- =============================================
-- FinFlow — Auth Schema: Login History,
--           Audit Log
-- =============================================
-- Story:  AUTH-003 — Login
-- Author: FinFlow Engineering
-- Date:   2026-07-13
-- =============================================
-- Depends on: V1_0__create_auth_tables.sql
-- =============================================

-- -------------------------------------------------------
-- 1. login_history  (every authentication attempt)
-- -------------------------------------------------------
-- Records every login attempt — success or failure.
-- Required for:
--   - Security monitoring and brute-force detection
--   - Forensic investigation of unauthorized access
--   - Compliance audit trails (PCI-DSS, SOC2)
--   - User-visible login history in account settings
--
-- user_id is nullable because attempts for non-existent
-- emails must still be logged (for rate-limiting and
-- detection), but there is no FK to reference.
-- -------------------------------------------------------
CREATE TABLE finflow_auth.login_history (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    user_id         CHAR(36)      NULL,
    identifier      VARCHAR(254)  NOT NULL,
    success         BOOLEAN       NOT NULL DEFAULT FALSE,
    failure_reason  VARCHAR(50)   NULL,
    ip_address      VARCHAR(45)   NULL,
    user_agent      VARCHAR(500)  NULL,

    -- audit
    created_at      DATETIME(6)   NOT NULL,

    CONSTRAINT pk_login_history PRIMARY KEY (id),
    CONSTRAINT fk_lh_user FOREIGN KEY (user_id)
        REFERENCES finflow_auth.users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Look up recent attempts for a specific user
CREATE INDEX idx_lh_user_id ON finflow_auth.login_history (user_id);

-- Look up attempts by submitted email/username (brute-force detection)
CREATE INDEX idx_lh_identifier ON finflow_auth.login_history (identifier);

-- Time-range queries (security dashboards, retention cleanup)
CREATE INDEX idx_lh_created_at ON finflow_auth.login_history (created_at);

-- Composite: find failed attempts for a user in time order
CREATE INDEX idx_lh_user_failure ON finflow_auth.login_history (user_id, success, created_at);


-- -------------------------------------------------------
-- 2. audit_log  (immutable event trail)
-- -------------------------------------------------------
-- Append-only audit log for compliance and forensics.
-- Each row represents a single auditable event.
-- event_data is JSON for flexible, schema-less payloads.
--
-- Unlike login_history (which tracks raw HTTP attempts),
-- audit_log tracks business-meaningful events with actor
-- context and structured data.
-- -------------------------------------------------------
CREATE TABLE finflow_auth.audit_log (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    event_type      VARCHAR(50)   NOT NULL,
    aggregate_id    CHAR(36)      NOT NULL,
    aggregate_type  VARCHAR(50)   NOT NULL DEFAULT 'USER',
    actor_id        VARCHAR(36)   NOT NULL,
    event_data      JSON          NULL,
    ip_address      VARCHAR(45)   NULL,
    user_agent      VARCHAR(500)  NULL,

    -- audit
    created_at      DATETIME(6)   NOT NULL,

    CONSTRAINT pk_audit_log PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Look up all events for a specific entity (e.g., all activity for user X)
CREATE INDEX idx_audit_aggregate ON finflow_auth.audit_log (aggregate_id);

-- Filter by event type (e.g., all LOGIN_FAILED events in the last 24h)
CREATE INDEX idx_audit_event ON finflow_auth.audit_log (event_type);

-- Time-range queries (retention cleanup, dashboards)
CREATE INDEX idx_audit_created ON finflow_auth.audit_log (created_at);

-- Composite: most common query pattern — events for a user, newest first
CREATE INDEX idx_audit_aggregate_created ON finflow_auth.audit_log (aggregate_id, created_at);
