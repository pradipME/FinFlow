# FinFlow — API Architecture Document

**Document Classification:** Confidential — CTO & API Architecture Review
**Version:** 1.0.0
**Status:** Draft for Review
**Last Updated:** July 2026
**API Style:** REST (JSON)

---

## Table of Contents

1. [API Philosophy](#1-api-philosophy)
2. [URL Strategy](#2-url-strategy)
3. [Standard Request & Response Format](#3-standard-request--response-format)
4. [Authentication Strategy](#4-authentication-strategy)
5. [Module-wise API Specifications](#5-module-wise-api-specifications)
6. [Pagination Strategy](#6-pagination-strategy)
7. [Filtering Strategy](#7-filtering-strategy)
8. [Sorting Strategy](#8-sorting-strategy)
9. [Search Strategy](#9-search-strategy)
10. [Error Handling Strategy](#10-error-handling-strategy)
11. [Validation Strategy](#11-validation-strategy)
12. [Rate Limiting Strategy](#12-rate-limiting-strategy)
13. [API Security](#13-api-security)
14. [API Documentation Strategy](#14-api-documentation-strategy)
15. [API Evolution Strategy](#15-api-evolution-strategy)

---

## 1. API Philosophy

### 1.1 Core Principles

#### Principle 1: Resource-Oriented Design
APIs are organized around resources (nouns), not actions (verbs). HTTP methods provide verb semantics. Business actions are modeled as state transitions on resources (e.g., PATCH `/accounts/{id}` with status change), not action endpoints (e.g., `/activate-account`).

**Enforcement:** API linter rejects any endpoint that does not map to a resource or sub-resource.

#### Principle 2: Consistency Over Cleverness
Every endpoint follows identical conventions for naming, request structure, response structure, error handling, and pagination. Developer muscle memory is more valuable than per-endpoint optimization.

**Enforcement:** API linter validates naming conventions, response structure, error format, and pagination format for every endpoint.

#### Principle 3: Idempotency by Default
All mutating operations must be idempotent when provided with an idempotency key. In a banking platform, duplicate operations have financial consequences. Idempotency keys ensure retried requests produce the same result.

**Enforcement:** Every POST endpoint accepts an optional `Idempotency-Key` header. Server stores the key with the response for 24 hours.

#### Principle 4: Security as a Layer
Authentication, authorization, rate limiting, input validation, and audit logging are architectural layers that every endpoint inherits.

**Enforcement:** Security layers are applied at the API gateway and application interceptor level. No endpoint can bypass authentication without explicit, reviewed exemption.

#### Principle 5: Explicit Error Communication
Every API response communicates exactly what happened, why, and what the client can do about it. Errors are machine-readable (codes), human-readable (messages), and actionable (suggested next steps).

#### Principle 6: Evolutionary, Not Revolutionary
APIs evolve through additive changes. Breaking changes are avoided and introduced only through versioned migration paths with 6-month deprecation notice.

### 1.2 Naming Conventions

| Element | Convention | Examples |
|---|---|---|
| Resource names | Plural nouns, lowercase | `accounts`, `transfer_limits`, `card_authorizations` |
| URL paths | Plural nouns, kebab-case | `/savings-goals`, `/fraud-alerts` |
| Query parameters | snake_case | `?account_id=123&transfer_status=completed` |
| Header names | Title-Case with hyphens | `X-Request-Id`, `Idempotency-Key` |
| Enum values | snake_case | `transfer_status=completed`, `card_type=virtual` |
| Timestamps | ISO 8601 UTC | `2026-07-13T14:30:00Z` |
| Money amounts | Integer cents + currency code | `amount_cents=1500`, `currency=USD` |
| Boolean fields | `is_` prefix | `is_active`, `is_verified`, `is_primary` |

### 1.3 HTTP Method Semantics

| Method | Idempotent | Safe | Semantics |
|---|---|---|---|
| GET | Yes | Yes | Retrieve resource(s) |
| POST | No* | No | Create resource or trigger action |
| PUT | Yes | No | Full resource replacement |
| PATCH | Yes* | No | Partial resource update |
| DELETE | Yes | No | Remove resource |

*With idempotency key.

### 1.4 Stateless Architecture
Every API request contains all information needed to process it. Authentication via JWT. Session state in Redis (externalized). Request context carried in headers. No server-side session objects tied to specific instances.

---

## 2. URL Strategy

### 2.1 Base URL Structure

```
https://api.finflow.com/api/{version}/{resource}
```

| Component | Purpose |
|---|---|
| `https://api.finflow.com` | Production API hostname |
| `/api` | API namespace |
| `/{version}` | API version (`v1`, `v2`) |
| `/{resource}` | Resource path |

### 2.2 Versioning Strategy

**Approach: URL Path Versioning** — `/api/v1/accounts`

**Why:** Explicit in every request/response, simple, cacheable, developer-friendly, industry standard (Stripe, GitHub, Shopify).

### 2.3 Version Lifecycle

| Phase | Duration | Behavior |
|---|---|---|
| **Current** | Active development | All new features added here |
| **Supported** | 12 months after next release | Bug fixes and security patches only |
| **Deprecated** | 6 months after Supported | Returns `Sunset` header |
| **Retired** | After Deprecated | Returns `410 Gone` with migration guide |

### 2.4 Breaking vs Non-Breaking Changes

**Breaking (requires new version):** Removing/renaming response fields, changing field types, changing URL structure, changing auth mechanism, removing endpoints.

**Non-breaking (no version bump):** Adding optional request fields, adding response fields, adding endpoints, adding enum values (with `UNKNOWN` fallback), adding query parameters, relaxing validation.

### 2.5 Environments

| Environment | Base URL | Purpose |
|---|---|---|
| Production | `https://api.finflow.com/api/v1` | Live operations |
| Staging | `https://api-staging.finflow.com/api/v1` | Pre-production testing |
| Sandbox | `https://api-sandbox.finflow.com/api/v1` | Developer testing with mock data |

---

## 3. Standard Request & Response Format

### 3.1 Success Response

```
{ "data": { ... } | [ ... ], "meta": { ... } }
```

- Single resource: `data` is an object
- Collection: `data` is an array
- Action (no return data): `data` is `null`

### 3.2 Error Response

```
{ "error": { "code": "string", "message": "string", "target": "string", "details": [...], "request_id": "string", "documentation_url": "string" } }
```

### 3.3 Validation Error

```
{ "error": { "code": "VALIDATION_ERROR", "message": "Request validation failed", "details": [{ "field": "amount_cents", "code": "INVALID_VALUE", "message": "Amount must be greater than zero" }] } }
```

### 3.4 Metadata

Every response includes `meta` with `request_id`, `timestamp`, `api_version`, and `rate_limit` (limit, remaining, reset_at).

### 3.5 Pagination Metadata

Collection responses include `meta.pagination` with `has_more`, `next_cursor`, and `page_size`.

### 3.6 Action Response

```
{ "data": null, "meta": { "action": "transfer_initiated", "resource_id": "xfer_abc123" } }
```

---

## 4. Authentication Strategy

### 4.1 Token Lifecycle

```
Register -> Verify Email -> Login -> JWT (15min) + Refresh (7 day, single-use rotation)
                                         |
                                    API Requests with JWT
                                         |
                                    Token expires
                                         |
                                    Refresh -> New JWT + New Refresh (old invalidated)

Security events invalidate all tokens:
- Password change, suspicious activity, account lock, logout
```

### 4.2 Authentication Endpoints

| Endpoint | Method | Auth | Purpose | Key Business Rules |
|---|---|---|---|---|
| `/auth/register` | POST | No | Create account | Email/phone unique. Password 12+ chars. Terms required. Rate limited. |
| `/auth/login` | POST | No | Authenticate | 5 fails = 30min lock. 10 fails = 24hr lock. MFA flow if enabled. |
| `/auth/refresh` | POST | Refresh token | New access token | Single-use rotation. Stolen token detection. |
| `/auth/logout` | POST | Required | Invalidate session | Optional `all_devices: true`. |
| `/auth/forgot-password` | POST | No | Initiate reset | Always returns success (prevents enumeration). 3 req/hr limit. |
| `/auth/reset-password` | POST | Reset token | Complete reset | 1hr expiry. Single-use. Invalidates all sessions. |
| `/auth/verify-email` | POST | Verification token | Verify email | 24hr expiry. Single-use. |
| `/auth/verify-otp` | POST | Temporary token | Verify OTP | 5min expiry. Max 3 attempts. |
| `/auth/mfa/setup` | POST | Required | Initialize MFA | Max 3 methods. TOTP secret shown once. |
| `/auth/sessions` | GET | Required | List sessions | Paginated. |
| `/auth/sessions/{id}` | DELETE | Required | Revoke session | Yes. |
| `/auth/devices` | GET | Required | List devices | Paginated. |
| `/auth/devices/{id}/trust` | POST | Required | Trust device | No. |
| `/auth/devices/{id}/revoke` | POST | Required | Revoke device | No. |

---

## 5. Module-wise API Specifications

### 5.1 Authentication Module

*(Covered in Section 4.2 above)*

### 5.2 User Management Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/users/me` | GET | Get current user | Required | Any | N/A |
| `/users/me` | PATCH | Update current user | Required | Any | Yes |
| `/users/{id}` | GET | Get user by ID | Required | Admin, Support | N/A |
| `/users/me/password` | PUT | Change password | Required | Any | No |
| `/users/me/email` | PATCH | Change email | Required | Any | No |
| `/users/me/phone` | PATCH | Change phone | Required | Any | No |
| `/users/me/close-account` | POST | Request closure | Required | Any | No |

**Business Rules:** Users modify only their own profile. Email/phone change requires verification. Password change invalidates all sessions except current. Account closure requires zero balance, 30-day cooling period.

### 5.3 Profile Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/users/me/profile` | GET | Get profile | Required | Any | N/A |
| `/users/me/profile` | PUT | Full replacement | Required | Any | Yes |
| `/users/me/profile` | PATCH | Partial update | Required | Any | Yes |
| `/users/me/addresses` | GET | List addresses | Required | Any | N/A |
| `/users/me/addresses` | POST | Add address | Required | Any | No |
| `/users/me/addresses/{id}` | GET | Get address | Required | Any | N/A |
| `/users/me/addresses/{id}` | PUT | Update address | Required | Any | Yes |
| `/users/me/addresses/{id}` | DELETE | Remove address | Required | Any | Yes |
| `/users/me/addresses/{id}/primary` | POST | Set primary | Required | Any | No |

### 5.4 KYC Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/users/me/kyc` | GET | Get KYC status | Required | Any | N/A |
| `/users/me/kyc` | POST | Submit documents | Required | Any | No |
| `/users/me/kyc/documents` | GET | List documents | Required | Any | N/A |
| `/users/me/kyc/documents/{id}` | GET | Get document | Required | Any | N/A |

**Business Rules:** Upload returns pre-signed URL for direct S3 upload. Status transitions async. Expired KYC restricts account.

### 5.5 Accounts Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/accounts` | GET | List accounts | Required | Any | N/A |
| `/accounts` | POST | Open account | Required | Any | No |
| `/accounts/{id}` | GET | Get account | Required | Any | N/A |
| `/accounts/{id}` | PATCH | Update settings | Required | Any | Yes |
| `/accounts/{id}/balance` | GET | Get balance | Required | Any | N/A |
| `/accounts/{id}/holds` | GET | Get holds | Required | Any | N/A |
| `/accounts/{id}/limits` | GET | Get limits | Required | Any | N/A |
| `/accounts/{id}/limits` | PUT | Update limits | Required | Any | Yes |
| `/accounts/{id}/status-history` | GET | Status history | Required | Any | N/A |
| `/accounts/{id}/statements` | GET | List statements | Required | Any | N/A |
| `/accounts/{id}/statements` | POST | Generate statement | Required | Any | No |
| `/accounts/{id}/close` | POST | Request closure | Required | Any | No |

**Business Rules:** Account creation requires KYC. Types: checking, savings, business. Closure requires zero balance, no pending transactions.

### 5.6 Transactions Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/accounts/{id}/transactions` | GET | List transactions | Required | Any | N/A |
| `/accounts/{id}/transactions/{txn_id}` | GET | Get transaction | Required | Any | N/A |
| `/accounts/{id}/transactions/{txn_id}/category` | PUT | Update category | Required | Any | Yes |
| `/accounts/{id}/transactions/{txn_id}/metadata` | GET | Get metadata | Required | Any | N/A |
| `/accounts/{id}/balance-snapshots` | GET | Balance history | Required | Any | N/A |
| `/transactions/search` | POST | Search transactions | Required | Any | N/A |

**Business Rules:** Cursor-based pagination. Default sort: newest first. Transactions immutable; only category updatable. Full-text search on description/merchant.

### 5.7 Money Transfer Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/transfers` | POST | Initiate transfer | Required | Any | **Mandatory** |
| `/transfers` | GET | List transfers | Required | Any | N/A |
| `/transfers/{id}` | GET | Get transfer | Required | Any | N/A |
| `/transfers/{id}/status` | GET | Get status | Required | Any | N/A |
| `/transfers/{id}/cancel` | POST | Cancel transfer | Required | Any | Yes |
| `/transfers/limits` | GET | Get limits | Required | Any | N/A |
| `/transfers/limits/consumption` | GET | Limit consumption | Required | Any | N/A |
| `/transfers/fx-quote` | POST | Get FX quote | Required | Any | Yes |
| `/transfers/recurring` | GET | List recurring | Required | Any | N/A |
| `/transfers/recurring` | POST | Create recurring | Required | Any | No |
| `/transfers/recurring/{id}` | GET | Get recurring | Required | Any | N/A |
| `/transfers/recurring/{id}` | PATCH | Update recurring | Required | Any | Yes |
| `/transfers/recurring/{id}` | DELETE | Cancel recurring | Required | Any | Yes |

**Business Rules:** Idempotency key mandatory for initiation. Pre-validation: balance, limits, beneficiary, fraud. FX quote valid 60 seconds. New beneficiaries: 24hr hold. Cancellation only in Initiated/Validated. Recurring on business days only.

### 5.8 Beneficiaries Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/beneficiaries` | GET | List beneficiaries | Required | Any | N/A |
| `/beneficiaries` | POST | Add beneficiary | Required | Any | No |
| `/beneficiaries/{id}` | GET | Get beneficiary | Required | Any | N/A |
| `/beneficiaries/{id}` | PUT | Update beneficiary | Required | Any | Yes |
| `/beneficiaries/{id}` | DELETE | Remove beneficiary | Required | Any | Yes |
| `/beneficiaries/{id}/verify` | POST | Verify beneficiary | Required | Any | No |

**Business Rules:** Verification required before first large transfer (>$1,000). Micro-deposit or instant verification. Cannot remove during active transfer.

### 5.9 Cards Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/cards` | GET | List cards | Required | Any | N/A |
| `/cards` | POST | Issue card | Required | Any | No |
| `/cards/{id}` | GET | Get card | Required | Any | N/A |
| `/cards/{id}` | PATCH | Update settings | Required | Any | Yes |
| `/cards/{id}/freeze` | POST | Freeze card | Required | Any | Yes |
| `/cards/{id}/unfreeze` | POST | Unfreeze card | Required | Any | Yes |
| `/cards/{id}/replace` | POST | Replace card | Required | Any | No |
| `/cards/{id}/controls` | GET | Get controls | Required | Any | N/A |
| `/cards/{id}/controls` | PUT | Update controls | Required | Any | Yes |
| `/cards/{id}/limits` | GET | Get limits | Required | Any | N/A |
| `/cards/{id}/limits` | PUT | Update limits | Required | Any | Yes |
| `/cards/{id}/authorizations` | GET | List authorizations | Required | Any | N/A |
| `/cards/{id}/transactions` | GET | Card transactions | Required | Any | N/A |

**Business Rules:** Virtual cards instant. Physical requires activation. Freeze instantaneous. Controls evaluated in priority order. Replacement issues new number.

### 5.10 Savings Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/savings/goals` | GET | List goals | Required | Any | N/A |
| `/savings/goals` | POST | Create goal | Required | Any | No |
| `/savings/goals/{id}` | GET | Get goal | Required | Any | N/A |
| `/savings/goals/{id}` | PATCH | Update goal | Required | Any | Yes |
| `/savings/goals/{id}` | DELETE | Close goal | Required | Any | Yes |
| `/savings/goals/{id}/progress` | GET | Progress history | Required | Any | N/A |
| `/savings/goals/{id}/rules` | GET | List rules | Required | Any | N/A |
| `/savings/goals/{id}/rules` | POST | Create rule | Required | Any | No |
| `/savings/goals/{id}/rules/{rule_id}` | PATCH | Update rule | Required | Any | Yes |
| `/savings/goals/{id}/rules/{rule_id}` | DELETE | Remove rule | Required | Any | Yes |
| `/savings/interest-rates` | GET | Get rates | Required | Any | N/A |

### 5.11 Notifications Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/notifications` | GET | List notifications | Required | Any | N/A |
| `/notifications/{id}` | GET | Get notification | Required | Any | N/A |
| `/notifications/{id}/read` | POST | Mark read | Required | Any | Yes |
| `/notifications/preferences` | GET | Get preferences | Required | Any | N/A |
| `/notifications/preferences` | PUT | Update preferences | Required | Any | Yes |
| `/notifications/unread-count` | GET | Unread count | Required | Any | N/A |
| `/notifications/read-all` | POST | Mark all read | Required | Any | Yes |

### 5.12 Dashboard Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/dashboard/summary` | GET | Financial overview | Required | Any | N/A |
| `/dashboard/spending` | GET | Spending breakdown | Required | Any | N/A |
| `/dashboard/spending/weekly` | GET | Weekly summary | Required | Any | N/A |
| `/dashboard/spending/monthly` | GET | Monthly summary | Required | Any | N/A |
| `/dashboard/spending/category/{category}` | GET | Category detail | Required | Any | N/A |
| `/dashboard/cashflow` | GET | Cash flow overview | Required | Any | N/A |
| `/dashboard/cashflow/forecast` | GET | Cash flow forecast | Required | Any | N/A |
| `/dashboard/insights` | GET | Financial insights | Required | Any | N/A |
| `/dashboard/budgets` | GET | Budget overview | Required | Any | N/A |
| `/dashboard/budgets` | POST | Create budget | Required | Any | No |
| `/dashboard/budgets/{id}` | GET | Get budget | Required | Any | N/A |
| `/dashboard/budgets/{id}` | PATCH | Update budget | Required | Any | Yes |
| `/dashboard/budgets/{id}` | DELETE | Remove budget | Required | Any | Yes |
| `/dashboard/recent-activity` | GET | Recent transactions | Required | Any | N/A |

**Business Rules:** Composite view from pre-aggregated tables. Cash flow forecast uses ML. Data may lag up to 1 minute.

### 5.13 Reports Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/reports` | GET | List reports | Required | Any | N/A |
| `/reports` | POST | Request generation | Required | Any | No |
| `/reports/{id}` | GET | Get report | Required | Any | N/A |
| `/reports/{id}/download` | GET | Download report | Required | Any | N/A |
| `/reports/{id}/cancel` | POST | Cancel generation | Required | Any | Yes |
| `/reports/schedules` | GET | List schedules | Required | Any | N/A |
| `/reports/schedules` | POST | Create schedule | Required | Any | No |
| `/reports/schedules/{id}` | PATCH | Update schedule | Required | Any | Yes |
| `/reports/schedules/{id}` | DELETE | Cancel schedule | Required | Any | Yes |

### 5.14 Admin Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/admin/users` | GET | List users | Required | Admin | N/A |
| `/admin/users/{id}` | GET | Get user | Required | Admin, Support | N/A |
| `/admin/users/{id}/status` | PATCH | Update status | Required | Admin | Yes |
| `/admin/accounts` | GET | List accounts | Required | Admin | N/A |
| `/admin/accounts/{id}` | GET | Get account | Required | Admin | N/A |
| `/admin/accounts/{id}/status` | PATCH | Update status | Required | Admin | Yes |
| `/admin/accounts/{id}/limits` | PUT | Override limits | Required | Admin | Yes |
| `/admin/transfers` | GET | List transfers | Required | Admin | N/A |
| `/admin/transfers/{id}` | GET | Get transfer | Required | Admin | N/A |
| `/admin/cards` | GET | List cards | Required | Admin | N/A |
| `/admin/kyc` | GET | Pending KYC | Required | Admin, Compliance | N/A |
| `/admin/kyc/{id}` | PATCH | Review KYC | Required | Admin, Compliance | Yes |
| `/admin/fraud/alerts` | GET | List alerts | Required | Admin, Compliance | N/A |
| `/admin/fraud/cases` | GET | List cases | Required | Admin, Compliance | N/A |
| `/admin/fraud/cases/{id}` | GET | Get case | Required | Admin, Compliance | N/A |
| `/admin/fraud/cases/{id}` | PATCH | Update case | Required | Admin, Compliance | Yes |
| `/admin/fraud/cases/{id}/resolve` | POST | Resolve case | Required | Admin, Compliance | No |
| `/admin/audit-logs` | GET | Search audit | Required | Admin, Compliance | N/A |
| `/admin/data-access-logs` | GET | Search access | Required | Admin | N/A |
| `/admin/config` | GET | Get config | Required | Admin | N/A |
| `/admin/config` | PUT | Update config | Required | Admin | Yes |
| `/admin/feature-flags` | GET | List flags | Required | Admin | N/A |
| `/admin/feature-flags` | PUT | Update flag | Required | Admin | Yes |

### 5.15 Settings Module

| Endpoint | Method | Purpose | Auth | Roles | Idempotent |
|---|---|---|---|---|---|
| `/settings/preferences` | GET | Get preferences | Required | Any | N/A |
| `/settings/preferences` | PUT | Update preferences | Required | Any | Yes |
| `/settings/preferences/{key}` | GET | Get preference | Required | Any | N/A |
| `/settings/preferences/{key}` | PUT | Update preference | Required | Any | Yes |

---

## 6. Pagination Strategy

### 6.1 Cursor-Based (Primary)

**Used for:** All user-facing collection endpoints.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `cursor` | String | null | Cursor from previous response |
| `page_size` | Integer | 20 | Records per page (1-100) |

**Response meta:** `has_more` (Boolean), `next_cursor` (String), `page_size` (Integer).

**Why cursor-based:** Consistent performance at any depth, no skipped/duplicate records, natural for time-ordered data, database-friendly (index seek vs offset scan).

### 6.2 Offset-Based (Secondary)

**Used for:** Admin endpoints where deep pagination is needed.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `offset` | Integer | 0 | Records to skip |
| `limit` | Integer | 20 | Records per page (1-100) |

**Response meta:** `total_count`, `offset`, `limit`.

### 6.3 Pagination Rules

- Default page size: 20, Maximum: 100
- Empty collections: `data: []`, `has_more: false`
- Cursors are opaque strings (clients must not parse)
- Cursors expire after 24 hours
- Page size 0 rejected with validation error

---

## 7. Filtering Strategy

### 7.1 Query Parameter Filters

| Operator | Syntax | Example |
|---|---|---|
| Equals | `?field=value` | `?account_id=acc_123` |
| Greater than | `?field__gt=value` | `?amount_cents__gt=10000` |
| Less than | `?field__lt=value` | `?amount_cents__lt=50000` |
| Greater or equal | `?field__gte=value` | `?created_at__gte=2026-01-01` |
| Less or equal | `?field__lte=value` | `?created_at__lte=2026-06-30` |
| In list | `?field__in=v1,v2` | `?transfer_status__in=completed,failed` |
| Contains | `?field__contains=value` | `?description__contains=grocery` |
| Starts with | `?field__starts_with=value` | `?merchant_name__starts_with=STAR` |
| Is null | `?field__is_null=true` | `?closed_at__is_null=true` |

### 7.2 Filter Rules

- AND-combined by default
- No OR in query params (use POST search for complex queries)
- Unknown fields ignored (warning in response headers)
- Dates must be ISO 8601
- Enums are case-sensitive

---

## 8. Sorting Strategy

**Format:** `?sort=field` (ascending) or `?sort=-field` (descending). Multi-field: `?sort=-created_at,amount_cents`.

| Endpoint | Default Sort | Rationale |
|---|---|---|
| Transactions | `-posted_at` | Most recent first |
| Transfers | `-initiated_at` | Most recent first |
| Notifications | `-created_at` | Most recent first |
| Audit logs | `-created_at` | Most recent first |

**Rules:** Unknown sort fields rejected. Maximum 3 sort fields. Default sort always applied.

---

## 9. Search Strategy

### 9.1 Simple Search
`GET /resource?search=query` — Case-insensitive partial match on indexed text fields.

### 9.2 Advanced Search
`POST /transactions/search` — Complex queries with multiple conditions, date ranges, text search. Request body with `query`, `filters`, `date_range`, `sort`, `pagination`.

### 9.3 Search Rules
- Min 2 chars, max 200 chars
- Sanitized input (no injection)
- Paginated results (max 100 per page)
- Performance target: < 200ms simple, < 500ms complex
- Search index lags primary data by up to 5 seconds

---

## 10. Error Handling Strategy

### 10.1 Error Code Catalog

**Authentication Errors:**

| Code | HTTP Status | Message |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Email or password is incorrect |
| `ACCOUNT_LOCKED` | 423 | Account locked due to too many failed attempts |
| `ACCOUNT_SUSPENDED` | 403 | Account has been suspended |
| `UNAUTHORIZED` | 401 | Authentication required |
| `TOKEN_EXPIRED` | 401 | Authentication token has expired |
| `INVALID_TOKEN` | 401 | Authentication token is invalid |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token is invalid |
| `REFRESH_TOKEN_EXPIRED` | 401 | Refresh token has expired |
| `REFRESH_TOKEN_USED` | 401 | Refresh token already used (security event) |
| `MFA_REQUIRED` | 428 | Multi-factor authentication required |
| `INVALID_OTP` | 401 | OTP code is incorrect |
| `OTP_EXPIRED` | 401 | OTP code has expired |
| `OTP_MAX_ATTEMPTS` | 429 | Maximum OTP attempts reached |
| `INVALID_TOKEN` | 400 | Reset/verification token is invalid |

**Validation Errors:**

| Code | HTTP Status | Message |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `REQUIRED_FIELD` | 400 | Required field is missing |
| `INVALID_VALUE` | 400 | Field value is invalid |
| `INVALID_FORMAT` | 400 | Field format is incorrect |
| `FIELD_TOO_LONG` | 400 | Field exceeds maximum length |
| `FIELD_TOO_SHORT` | 400 | Field below minimum length |
| `INVALID_ENUM_VALUE` | 400 | Value is not a valid option |
| `DUPLICATE_VALUE` | 409 | Value already exists |

**Business Logic Errors:**

| Code | HTTP Status | Message |
|---|---|---|
| `INSUFFICIENT_BALANCE` | 400 | Available balance is insufficient |
| `TRANSFER_LIMIT_EXCEEDED` | 400 | Transfer exceeds allowed limit |
| `DAILY_LIMIT_EXCEEDED` | 400 | Daily transfer limit reached |
| `ACCOUNT_FROZEN` | 403 | Account is frozen |
| `ACCOUNT_CLOSED` | 403 | Account is closed |
| `ACCOUNT_RESTRICTED` | 403 | Account is restricted |
| `CARD_FROZEN` | 403 | Card is frozen |
| `CARD_DECLINED` | 400 | Card transaction was declined |
| `KYC_REQUIRED` | 400 | KYC verification required |
| `KYC_EXPIRED` | 400 | KYC verification has expired |
| `KYC_UNDER_REVIEW` | 400 | KYC verification is under review |
| `BENEFICIARY_NOT_VERIFIED` | 400 | Beneficiary verification required |
| `BENEFICIARY_HAS_TRANSFERS` | 400 | Beneficiary has active transfers |
| `TRANSFER_CANNOT_CANCEL` | 400 | Transfer cannot be cancelled in current status |
| `SUFFICIENT_BALANCE_REQUIRED` | 400 | Account balance must be zero to close |
| `PENDING_TRANSACTIONS` | 400 | Account has pending transactions |
| `MAX_MFA_METHODS` | 400 | Maximum MFA methods reached |
| `UNSUPPORTED_MFA_METHOD` | 400 | MFA method not supported |
| `EMAIL_NOT_VERIFIED` | 403 | Email verification required |
| `TERMS_NOT_ACCEPTED` | 400 | Terms acceptance required |

**Rate Limiting Errors:**

| Code | HTTP Status | Message |
|---|---|---|
| `RATE_LIMITED` | 429 | Too many requests. Retry after {seconds} |
| `CONCURRENT_REQUEST_LIMIT` | 429 | Too many concurrent requests |

**System Errors:**

| Code | HTTP Status | Message |
|---|---|---|
| `INTERNAL_ERROR` | 500 | An unexpected error occurred |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `PARTNER_UNAVAILABLE` | 502 | External service temporarily unavailable |
| `IDEMPOTENCY_KEY_REQUIRED` | 400 | Idempotency key required for this endpoint |
| `IDEMPOTENCY_KEY_REUSE` | 409 | Idempotency key used with different request |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not supported for this endpoint |
| `NOT_ACCEPTABLE` | 406 | Requested format not supported |
| `UNSUPPORTED_VERSION` | 400 | API version not supported |
| `DEPRECATED_VERSION` | 400 | API version deprecated. Please upgrade |

### 10.2 Error Response Rules

- Every error includes `request_id` for debugging
- `documentation_url` included when available
- `target` field indicates which field/parameter caused the error
- `details` array provides field-level validation errors
- HTTP status code always matches the error category
- Error messages are safe for display (no internal details)
- Internal errors (500) logged server-side with full stack trace; client receives generic message

---

## 11. Validation Strategy

### 11.1 Validation Layers

| Layer | What | Where | Timing |
|---|---|---|---|
| **Format validation** | Data types, required fields, string lengths, email format, phone format | API gateway / request parser | First (cheapest) |
| **Business rule validation** | Balance sufficiency, limit compliance, status eligibility | Application layer | Second |
| **Cross-module validation** | Account existence, user authorization, beneficiary verification | Application layer | Third |
| **External validation** | KYC verification, sanctions screening, address verification | Infrastructure layer | Last (most expensive) |

### 11.2 Validation Rules

- Fail fast: cheapest validation first, most expensive last
- All format errors collected and returned together (not one at a time)
- Business rule errors returned with specific error codes
- Unknown request fields are silently ignored (forward-compatible)
- Optional fields default to sensible values when omitted
- Null and absent are treated identically for optional fields

### 11.3 Field Constraints

| Type | Constraints | Example |
|---|---|---|
| String | Min/max length, pattern, allowed characters | Email: max 254 chars, email pattern |
| Integer | Min/max value | amount_cents: min 1, max 100000000 |
| Decimal | Precision, scale | Use integer cents instead |
| Date/Time | ISO 8601 format, UTC | `2026-07-13T14:30:00Z` |
| Enum | Must match defined values | `card_type` must be `virtual` or `physical` |
| Boolean | true/false only | Not "1", "yes", "true" string |
| Array | Min/max items, item type | `controls` max 20 items |
| Object | Required/optional keys | Varies per endpoint |

---

## 12. Rate Limiting Strategy

### 12.1 Rate Limit Tiers

| Tier | Requests/Minute | Burst | Applies To |
|---|---|---|---|
| **Standard** | 60 | 10 req/sec | General authenticated endpoints |
| **High** | 120 | 20 req/sec | Dashboard, read-heavy endpoints |
| **Strict** | 10 | 3 req/sec | Auth endpoints (login, register, forgot-password) |
| **Transfer** | 30 | 5 req/sec | Transfer initiation, card operations |
| **Admin** | 200 | 30 req/sec | Admin endpoints |
| **Unauthenticated** | 20 | 2 req/sec | Public endpoints (register, login) |

### 12.2 Rate Limit Headers

Every response includes rate limit information in both headers and meta:

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `Retry-After` | Seconds to wait (only on 429 responses) |

### 12.3 Rate Limit Rules

- Rate limits are per-user (authenticated) or per-IP (unauthenticated)
- Successful and failed requests both count toward the limit
- 429 responses include `Retry-After` header
- Rate limit headers included on every response (including 429)
- Separate rate limits for authentication endpoints (prevents brute force)
- Transfer endpoints have independent rate limits (prevents abuse)
- Admin endpoints have higher limits (operational needs)

### 12.4 Rate Limit Response

When rate limited, the response is:

```
HTTP 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please retry after 30 seconds.",
    "retry_after": 30
  }
}
```

---

## 13. API Security

### 13.1 JWT Token Security

**Access Token:**
- Algorithm: RS256 (asymmetric, public/private key pair)
- TTL: 15 minutes
- Payload: user_id, roles, permissions, session_id, iat, exp
- Signed with private key; verified with public key
- Stateless validation (no database lookup required)

**Refresh Token:**
- Opaque random string (not JWT)
- Stored in Redis with TTL
- Single-use with rotation
- Bound to device fingerprint
- 7-day TTL with sliding window

**Token Transmission:**
- Access token in `Authorization: Bearer {token}` header
- Refresh token in request body (for refresh endpoint only)
- Tokens never in URLs (query parameters)

### 13.2 Refresh Token Rotation

```
Client sends refresh token -> Server validates -> Issues new access + refresh token -> Old refresh token invalidated
If old refresh token is reused -> Security event triggered -> All user sessions invalidated -> User notified
```

### 13.3 CSRF Discussion

**Risk:** Cross-Site Request Forgery for cookie-based authentication.

**Mitigation:** FinFlow uses header-based authentication (JWT in Authorization header), not cookies. CSRF attacks require cookie-based auth to work. Since we use Bearer tokens, CSRF is not applicable.

**Additional protection:** If cookies are ever introduced (e.g., for web session), CSRF tokens will be mandatory with double-submit cookie pattern.

### 13.4 CORS Policy

```
Access-Control-Allow-Origin: https://app.finflow.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, X-Request-Id
Access-Control-Expose-Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-Request-Id
Access-Control-Max-Age: 86400
Access-Control-Allow-Credentials: true
```

**Rules:**
- Production: Only `https://app.finflow.com`
- Staging: Staging domain only
- Sandbox: Developer-specified origin
- No wildcard `*` in production

### 13.5 Security Headers

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `0` | Disable XSS auditor (use CSP instead) |
| `Content-Security-Policy` | `default-src 'none'` | Strict CSP |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer control |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Feature restrictions |
| `Cache-Control` | `no-store, no-cache, must-reuse` | Prevent caching of sensitive responses |
| `Pragma` | `no-cache` | Legacy cache prevention |

### 13.6 Request Signing (Future)

For partner API access, request signing will be implemented:

- HMAC-SHA256 signature of request body + timestamp + nonce
- Signature in `X-FinFlow-Signature` header
- Timestamp validation (5-minute window to prevent replay)
- Nonce tracking (prevent request replay)
- API key + secret pair per partner

### 13.7 IP Allowlisting (Future)

For enterprise and admin access:
- Configurable IP allowlist per API key
- IP changes require admin approval with audit trail
- Suspicious IP patterns trigger additional verification

---

## 14. API Documentation Strategy

### 14.1 OpenAPI Specification

FinFlow APIs are documented using OpenAPI 3.1 specification:

- Single OpenAPI spec per API version
- Auto-generated from code annotations (maintained as source of truth)
- Published at `https://api.finflow.com/api/v1/openapi.json`
- Interactive documentation at `https://docs.finflow.com/api`

### 14.2 Documentation Structure

| Section | Content |
|---|---|
| **Getting Started** | Authentication, base URL, common headers, error handling |
| **Authentication** | Complete auth flow, token lifecycle, MFA |
| **Core Resources** | Accounts, Transactions, Transfers, Cards |
| **Financial Intelligence** | Dashboard, Analytics, Insights, Forecasts |
| **Security** | Rate limiting, idempotency, security headers |
| **Changelog** | Version history, breaking changes, migration guides |
| **Sandbox** | Test data, test card numbers, sandbox behavior |

### 14.3 Developer Experience

| Feature | Implementation |
|---|---|
| **Interactive API Explorer** | Try-it-now for every endpoint |
| **Code samples** | Python, JavaScript, Java, cURL |
| **Postman collection** | Importable, auto-updated with each release |
| **SDK** | JavaScript/TypeScript SDK (first-party) |
| **Webhooks** | Event-driven notifications for async operations |
| **Status page** | Real-time API health and incidents |
| **Changelog** | RSS feed and email notifications for API changes |

### 14.4 API Status

| Indicator | Meaning |
|---|---|
| All systems operational | Green |
| Partial system disruption | Yellow |
| Major system outage | Red |

**SLA:** 99.95% uptime for production API. Status page updated within 5 minutes of incident detection.

---

## 15. API Evolution Strategy

### 15.1 Backward Compatibility Rules

**Compatible changes (no version bump):**
- Adding new optional request fields
- Adding new response fields
- Adding new endpoints
- Adding new enum values (clients must handle unknown values)
- Adding new query parameters
- Relaxing validation

**Incompatible changes (require new version):**
- Removing response fields
- Renaming response fields
- Changing field types
- Changing URL structure
- Removing endpoints
- Changing authentication mechanism
- Making optional fields required
- Changing error code semantics

### 15.2 Deprecation Policy

| Step | Action | Timeline |
|---|---|---|
| 1 | Announce deprecation in changelog | At release of new version |
| 2 | Add `Deprecation` header to deprecated endpoints | Immediately |
| 3 | Add `Sunset` header with sunset date | Immediately |
| 4 | Send email notification to registered developers | Immediately |
| 5 | Log usage of deprecated endpoints | Ongoing |
| 6 | Direct outreach to heavy consumers | 3 months before sunset |
| 7 | Return `410 Gone` with migration guide | After sunset date |

### 15.3 Version Lifecycle

```
v1 Released (Current)
    |
    v2 Released -> v1 becomes Supported (12 months)
        |
        v3 Released -> v1 becomes Deprecated (6 months)
            |
            v1 Retired (410 Gone)
```

**Maximum concurrent versions:** 2 (current + one supported)

**Minimum version lifetime:** 18 months (12 months supported + 6 months deprecated)

### 15.4 Migration Strategy

For each version migration:

1. **Migration guide** published at version announcement
2. **Compatibility shim** available (converts v1 requests to v2 format) for 6 months
3. **Automated migration tool** scans client codebase for deprecated patterns
4. **Sandbox v2 environment** available 3 months before v2 launch
5. **Office hours** for developer Q&A during migration period

### 15.5 API Review Board

All API changes go through the API Review Board:

| Reviewer | Responsibility |
|---|---|
| Lead API Architect | Naming consistency, REST compliance, design quality |
| Security Architect | Authentication, authorization, security implications |
| Domain Expert | Business rule accuracy, edge case coverage |
| Developer Advocate | Developer experience, documentation quality |
| Platform Engineer | Performance, scalability, operational impact |

**Review cadence:** Weekly API review sessions. All changes must be approved before merge.

---

## Appendix A: Endpoint Count Summary

| Module | Endpoints | Auth Required | Idempotent |
|---|---|---|---|
| Authentication | 16 | Mixed | Mixed |
| User Management | 7 | Yes | Mixed |
| Profile | 9 | Yes | Mixed |
| KYC | 4 | Yes | Mixed |
| Accounts | 12 | Yes | Mixed |
| Transactions | 6 | Yes | Mixed |
| Money Transfer | 13 | Yes | Mixed |
| Beneficiaries | 6 | Yes | Mixed |
| Cards | 14 | Yes | Mixed |
| Savings | 11 | Yes | Mixed |
| Notifications | 7 | Yes | Mixed |
| Dashboard | 14 | Yes | N/A |
| Reports | 9 | Yes | Mixed |
| Admin | 24 | Yes | Mixed |
| Settings | 4 | Yes | Yes |
| **TOTAL** | **156** | | |

## Appendix B: HTTP Status Code Usage

| Code | Usage |
|---|---|
| 200 OK | Successful GET, PUT, PATCH, DELETE |
| 201 Created | Successful POST (resource created) |
| 202 Accepted | Async operation accepted (report generation) |
| 204 No Content | Successful DELETE with no response body |
| 400 Bad Request | Validation errors, business rule violations |
| 401 Unauthorized | Authentication required or failed |
| 403 Forbidden | Authenticated but not authorized |
| 404 Not Found | Resource does not exist |
| 405 Method Not Allowed | HTTP method not supported |
| 409 Conflict | Idempotency key mismatch, duplicate resource |
| 410 Gone | API version retired |
| 422 Unprocessable Entity | Well-formed request but business logic error |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Unexpected server error |
| 502 Bad Gateway | External service unavailable |
| 503 Service Unavailable | System maintenance or overload |

## Appendix C: Standard Headers

**Request Headers:**

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes* | `Bearer {access_token}` |
| `Content-Type` | Yes | `application/json` |
| `Accept` | No | `application/json` (default) |
| `Idempotency-Key` | Conditional | Required for transfer initiation; optional for other POST |
| `X-Request-Id` | No | Client-provided request ID (generated if absent) |
| `X-Device-Fingerprint` | No | Device identification for fraud detection |

*Except public endpoints.

**Response Headers:**

| Header | Description |
|---|---|
| `X-Request-Id` | Server-generated request identifier |
| `X-RateLimit-Limit` | Rate limit maximum |
| `X-RateLimit-Remaining` | Remaining requests |
| `X-RateLimit-Reset` | Window reset timestamp |
| `Deprecation` | Marks deprecated endpoints |
| `Sunset` | Deprecation sunset date |
| `Retry-After` | Seconds to wait (on 429) |
| `Api-Version` | API version that handled the request |

---

*This document is a living artifact. API changes must go through the API Review Board. All breaking changes require 6-month deprecation notice. The OpenAPI specification is the source of truth for endpoint contracts.*
