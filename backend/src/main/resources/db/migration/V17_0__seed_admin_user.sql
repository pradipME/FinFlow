-- ===========================================================
-- FinFlow – Seed the platform ADMIN user (idempotent)
-- ===========================================================
-- Creates the default administrator:
--   email    : admin@gmail.com
--   password : Admin@1111  (stored ONLY as an Argon2id hash)
--   role     : ADMIN
--   status   : ACTIVE
--
-- Security requirements honoured:
--   * No plaintext password is stored — only the Argon2id hash blob.
--   * The hash is produced by Spring Security's
--     Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()
--     (m=16384, t=2, p=1) which is the application's password encoder.
--   * The seed is idempotent — it does nothing if the admin already exists,
--     so it is safe to run repeatedly across any environment.
-- -----------------------------------------------------------
DO $$
BEGIN
    -- 1. Create the admin user if it does not already exist.
    IF NOT EXISTS (SELECT 1 FROM finflow_auth.users WHERE email = 'admin@gmail.com') THEN
        INSERT INTO finflow_auth.users (
            id, email, phone_number, username, status,
            phone_verified, terms_accepted_at, last_login_at,
            failed_login_count, locked_until,
            is_deleted, deleted_at, deleted_by,
            created_at, updated_at, created_by, modified_by, version
        ) VALUES (
            gen_random_uuid(), 'admin@gmail.com', NULL, 'admin', 'ACTIVE',
            FALSE, CURRENT_TIMESTAMP, NULL,
            0, NULL,
            FALSE, NULL, NULL,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0
        );
    END IF;

    -- 2. Create the PASSWORD credential for the admin user (idempotent).
    IF NOT EXISTS (
        SELECT 1
        FROM finflow_auth.user_credentials uc
        JOIN finflow_auth.users u ON u.id = uc.user_id
        WHERE u.email = 'admin@gmail.com'
          AND uc.credential_type = 'PASSWORD'
          AND uc.is_active = TRUE
    ) THEN
        INSERT INTO finflow_auth.user_credentials (
            id, user_id, credential_type, hashed_value,
            is_active, last_used_at, expires_at,
            is_deleted, deleted_at, deleted_by,
            created_at, updated_at, created_by, modified_by, version
        )
        SELECT
            gen_random_uuid(), u.id, 'PASSWORD', '$argon2id$v=19$m=16384,t=2,p=1$m0bBDObu5T+M9tXXIB+aAw$X98HGILc72yKgJDxl4TsKuAkrOkyD+F+rCoPUsYYkf0',
            TRUE, NULL, NULL,
            FALSE, NULL, NULL,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 0
        FROM finflow_auth.users u
        WHERE u.email = 'admin@gmail.com';
    END IF;

    -- 3. Assign the ADMIN role to the admin user (idempotent).
    IF NOT EXISTS (
        SELECT 1
        FROM finflow_auth.user_roles ur
        JOIN finflow_auth.users u ON u.id = ur.user_id
        JOIN finflow_auth.roles r ON r.id = ur.role_id
        WHERE u.email = 'admin@gmail.com' AND r.name = 'ADMIN'
    ) THEN
        INSERT INTO finflow_auth.user_roles (
            id, user_id, role_id, granted_at, granted_by,
            created_at, updated_at, version
        )
        SELECT
            gen_random_uuid(), u.id, r.id, CURRENT_TIMESTAMP, 'system',
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0
        FROM finflow_auth.users u, finflow_auth.roles r
        WHERE u.email = 'admin@gmail.com' AND r.name = 'ADMIN';
    END IF;
END $$;