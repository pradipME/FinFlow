-- =============================================
-- FinFlow -- Normalize CHAR(n) columns to VARCHAR(n)
-- =============================================
--
-- Why: The JPA layer maps every identifier (UUID with
-- `@JdbcTypeCode(SqlTypes.VARCHAR)` in BaseEntity) and every plain String
-- column to VARCHAR(n) under Hibernate 6. However, the original V1..V14
-- migrations declared these columns as PostgreSQL `CHAR(n)`/`bpchar(n)`,
-- which Hibernate's `ddl-auto: validate` reports as a mismatch
-- (`found [bpchar (Types#CHAR)], but expecting [varchar(36) (Types#VARCHAR)]`).
--
-- PostgreSQL does NOT actually need blank-padded fixed-length storage for
-- 36-char UUID strings, 3-char currency codes, etc. Both types hold identical
-- values, and bpchar -> varchaR is a binary-coercible cast, so this is a safe,
-- non-destructive online migration.
--
-- This migration may run any number of times (idempotent ALTER COLUMN).
-- =============================================

ALTER TABLE finflow_auth.roles            ALTER COLUMN id           TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_auth.users            ALTER COLUMN id           TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_auth.user_credentials ALTER COLUMN id           TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_auth.user_credentials ALTER COLUMN user_id      TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_auth.user_roles       ALTER COLUMN id           TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_auth.user_roles       ALTER COLUMN user_id      TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_auth.user_roles       ALTER COLUMN role_id      TYPE VARCHAR(36) USING role_id::varchar(36);

ALTER TABLE finflow_auth.login_history    ALTER COLUMN user_id      TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_auth.audit_log        ALTER COLUMN aggregate_id TYPE VARCHAR(36) USING aggregate_id::varchar(36);

ALTER TABLE finflow_auth.refresh_tokens   ALTER COLUMN id           TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_auth.refresh_tokens   ALTER COLUMN user_id      TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_auth.refresh_tokens   ALTER COLUMN session_id   TYPE VARCHAR(36) USING session_id::varchar(36);
ALTER TABLE finflow_auth.refresh_tokens   ALTER COLUMN family_id    TYPE VARCHAR(36) USING family_id::varchar(36);

ALTER TABLE finflow_accounts.accounts                     ALTER COLUMN id         TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_accounts.accounts                     ALTER COLUMN owner_id   TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_accounts.account_holders              ALTER COLUMN id         TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_accounts.account_holders              ALTER COLUMN account_id TYPE VARCHAR(36) USING account_id::varchar(36);
ALTER TABLE finflow_accounts.account_holders              ALTER COLUMN user_id    TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_accounts.account_status_history       ALTER COLUMN account_id TYPE VARCHAR(36) USING account_id::varchar(36);
ALTER TABLE finflow_accounts.holds                        ALTER COLUMN id         TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_accounts.holds                        ALTER COLUMN account_id TYPE VARCHAR(36) USING account_id::varchar(36);

ALTER TABLE finflow_transactions.transactions           ALTER COLUMN id               TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_transactions.transactions           ALTER COLUMN currency         TYPE VARCHAR(3)  USING currency::varchar(3);
ALTER TABLE finflow_transactions.transactions           ALTER COLUMN source_account_id TYPE VARCHAR(36) USING source_account_id::varchar(36);
ALTER TABLE finflow_transactions.transactions           ALTER COLUMN target_account_id TYPE VARCHAR(36) USING target_account_id::varchar(36);
ALTER TABLE finflow_transactions.transactions           ALTER COLUMN user_id          TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_transactions.transaction_entries    ALTER COLUMN id               TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_transactions.transaction_entries    ALTER COLUMN transaction_id   TYPE VARCHAR(36) USING transaction_id::varchar(36);
ALTER TABLE finflow_transactions.transaction_entries    ALTER COLUMN account_id       TYPE VARCHAR(36) USING account_id::varchar(36);
ALTER TABLE finflow_transactions.transaction_entries    ALTER COLUMN currency         TYPE VARCHAR(3)  USING currency::varchar(3);

ALTER TABLE finflow_accounts.beneficiaries ALTER COLUMN id       TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_accounts.beneficiaries ALTER COLUMN owner_id TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_accounts.beneficiaries ALTER COLUMN currency TYPE VARCHAR(3)  USING currency::varchar(3);
ALTER TABLE finflow_accounts.beneficiaries ALTER COLUMN deleted_by TYPE VARCHAR(36) USING deleted_by::varchar(36);

