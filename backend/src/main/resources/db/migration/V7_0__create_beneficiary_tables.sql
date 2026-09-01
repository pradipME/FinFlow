CREATE TABLE finflow_accounts.beneficiaries (
    id               CHAR(36)       NOT NULL,
    owner_id         CHAR(36)       NOT NULL,
    nickname         VARCHAR(100)   NULL,
    beneficiary_name VARCHAR(200)   NOT NULL,
    email            VARCHAR(254)   NULL,
    bank_name        VARCHAR(200)   NULL,
    account_number   VARCHAR(50)    NOT NULL,
    routing_number   VARCHAR(20)    NULL,
    iban             VARCHAR(50)    NULL,
    swift_code       VARCHAR(20)    NULL,
    currency         CHAR(3)        NOT NULL DEFAULT 'USD',
    beneficiary_status VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    is_deleted       BOOLEAN        NOT NULL DEFAULT FALSE,
    deleted_at       TIMESTAMP(6)    NULL,
    deleted_by       CHAR(36)       NULL,
    created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(36)    NOT NULL DEFAULT 'system',
    modified_by      VARCHAR(36)    NOT NULL DEFAULT 'system',
    version          BIGINT         NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    CONSTRAINT fk_beneficiary_owner FOREIGN KEY (owner_id)
        REFERENCES finflow_auth.users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_beneficiaries_owner ON finflow_accounts.beneficiaries (owner_id);
CREATE INDEX idx_beneficiaries_status ON finflow_accounts.beneficiaries (beneficiary_status);
CREATE UNIQUE INDEX uk_beneficiary_account ON finflow_accounts.beneficiaries (owner_id, account_number);
