-- ===========================================================
-- FinFlow – Customer requests (account / card workflows)
-- ===========================================================
-- Minimal request model enabling the bank-style ADMIN → CUSTOMER
-- workflow. Customers submit a request; an ADMIN reviews and
-- approves/rejects it. On approval, the platform creates the
-- underlying resource (bank account or card).
-- -----------------------------------------------------------

CREATE TABLE finflow_admin.customer_requests (
    id                  CHAR(36)    NOT NULL,
    customer_id         CHAR(36)    NOT NULL,
    request_type        VARCHAR(30) NOT NULL,
    request_status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    target_account_id   CHAR(36)    NULL,
    details             TEXT        NULL,
    reviewed_by         CHAR(36)    NULL,
    reviewed_at         TIMESTAMP(6) NULL,
    rejection_reason    VARCHAR(500) NULL,

    created_at          TIMESTAMP(6) NOT NULL,
    updated_at          TIMESTAMP(6) NOT NULL,
    created_by          VARCHAR(36)  NOT NULL DEFAULT 'system',
    modified_by         VARCHAR(36)  NOT NULL DEFAULT 'system',
    version             BIGINT       NOT NULL DEFAULT 0,

    CONSTRAINT pk_customer_requests PRIMARY KEY (id),
    CONSTRAINT chk_requests_type   CHECK (request_type IN ('ACCOUNT_REQUEST','CARD_REQUEST')),
    CONSTRAINT chk_requests_status CHECK (request_status IN ('PENDING','APPROVED','REJECTED'))
);

CREATE INDEX idx_requests_customer   ON finflow_admin.customer_requests (customer_id);
CREATE INDEX idx_requests_status     ON finflow_admin.customer_requests (request_status);
CREATE INDEX idx_requests_created    ON finflow_admin.customer_requests (created_at);