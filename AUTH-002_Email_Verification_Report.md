# AUTH-002 — Email Verification

**Story ID:** AUTH-002
**Status:** Planned
**Priority:** P0 — Critical (blocks account activation)
**Depends On:** AUTH-001 — User Registration
**Author:** FinFlow Engineering
**Date:** 2026-07-13
**Version:** 1.0.0

---

## 1. Executive Summary

AUTH-002 implements the email verification flow required to activate user accounts
after registration. When a user registers (AUTH-001), the account is created in
`PENDING_VERIFICATION` status. This story adds the mechanism to generate a
cryptographically secure verification token, deliver it via email, and activate the
account when the user clicks the verification link.

The implementation enforces single-active-token-per-user, server-side expiry validation,
SHA-256 token hashing (raw tokens are never persisted), and emits an `EmailVerified`
domain event with an immutable audit log entry.

---

## 2. Business Requirements

| # | Requirement | Priority |
|---|-------------|----------|
| BR-01 | Account status remains `PENDING_VERIFICATION` after registration | Must |
| BR-02 | Generate a cryptographically secure verification token on registration | Must |
| BR-03 | Token expires after 24 hours | Must |
| BR-04 | Only one active verification token may exist per user | Must |
| BR-05 | If a previous token exists, invalidate it before generating a new one | Must |
| BR-06 | Email must contain a verification link | Must |
| BR-07 | Email sending abstracted behind an `EmailService` interface | Must |
| BR-08 | Clicking the verification link activates the account | Must |
| BR-09 | Token cannot be reused after successful verification | Must |
| BR-10 | Expired tokens return a proper business error | Must |
| BR-11 | Invalid tokens return a proper business error | Must |
| BR-12 | Already verified accounts cannot be verified again | Must |
| BR-13 | User status changes to `ACTIVE` after successful verification | Must |
| BR-14 | Publish `EmailVerified` domain event on successful verification | Must |
| BR-15 | Create audit log entry on verification | Must |

---

## 3. Scope

### In Scope

- `POST /api/v1/auth/verify-email` — verify account with token
- `POST /api/v1/auth/resend-verification` — request a new verification email
- `VerificationToken` entity and repository
- `EmailService` interface with console implementation (dev/staging)
- `VerificationTokenGenerator` (SecureRandom + SHA-256)
- `EmailVerified` domain event
- Audit log table and write path
- Flyway migration for `verification_tokens` and `audit_log` tables
- Unit and integration tests

### Out of Scope

- Login / JWT / Refresh Token (AUTH-003)
- Forgot / Reset Password (AUTH-004)
- Two-Factor Authentication (AUTH-005)
- SMTP configuration (abstracted behind `EmailService`)
- SMS verification
- OAuth / Social login

---

## 4. Architecture

### 4.1 Component Diagram

```
┌──────────────┐     ┌────────────────────┐     ┌──────────────────────┐
│  AuthController│────▶│EmailVerification   │────▶│ VerificationToken    │
│              │     │    Service          │     │    Repository        │
└──────────────┘     └────┬───────────┬───┘     └──────────────────────┘
                          │           │
                          ▼           ▼
                 ┌────────────┐  ┌──────────────┐
                 │Verification│  │  EmailService │
                 │TokenGenerator│ │  (interface)  │
                 └────────────┘  └──────┬───────┘
                                        │
                               ┌────────▼────────┐
                               │ConsoleEmailService│
                               │  (dev impl)      │
                               └──────────────────┘
```

### 4.2 Package Structure

```
com.finflow.modules.auth
├── controller
│   └── AuthController.java          (MODIFIED — +2 endpoints)
├── domain
│   ├── VerificationToken.java       (NEW)
│   ├── EmailVerifiedEvent.java      (NEW)
│   ├── User.java                    (EXISTING — no changes)
│   └── ...
├── dto
│   ├── VerifyEmailRequest.java      (NEW)
│   ├── VerifyEmailResponse.java     (NEW)
│   ├── ResendVerificationRequest.java (NEW)
│   └── ResendVerificationResponse.java (NEW)
├── mapper
│   └── VerificationTokenMapper.java (NEW)
├── repository
│   ├── VerificationTokenRepository.java (NEW)
│   └── ...
├── service
│   ├── EmailVerificationService.java  (NEW)
│   ├── EmailService.java              (NEW — interface)
│   ├── ConsoleEmailService.java       (NEW — dev impl)
│   ├── VerificationTokenGenerator.java (NEW)
│   └── RegistrationService.java       (EXISTING — no changes)
└── validator
    └── ...                          (EXISTING — no changes)

com.finflow.shared
├── constants
│   └── ErrorCodes.java              (MODIFIED — +3 codes)
└── exception
    └── BusinessRuleException.java   (MODIFIED — +3 factories)

com.finflow.modules.audit
└── domain
    └── AuditLog.java                (NEW — lightweight audit entity)
```