ALTER TABLE finflow_transfers.transfer_templates    ALTER COLUMN id                  TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_transfers.transfer_templates    ALTER COLUMN owner_id            TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_transfers.transfer_templates    ALTER COLUMN source_account_id   TYPE VARCHAR(36) USING source_account_id::varchar(36);
ALTER TABLE finflow_transfers.transfer_templates    ALTER COLUMN target_account_id   TYPE VARCHAR(36) USING target_account_id::varchar(36);
ALTER TABLE finflow_transfers.transfer_templates    ALTER COLUMN target_beneficiary_id TYPE VARCHAR(36) USING target_beneficiary_id::varchar(36);
ALTER TABLE finflow_transfers.transfer_templates    ALTER COLUMN currency            TYPE VARCHAR(3)  USING currency::varchar(3);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN id                  TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN owner_id            TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN template_id         TYPE VARCHAR(36) USING template_id::varchar(36);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN source_account_id   TYPE VARCHAR(36) USING source_account_id::varchar(36);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN target_account_id   TYPE VARCHAR(36) USING target_account_id::varchar(36);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN target_beneficiary_id TYPE VARCHAR(36) USING target_beneficiary_id::varchar(36);
ALTER TABLE finflow_transfers.scheduled_transfers   ALTER COLUMN currency            TYPE VARCHAR(3)  USING currency::varchar(3);

ALTER TABLE finflow_accounts.cards              ALTER COLUMN id              TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_accounts.cards              ALTER COLUMN owner_id        TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_accounts.cards              ALTER COLUMN account_id      TYPE VARCHAR(36) USING account_id::varchar(36);
ALTER TABLE finflow_accounts.cards              ALTER COLUMN card_last_four  TYPE VARCHAR(4)  USING card_last_four::varchar(4);
ALTER TABLE finflow_accounts.cards              ALTER COLUMN currency        TYPE VARCHAR(3)  USING currency::varchar(3);
ALTER TABLE finflow_accounts.card_transactions ALTER COLUMN id              TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_accounts.card_transactions ALTER COLUMN card_id         TYPE VARCHAR(36) USING card_id::varchar(36);
ALTER TABLE finflow_accounts.card_transactions ALTER COLUMN currency        TYPE VARCHAR(3)  USING currency::varchar(3);

ALTER TABLE finflow_savings.savings_goals       ALTER COLUMN id         TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_savings.savings_goals       ALTER COLUMN owner_id   TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_savings.savings_goals       ALTER COLUMN account_id TYPE VARCHAR(36) USING account_id::varchar(36);
ALTER TABLE finflow_savings.savings_goals       ALTER COLUMN currency   TYPE VARCHAR(3)  USING currency::varchar(3);

ALTER TABLE finflow_notifications.notifications ALTER COLUMN id           TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_notifications.notifications ALTER COLUMN owner_id     TYPE VARCHAR(36) USING owner_id::varchar(36);
ALTER TABLE finflow_notifications.notifications ALTER COLUMN reference_id TYPE VARCHAR(36) USING reference_id::varchar(36);

ALTER TABLE finflow_profiles.user_profiles  ALTER COLUMN id       TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_profiles.user_profiles  ALTER COLUMN user_id  TYPE VARCHAR(36) USING user_id::varchar(36);
ALTER TABLE finflow_profiles.user_profiles  ALTER COLUMN country  TYPE VARCHAR(2)  USING country::varchar(2);

ALTER TABLE finflow_settings.user_settings  ALTER COLUMN id       TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_settings.user_settings  ALTER COLUMN user_id  TYPE VARCHAR(36) USING user_id::varchar(36);

ALTER TABLE finflow_admin.admin_audit_log   ALTER COLUMN id            TYPE VARCHAR(36) USING id::varchar(36);
ALTER TABLE finflow_admin.admin_audit_log   ALTER COLUMN admin_user_id TYPE VARCHAR(36) USING admin_user_id::varchar(36);
ALTER TABLE finflow_admin.admin_audit_log   ALTER COLUMN target_id     TYPE VARCHAR(36) USING target_id::varchar(36);
