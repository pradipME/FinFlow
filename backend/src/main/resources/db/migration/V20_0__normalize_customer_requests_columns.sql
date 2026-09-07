-- =============================================
-- FinFlow -- Normalize customer_requests CHAR(36) columns to VARCHAR(36)
-- =============================================
--
-- Why: finflow_admin.customer_requests was created by V18, which ran AFTER the
-- V15 CHAR→VARCHAR normalization pass, so its columns were never converted.
-- Under the production profile Hibernate's `ddl-auto: validate` maps the `id`
-- column (UUID + `@JdbcTypeCode(SqlTypes.VARCHAR)` in BaseEntity) and every
-- plain `String` column to VARCHAR(36). The CHAR(36)/bpchar columns therefore
-- fail startup validation, e.g.:
--
--   Schema-validation: wrong column type encountered in column [id]
--   in table [finflow_admin.customer_requests];
--   found [bpchar (Types#CHAR)], but expecting [char(36) (Types#VARCHAR)].
--
-- This uses the same binary-coercible, non-destructive approach as V15:
-- bpchar -> varchar is safe for the 36-char UUID values already stored, so
-- existing customer_requests data is fully preserved.
--
-- Idempotent: ALTER COLUMN TYPE may run any number of times.
-- =============================================

ALTER TABLE finflow_admin.customer_requests ALTER COLUMN id                TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_admin.customer_requests ALTER COLUMN customer_id       TYPE VARCHAR(36) USING customer_id::varchar(36);
ALTER TABLE finflow_admin.customer_requests ALTER COLUMN target_account_id TYPE VARCHAR(36) USING target_account_id::varchar(36);
ALTER TABLE finflow_admin.customer_requests ALTER COLUMN reviewed_by       TYPE VARCHAR(36) USING reviewed_by::varchar(36);