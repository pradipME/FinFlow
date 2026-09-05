-- Make phone_number mandatory for all active (non-deleted) customer records.
-- Existing NULL phone numbers receive a safe placeholder so the NOT NULL
-- constraint can be applied without breaking rows.

UPDATE finflow_auth.users u
SET phone_number = '+000' || LPAD(s.rn::TEXT, 10, '0')
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
    FROM finflow_auth.users
    WHERE phone_number IS NULL AND is_deleted = false
) s
WHERE u.id = s.id;

ALTER TABLE finflow_auth.users
    ALTER COLUMN phone_number SET NOT NULL;