---

## 5. Data Model

### 5.1 New Table: `verification_tokens`

```sql
CREATE TABLE finflow_auth.verification_tokens (
    id              CHAR(36)     NOT NULL,
    user_id         CHAR(36)     NOT NULL,
    token_hash      VARCHAR(64)  NOT NULL,        -- SHA-256 hex
    token_type      VARCHAR(20)  NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    expires_at      DATETIME(6)  NOT NULL,        -- 24h from creation
    used_at         DATETIME(6)  NULL,            -- set on successful use
    revoked_at      DATETIME(6)  NULL,            -- set when superseded
    created_by_ip   VARCHAR(45)  NULL,            -- IPv4/IPv6

    -- audit
    created_at      DATETIME(6)  NOT NULL,
    updated_at      DATETIME(6)  NOT NULL,
    created_by      VARCHAR(36)  NOT NULL DEFAULT 'system',
    modified_by     VARCHAR(36)  NOT NULL DEFAULT 'system',
    version         BIGINT       NOT NULL DEFAULT 0,

    CONSTRAINT pk_verification_tokens PRIMARY KEY (id),
    CONSTRAINT fk_vt_user FOREIGN KEY (user_id)
        REFERENCES finflow_auth.users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Indexes:**

```sql
-- Enforce one active token per user (partial unique)
CREATE UNIQUE INDEX uniq_vt_active_per_user
    ON finflow_auth.verification_tokens (user_id, token_type)
    WHERE used_at IS NULL AND revoked_at IS NULL;

-- Lookup by hash (primary query path)
CREATE INDEX idx_vt_token_hash
    ON finflow_auth.verification_tokens (token_hash);

-- Query by user
CREATE INDEX idx_vt_user_id
    ON finflow_auth.verification_tokens (user_id);
