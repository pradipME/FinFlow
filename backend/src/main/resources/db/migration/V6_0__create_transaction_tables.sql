CREATE TABLE finflow_transactions.transactions (
    id               CHAR(36)       NOT NULL,
    transaction_type VARCHAR(25)    NOT NULL,
    transaction_status VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    description      VARCHAR(255)   NULL,
    reference_number VARCHAR(50)    NULL UNIQUE,
    idempotency_key  VARCHAR(100)   NULL UNIQUE,
    amount_cents     BIGINT         NOT NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    source_account_id  CHAR(36)     NULL,
    target_account_id  CHAR(36)     NULL,
    fee_amount_cents   BIGINT       NOT NULL DEFAULT 0,
    user_id          CHAR(36)       NOT NULL,
    completed_at     TIMESTAMP(6)    NULL,
    failed_reason    VARCHAR(500)   NULL,
    metadata_json    TEXT           NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    CONSTRAINT fk_txn_source_account FOREIGN KEY (source_account_id)
        REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_txn_target_account FOREIGN KEY (target_account_id)
        REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT
);

CREATE INDEX idx_transactions_user_id ON finflow_transactions.transactions (user_id);
CREATE INDEX idx_transactions_source_account ON finflow_transactions.transactions (source_account_id);
CREATE INDEX idx_transactions_target_account ON finflow_transactions.transactions (target_account_id);
CREATE INDEX idx_transactions_status ON finflow_transactions.transactions (transaction_status);
CREATE INDEX idx_transactions_type ON finflow_transactions.transactions (transaction_type);
CREATE INDEX idx_transactions_created_at ON finflow_transactions.transactions (created_at);

CREATE TABLE finflow_transactions.transaction_entries (
    id               CHAR(36)       NOT NULL,
    transaction_id   CHAR(36)       NOT NULL,
    account_id       CHAR(36)       NOT NULL,
    entry_type       VARCHAR(10)    NOT NULL,
    amount_cents     BIGINT         NOT NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    balance_before_cents BIGINT     NOT NULL DEFAULT 0,
    balance_after_cents  BIGINT     NOT NULL DEFAULT 0,
    description      VARCHAR(255)   NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    CONSTRAINT fk_txn_entry_transaction FOREIGN KEY (transaction_id)
        REFERENCES finflow_transactions.transactions(id) ON DELETE RESTRICT,
    CONSTRAINT fk_txn_entry_account FOREIGN KEY (account_id)
        REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT
);

CREATE INDEX idx_txn_entries_transaction ON finflow_transactions.transaction_entries (transaction_id);
CREATE INDEX idx_txn_entries_account ON finflow_transactions.transaction_entries (account_id);
