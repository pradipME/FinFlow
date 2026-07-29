-- =============================================
-- FinFlow — Accounts Schema: Accounts,
--           Account Holders, Status History, Holds
-- =============================================

CREATE TABLE IF NOT EXISTS finflow_accounts.accounts (
    id                    CHAR(36)     NOT NULL,
    owner_id              CHAR(36)     NOT NULL,
    account_number        VARCHAR(20)  NOT NULL,
    account_type          VARCHAR(20)  NOT NULL,
    account_status        VARCHAR(25)  NOT NULL DEFAULT 'PENDING',
    nickname              VARCHAR(100) NULL,
    currency              VARCHAR(3)   NOT NULL DEFAULT 'USD',
    ledger_balance_cents  BIGINT       NOT NULL DEFAULT 0,
    available_balance_cents BIGINT     NOT NULL DEFAULT 0,
    is_deleted            BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted_at            DATETIME(6)  NULL,
    deleted_by            VARCHAR(36)  NULL,
    created_at            DATETIME(6)  NOT NULL,
    updated_at            DATETIME(6)  NOT NULL,
    created_by            VARCHAR(36)  NOT NULL DEFAULT 'system',
    modified_by           VARCHAR(36)  NOT NULL DEFAULT 'system',
    version               BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT pk_accounts PRIMARY KEY (id),
    CONSTRAINT fk_accounts_owner FOREIGN KEY (owner_id)
        REFERENCES finflow_auth.users (id) ON DELETE RESTRICT,
    CONSTRAINT uniq_accounts_number UNIQUE (account_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_accounts_owner     ON finflow_accounts.accounts (owner_id);
CREATE INDEX idx_accounts_status    ON finflow_accounts.accounts (account_status);
CREATE INDEX idx_accounts_type      ON finflow_accounts.accounts (account_type);
CREATE INDEX idx_accounts_created   ON finflow_accounts.accounts (created_at);

CREATE TABLE IF NOT EXISTS finflow_accounts.account_holders (
    id              CHAR(36)    NOT NULL,
    account_id      CHAR(36)    NOT NULL,
    user_id         CHAR(36)    NOT NULL,
    ownership_type  VARCHAR(20) NOT NULL DEFAULT 'PRIMARY',
    created_at      DATETIME(6) NOT NULL,
    updated_at      DATETIME(6) NOT NULL,
    created_by      VARCHAR(36) NOT NULL DEFAULT 'system',
    modified_by     VARCHAR(36) NOT NULL DEFAULT 'system',
    version         BIGINT      NOT NULL DEFAULT 0,
    CONSTRAINT pk_account_holders PRIMARY KEY (id),
    CONSTRAINT fk_ah_account FOREIGN KEY (account_id)
        REFERENCES finflow_accounts.accounts (id) ON DELETE RESTRICT,
    CONSTRAINT fk_ah_user FOREIGN KEY (user_id)
        REFERENCES finflow_auth.users (id) ON DELETE RESTRICT,
    CONSTRAINT uniq_ah_account_user UNIQUE (account_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ah_user    ON finflow_accounts.account_holders (user_id);
CREATE INDEX idx_ah_account ON finflow_accounts.account_holders (account_id);

CREATE TABLE IF NOT EXISTS finflow_accounts.account_status_history (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    account_id      CHAR(36)      NOT NULL,
    previous_status VARCHAR(25)   NULL,
    new_status      VARCHAR(25)   NOT NULL,
    reason          VARCHAR(500)  NULL,
    changed_by      VARCHAR(36)   NOT NULL,
    changed_at      DATETIME(6)   NOT NULL,
    CONSTRAINT pk_account_status_history PRIMARY KEY (id),
    CONSTRAINT fk_ash_account FOREIGN KEY (account_id)
        REFERENCES finflow_accounts.accounts (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ash_account    ON finflow_accounts.account_status_history (account_id);
CREATE INDEX idx_ash_changed_at ON finflow_accounts.account_status_history (changed_at);

CREATE TABLE IF NOT EXISTS finflow_accounts.holds (
    id              CHAR(36)      NOT NULL,
    account_id      CHAR(36)      NOT NULL,
    amount_cents    BIGINT        NOT NULL,
    reason          VARCHAR(500)  NOT NULL,
    source_type     VARCHAR(50)   NULL,
    source_id       VARCHAR(36)   NULL,
    hold_status     VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    released_at     DATETIME(6)   NULL,
    released_by     VARCHAR(36)   NULL,
    expires_at      DATETIME(6)   NULL,
    created_at      DATETIME(6)   NOT NULL,
    updated_at      DATETIME(6)   NOT NULL,
    created_by      VARCHAR(36)   NOT NULL DEFAULT 'system',
    modified_by     VARCHAR(36)   NOT NULL DEFAULT 'system',
    version         BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT pk_holds PRIMARY KEY (id),
    CONSTRAINT fk_holds_account FOREIGN KEY (account_id)
        REFERENCES finflow_accounts.accounts (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_holds_account ON finflow_accounts.holds (account_id);
CREATE INDEX idx_holds_status  ON finflow_accounts.holds (hold_status);
CREATE INDEX idx_holds_expires ON finflow_accounts.holds (expires_at);
