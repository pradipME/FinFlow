-- =============================================
-- FinFlow — Schema Bootstrap
-- =============================================
-- Creates all business schemas used by migration scripts.
-- Each supported feature domain maps to its own schema
-- (mirroring the original database-per-domain approach).
--
-- NOTE: PostgreSQL requires schemas to exist before tables
-- can be created within them. This migration runs before all
-- others (version 0.999) so that V1+ can safely reference
-- fully-qualified schema.table names.
--
-- Requires: PostgreSQL 13+ (uses CREATE SCHEMA IF NOT EXISTS)
-- =============================================

CREATE SCHEMA IF NOT EXISTS finflow_auth;
CREATE SCHEMA IF NOT EXISTS finflow_accounts;
CREATE SCHEMA IF NOT EXISTS finflow_transactions;
CREATE SCHEMA IF NOT EXISTS finflow_transfers;
CREATE SCHEMA IF NOT EXISTS finflow_savings;
CREATE SCHEMA IF NOT EXISTS finflow_notifications;
CREATE SCHEMA IF NOT EXISTS finflow_profiles;
CREATE SCHEMA IF NOT EXISTS finflow_admin;
CREATE SCHEMA IF NOT EXISTS finflow_settings;
