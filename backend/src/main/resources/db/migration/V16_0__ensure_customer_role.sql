-- ===========================================================
-- FinFlow – Ensure the default CUSTOMER role exists
-- ===========================================================
-- This migration is safe to run on any environment (dev, test, prod).
-- It inserts the CUSTOMER role only when it does not already exist.
-- The UNIQUE constraint on the "name" column guarantees idempotency.
-- -----------------------------------------------------------
INSERT INTO finflow_auth.roles (
    id,
    name,
    description,
    is_system_role,
    is_active,
    created_at,
    updated_at,
    created_by,
    modified_by,
    version
) VALUES (
    gen_random_uuid(),
    'CUSTOMER',
    'Default role for registered banking customers',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'system',
    'system',
    0
)
ON CONFLICT (name) DO NOTHING;