```

### 5.2 New Table: `audit_log`

```sql
CREATE TABLE finflow_auth.audit_log (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    event_type      VARCHAR(50)   NOT NULL,
    aggregate_id    CHAR(36)      NOT NULL,
    aggregate_type  VARCHAR(50)   NOT NULL DEFAULT 'USER',
    actor_id        VARCHAR(36)   NOT NULL,
    event_data      JSON          NULL,
    ip_address      VARCHAR(45)   NULL,
    user_agent      VARCHAR(500)  NULL,
    created_at      DATETIME(6)   NOT NULL,

    CONSTRAINT pk_audit_log PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_audit_aggregate ON finflow_auth.audit_log (aggregate_id);
CREATE INDEX idx_audit_event     ON finflow_auth.audit_log (event_type);
CREATE INDEX idx_audit_created   ON finflow_auth.audit_log (created_at);
```

### 5.3 Entity Relationship

```
users (1) ──────< (N) verification_tokens
    │
    └──────< (N) audit_log  (via aggregate_id)
```

---

## 6. Security Design

### 6.1 Token Generation

```
SecureRandom  →  32 random bytes (256 bits entropy)
                     │
                     ▼
              SHA-256 hash  →  64-char hex  →  stored in DB
                     │
                     ▼
              Base64URL encode  →  43-char URL-safe string  →  sent to user
```

- **Entropy**: 256 bits via `java.security.SecureRandom`
- **Raw token format**: 43-character Base64URL string (no padding)
- **Storage format**: SHA-256 hex digest (64 characters)
- **Token prefix**: Tokens are prefixed with `ff_` for identification: `ff_<base64url>`

### 6.2 Token Comparison

```java
// Server-side verification
String incomingHash = sha256Hex(rawToken);
boolean matches = MessageDigest.isEqual(
    incomingHash.getBytes(StandardCharsets.UTF_8),
    storedHash.getBytes(StandardCharsets.UTF_8)
);
```

Constant-time comparison via `MessageDigest.isEqual` prevents timing attacks.

### 6.3 Token Lifecycle

```
GENERATED ──→ ACTIVE ──→ USED (successful verification)
                │
                └──→ REVOKED (superseded by new token)
                │
                └──→ EXPIRED (24h TTL exceeded)
```

| State | `used_at` | `revoked_at` | `expires_at` vs now |
|-------|-----------|-------------|---------------------|
| Active | NULL | NULL | `expires_at > now` |
| Used | NOT NULL | NULL | any |
| Revoked | NULL | NOT NULL | any |
| Expired | NULL | NULL | `expires_at <= now` |

### 6.4 Anti-Enumeration

The `POST /api/v1/auth/resend-verification` endpoint returns the same success response
regardless of whether the email exists in the system. This prevents attackers from
enumerating valid email addresses.

---

## 7. API Contract

### 7.1 POST /api/v1/auth/verify-email

**Authentication:** None (public endpoint)

**Request Body:**

```json
{
    "token": "ff_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `token` | String | Yes | Not blank, 10-200 chars |

**Response 200 OK:**

```json
{
    "success": true,
    "data": {
        "email": "user@finflow.com",
        "status": "ACTIVE",
        "emailVerified": true,
        "verifiedAt": "2026-07-13T16:30:00Z"
    },
    "meta": {
        "timestamp": "2026-07-13T16:30:00Z",
        "requestId": "550e8400-e29b-41d4-a716-446655440000",
        "message": "Email verified successfully. Your account is now active."
    }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `TOKEN_INVALID` | Verification token is invalid |
| 400 | `TOKEN_EXPIRED` | Verification token has expired |
| 400 | `ALREADY_VERIFIED` | Email has already been verified |
| 429 | `RATE_LIMITED` | Too many requests |

### 7.2 POST /api/v1/auth/resend-verification

**Authentication:** None (public endpoint)

**Request Body:**

```json
{
    "email": "user@finflow.com"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | String | Yes | Valid email format |

**Response 200 OK:**

```json
{
    "success": true,
    "data": {
        "email": "user@finflow.com",
        "message": "If the email address is registered, a verification link has been sent.",
        "expiresInHours": 24
    },
    "meta": {
        "timestamp": "2026-07-13T16:30:00Z",
        "requestId": "550e8400-e29b-41d4-a716-446655440000"
    }
}
```

**Note:** Always returns 200 OK, even if the email is not registered. This prevents
email enumeration attacks.

---

## 8. Domain Events

### 8.1 EmailVerifiedEvent

```java
public class EmailVerifiedEvent implements DomainEvent {
    private final String aggregateId;   // user ID
    private final String email;
    private final LocalDateTime occurredOn;
    private final String tokenType;

    // Factory method
    public static EmailVerifiedEvent of(User user, String tokenType);
}
```

**Published to:** Application event bus (`ApplicationEventPublisher`)

**Consumers (future stories):**
- Account module — provision default bank account
- Notification module — send welcome email
- Billing module — activate billing profile
- Audit module — immutable audit trail (handled inline)

---

## 9. Audit Logging

Every verification event produces an immutable `audit_log` entry:

```json
{
    "event_type": "EMAIL_VERIFIED",
    "aggregate_id": "550e8400-e29b-41d4-a716-446655440000",
    "aggregate_type": "USER",
    "actor_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_data": {
        "email": "user@finflow.com",
        "verification_method": "EMAIL_LINK",
        "token_type": "EMAIL_VERIFICATION"
    },
    "ip_address": "192.168.1.100",
    "created_at": "2026-07-13T16:30:00Z"
}
```

---

## 10. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `TOKEN_INVALID` | 400 | Token not found, already used, or revoked |
| `TOKEN_EXPIRED` | 400 | Token exists but has passed its 24h TTL |
| `ALREADY_VERIFIED` | 400 | User's email is already verified |

Added to `ErrorCodes.java` and `BusinessRuleException.java` as factory methods.

---

## 11. File Manifest

### 11.1 New Files (14)

| # | File | Type | Lines (est.) |
|---|------|------|-------------|
| 1 | `V2_0__create_verification_tokens.sql` | Migration | ~60 |
| 2 | `VerificationToken.java` | Entity | ~90 |
| 3 | `EmailVerifiedEvent.java` | Domain Event | ~50 |
| 4 | `VerificationTokenRepository.java` | Repository | ~40 |
| 5 | `VerifyEmailRequest.java` | DTO | ~20 |
| 6 | `VerifyEmailResponse.java` | DTO | ~15 |
| 7 | `ResendVerificationRequest.java` | DTO | ~15 |
| 8 | `ResendVerificationResponse.java` | DTO | ~15 |
| 9 | `VerificationTokenMapper.java` | Mapper | ~20 |
| 10 | `VerificationTokenGenerator.java` | Service | ~70 |
| 11 | `EmailService.java` | Interface | ~25 |
| 12 | `ConsoleEmailService.java` | Service | ~50 |
| 13 | `EmailVerificationService.java` | Service | ~150 |
| 14 | `AuditLog.java` | Entity | ~60 |

### 11.2 Modified Files (3)

| # | File | Change |
|---|------|--------|
| 1 | `ErrorCodes.java` | +3 constants |
| 2 | `BusinessRuleException.java` | +3 factory methods |
| 3 | `AuthController.java` | +2 endpoints (~60 lines) |

### 11.3 Test Files (4)

| # | File | Type |
|---|------|------|
| 1 | `VerificationTokenGeneratorTest.java` | Unit |
| 2 | `EmailVerificationServiceTest.java` | Unit |
| 3 | `AuthControllerEmailVerificationTest.java` | Unit (MockMvc) |
| 4 | `VerificationTokenRepositoryIntegrationTest.java` | Integration |

---

## 12. Implementation Order

| Step | Description | Files |
|------|-------------|-------|
| 1 | Review AUTH-001 | Read existing code |
| 2 | Flyway migration | `V2_0__create_verification_tokens.sql` |
| 3 | VerificationToken entity | `VerificationToken.java` |
| 4 | AuditLog entity | `AuditLog.java` |
| 5 | Repository | `VerificationTokenRepository.java`, `AuditLogRepository.java` |
| 6 | DTOs | `VerifyEmailRequest`, `VerifyEmailResponse`, `ResendVerificationRequest`, `ResendVerificationResponse` |
| 7 | Mapper | `VerificationTokenMapper.java` |
| 8 | Token Generator | `VerificationTokenGenerator.java` |
| 9 | Email abstraction | `EmailService.java`, `ConsoleEmailService.java` |
| 10 | Domain Event | `EmailVerifiedEvent.java` |
| 11 | Error codes | Update `ErrorCodes.java`, `BusinessRuleException.java` |
| 12 | Service | `EmailVerificationService.java` |
| 13 | Controller | Update `AuthController.java` |
| 14 | Swagger | Verify OpenAPI annotations |
| 15 | Unit Tests | 3 test classes |
| 16 | Integration Tests | 1 test class |

---

## 13. Configuration

### 13.1 Application Properties

```yaml
# Verification token settings
finflow:
  verification:
    token-length-bytes: 32    # 256 bits entropy
    token-expiry-hours: 24
    max-active-tokens: 1

  email:
    base-url: http://localhost:8080
    verification-path: /verify-email
```

### 13.2 Email Template (Console Output)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FinFlow — Verify Your Email Address
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hello {username},

Click the link below to verify your email address:

  {base_url}/verify-email?token={raw_token}

This link expires in 24 hours.

If you did not create a FinFlow account,
please ignore this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FinFlow Digital Banking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 14. Testing Strategy

### 14.1 Unit Tests

| Test Class | Covers |
|-----------|--------|
| `VerificationTokenGeneratorTest` | Token uniqueness, hash determinism, URL safety, entropy |
| `EmailVerificationServiceTest` | Verify flow, resend flow, all error paths |
| `AuthControllerEmailVerificationTest` | HTTP status codes, request validation, response shapes |

### 14.2 Integration Tests

| Test Class | Covers |
|-----------|--------|
| `VerificationTokenRepositoryIntegrationTest` | Partial unique index enforcement, expiry queries |

### 14.3 Key Test Scenarios

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Verify with valid token | 200, account ACTIVE, audit log created |
| 2 | Verify with expired token | 400 TOKEN_EXPIRED |
| 3 | Verify with invalid token | 400 TOKEN_INVALID |
| 4 | Verify already-verified account | 400 ALREADY_VERIFIED |
| 5 | Verify with used token | 400 TOKEN_INVALID |
| 6 | Resend for registered email | 200, new token generated |
| 7 | Resend for unregistered email | 200 (anti-enumeration) |
| 8 | Resend for already-verified email | 400 ALREADY_VERIFIED |
| 9 | Resend invalidates previous token | Previous token returns TOKEN_INVALID |
| 10 | Two concurrent resend requests | Only one active token at a time |

---

## 15. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Token brute-force | Account takeover | Low | 256-bit entropy, rate limiting |
| Timing attack on token comparison | Token leak | Low | `MessageDigest.isEqual` constant-time compare |
| Email enumeration | Privacy breach | Medium | Identical response for valid/invalid emails |
| Token reuse after verification | Double activation | Low | `used_at` check + partial unique index |
| Audit log write failure | Compliance gap | Low | Audit write is best-effort, logged on failure |
| SMTP not configured | No email delivery | High (dev) | `ConsoleEmailService` logs to console |

---

## 16. Acceptance Criteria

- [ ] `POST /api/v1/auth/verify-email` returns 200 on valid token
- [ ] `POST /api/v1/auth/verify-email` returns 400 TOKEN_INVALID on invalid token
- [ ] `POST /api/v1/auth/verify-email` returns 400 TOKEN_EXPIRED on expired token
- [ ] `POST /api/v1/auth/verify-email` returns 400 ALREADY_VERIFIED for verified users
- [ ] `POST /api/v1/auth/resend-verification` always returns 200 (anti-enumeration)
- [ ] `POST /api/v1/auth/resend-verification` returns 400 ALREADY_VERIFIED for verified users
- [ ] New token invalidates previous token
- [ ] Token is never stored in raw form (only SHA-256 hash)
- [ ] User status changes to ACTIVE after verification
- [ ] `EmailVerifiedEvent` is published on successful verification
- [ ] Audit log entry is created on verification
- [ ] All operations are transactional
- [ ] Unit tests pass with >80% coverage
- [ ] Integration tests pass against H2

---

**End of Report — AUTH-002 Email Verification**
