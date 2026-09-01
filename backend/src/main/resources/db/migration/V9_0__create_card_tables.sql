CREATE TABLE finflow_accounts.cards (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    account_id       CHAR(36)       NOT NULL,
    card_number_hash VARCHAR(255)   NOT NULL,
    card_last_four   CHAR(4)        NOT NULL,
    card_type        VARCHAR(20)    NOT NULL,
    card_status      VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    cardholder_name  VARCHAR(200)   NOT NULL,
    expiry_month     INT            NOT NULL,
    expiry_year      INT            NOT NULL,
    credit_limit_cents BIGINT       NULL,
    daily_limit_cents  BIGINT       NULL,
    monthly_limit_cents BIGINT      NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    pin_set          BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_card_account FOREIGN KEY (account_id) REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT
);

CREATE INDEX idx_cards_owner ON finflow_accounts.cards (owner_id);
CREATE INDEX idx_cards_account ON finflow_accounts.cards (account_id);
CREATE INDEX idx_cards_last_four ON finflow_accounts.cards (card_last_four);

CREATE TABLE finflow_accounts.card_transactions (
    id               CHAR(36)       NOT NULL,
    card_id          CHAR(36)       NOT NULL,
    transaction_type VARCHAR(20)    NOT NULL,
    amount_cents     BIGINT         NOT NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    merchant_name    VARCHAR(200)   NULL,
    merchant_category VARCHAR(50)   NULL,
    status           VARCHAR(20)    NOT NULL,
    authorization_code VARCHAR(20)  NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_card_txn_card FOREIGN KEY (card_id) REFERENCES finflow_accounts.cards(id) ON DELETE RESTRICT
);

CREATE INDEX idx_card_txn_card ON finflow_accounts.card_transactions (card_id);
