CREATE TABLE finflow_transfers.transfer_templates (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    template_name    VARCHAR(100)   NOT NULL,
    source_account_id CHAR(36)      NOT NULL,
    target_account_id CHAR(36)      NULL,
    target_beneficiary_id CHAR(36)  NULL,
    amount_cents     BIGINT         NOT NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    description      VARCHAR(255)   NULL,
    template_status  VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_template_source FOREIGN KEY (source_account_id) REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_template_beneficiary FOREIGN KEY (target_beneficiary_id) REFERENCES finflow_accounts.beneficiaries(id) ON DELETE SET NULL
);

CREATE INDEX idx_transfer_templates_owner ON finflow_transfers.transfer_templates (owner_id);

CREATE TABLE finflow_transfers.scheduled_transfers (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    template_id      CHAR(36)       NULL,
    source_account_id CHAR(36)      NOT NULL,
    target_account_id CHAR(36)      NULL,
    target_beneficiary_id CHAR(36)  NULL,
    amount_cents     BIGINT         NOT NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    description      VARCHAR(255)   NULL,
    schedule_type    VARCHAR(20)    NOT NULL,
    frequency        VARCHAR(20)    NULL,
    next_execution   TIMESTAMP(6)    NOT NULL,
    last_execution   TIMESTAMP(6)    NULL,
    end_date         TIMESTAMP(6)    NULL,
    execution_count  INT            NOT NULL DEFAULT 0,
    max_executions   INT            NULL,
    schedule_status  VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_scheduled_source FOREIGN KEY (source_account_id) REFERENCES finflow_accounts.accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_scheduled_beneficiary FOREIGN KEY (target_beneficiary_id) REFERENCES finflow_accounts.beneficiaries(id) ON DELETE SET NULL,
    CONSTRAINT fk_scheduled_template FOREIGN KEY (template_id) REFERENCES finflow_transfers.transfer_templates(id) ON DELETE SET NULL
);

CREATE INDEX idx_scheduled_transfers_owner ON finflow_transfers.scheduled_transfers (owner_id);
CREATE INDEX idx_scheduled_transfers_next ON finflow_transfers.scheduled_transfers (next_execution);
CREATE INDEX idx_scheduled_transfers_status ON finflow_transfers.scheduled_transfers (schedule_status);
