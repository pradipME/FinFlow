CREATE TABLE finflow_savings.savings_goals (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    account_id       CHAR(36)       NOT NULL,
    goal_name        VARCHAR(100)   NOT NULL,
    target_amount_cents BIGINT      NOT NULL,
    current_amount_cents BIGINT     NOT NULL DEFAULT 0,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    goal_status      VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    deadline         DATE           NULL,
    description      VARCHAR(255)   NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_savings_goal_account FOREIGN KEY (account_id) REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT
);

CREATE INDEX idx_savings_goals_owner ON finflow_savings.savings_goals (owner_id);
