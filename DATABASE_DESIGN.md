# FinFlow — Database Design Document

**Document Classification:** Confidential — CTO & Data Architecture Review
**Version:** 1.0.0
**Status:** Draft for Review
**Last Updated:** July 2026
**Primary Database:** MySQL 8.x (InnoDB)

---

## Table of Contents

1. [Database Philosophy](#1-database-philosophy)
2. [Entity Identification](#2-entity-identification)
3. [Table Design](#3-table-design)
4. [Relationship Model](#4-relationship-model)
5. [Indexing Strategy](#5-indexing-strategy)
6. [Transaction Strategy](#6-transaction-strategy)
7. [Performance Strategy](#7-performance-strategy)
8. [Security Strategy](#8-security-strategy)
9. [Backup & Recovery](#9-backup--recovery)
10. [Future Evolution](#10-future-evolution)

---

## 1. Database Philosophy

### 1.1 Guiding Principles

Every database design decision in FinFlow is governed by eight principles. These are not aspirational — they are enforced through schema review processes, migration gates, and production monitoring.

#### Principle 1: Data Integrity Above All

**Statement:** The database is the system of record. Every financial number, every balance, every transaction must be accurate, consistent, and recoverable.

**Rationale:** In a banking platform, data integrity is not a feature — it is the foundation. A bug in application code can be fixed and data corrected. Corrupted financial data destroys trust permanently. The database schema, constraints, and transaction strategy must guarantee that financial data is never in an inconsistent state, even during failures, network partitions, or application crashes.

**Enforcement:** Every table has a primary key. Every financial relationship has a foreign key. Every balance mutation is atomic. Every state change is audited.

#### Principle 2: Normalized by Default, Denormalized by Justification

**Statement:** Begin with Third Normal Form (3NF). Denormalize only when profiling proves that normalization creates a performance problem that denormalization solves without introducing data consistency risk.

**Rationale:** Normalization eliminates data redundancy, reduces update anomalies, and ensures that facts are stored in exactly one place. In a financial system, a balance stored in two places will eventually disagree — and that disagreement is a liability. Denormalization is a performance optimization, not a design starting point.

**Enforcement:** Schema reviews require justification for any denormalized column or table. Denormalized data must have a documented synchronization strategy.

#### Principle 3: Immutability for Financial Records

**Statement:** Financial records (transactions, audit entries, balance snapshots) are never updated or deleted. Corrections are recorded as new entries that reference the original.

**Rationale:** Immutability provides an unbreakable audit trail. When a regulator asks "what was the balance on March 15 at 2:47 PM?" the answer must be recoverable from immutable records. Updating financial records destroys the evidentiary chain.

**Enforcement:** Financial tables (transactions, audit entries, balance history) have no UPDATE or DELETE permissions for application roles. Only corrective entries (reversals, adjustments) are permitted.

#### Principle 4: Schema-Per-Domain Isolation

**Statement:** Each bounded context owns its own set of tables. Cross-context data access occurs only through well-defined interfaces, not direct table joins.

**Rationale:** Schema-per-domain isolation enforces the same boundaries at the database level that exist in the application. This also enables future microservice extraction: when a module becomes a service, its tables move to a dedicated database with minimal disruption.

**Enforcement:** Database users are granted access only to their domain's schema. Cross-schema queries are prohibited.

#### Principle 5: Temporal Awareness

**Statement:** Every entity with business significance must track its lifecycle through time. State changes are recorded, not overwritten.

**Rationale:** Banking is a temporal domain. "What is the account status?" is less important than "what was the account status when this transfer was initiated?" Temporal tracking enables point-in-time reconstruction of any business state.

**Enforcement:** Every table with lifecycle states includes created_at, updated_at, and a separate status history table.

#### Principle 6: Soft Delete for Everything, Hard Delete for Nothing

**Statement:** No business data is ever physically deleted from the database. All deletions are logical (soft delete) with the record retained for its full retention period.

**Rationale:** Physical deletion in a financial system is irreversible and destroys audit trails. Regulatory requirements mandate retention of financial records for 7+ years.

**Enforcement:** Application database accounts have no DELETE permission on any table. Deletion is performed only by administrative processes with full audit logging.

#### Principle 7: Explicit Over Implicit at the Schema Level

**Statement:** Every constraint, every default, every rule is explicitly defined in the schema. Application code enforces behavior; the schema guarantees invariants.

**Rationale:** Application code can have bugs. Schema constraints cannot be bypassed. If a balance must never be negative, the schema enforces it.

**Enforcement:** NOT NULL constraints on all non-optional columns. CHECK constraints for value ranges. FOREIGN KEY constraints for all relationships. UNIQUE constraints for all natural keys.

#### Principle 8: Design for Query Patterns, Not Just Data Shape

**Statement:** The schema is designed to support the queries the application actually executes, not just to store data correctly.

**Rationale:** A perfectly normalized schema that requires 12-way joins to render a dashboard is a failed design. Indexing, strategic denormalization, and summary tables are tools to make the data shape match the query patterns.

**Enforcement:** Every new feature requires documentation of expected query patterns before schema changes are approved.

### 1.2 Normalization Strategy

**Target: Third Normal Form (3NF) as the baseline.**

| Normal Form | Application |
|---|---|
| 1NF | All columns contain atomic values; no repeating groups |
| 2NF | No partial dependencies; all non-key columns depend on the entire primary key |
| 3NF | No transitive dependencies; non-key columns depend only on the primary key |

**When denormalization is permitted:**

| Scenario | Denormalization Type | Justification Required |
|---|---|---|
| Dashboard performance | Pre-aggregated summary tables | Query profiling shows join performance is unacceptable |
| Search optimization | Denormalized search tables | Full-text search is a core feature |
| Reporting | Materialized view equivalents | Complex aggregations cannot meet latency requirements |
| Caching layer | Read-optimized projections | Eventual consistency is acceptable |

**Denormalization rules:**
- Every denormalized column must have a documented source of truth
- Synchronization from source must be automated and auditable
- Staleness tolerance must be documented
- Denormalized data must be reconstructable from the source of truth

### 1.3 ACID Strategy

**Atomicity:** Every financial operation executes within a single database transaction. If any part fails, the entire transaction rolls back.

**Consistency:** Foreign key, check, and unique constraints guarantee valid state transitions.

**Isolation:** Read Committed as default. Repeatable Read for financial operations. Serialization for critical operations.

**Durability:** All committed transactions persisted via InnoDB redo log. Replication to read replicas. Point-in-time recovery within retention window.

### 1.4 Referential Integrity

**Foreign keys are mandatory for all relationships.** No exceptions.

- Every foreign key has a named constraint
- CASCADE rules explicitly defined per relationship (see Section 4)
- No cascading deletes on financial tables
- Foreign keys indexed (MySQL InnoDB requirement)

### 1.5 Consistency Model

**Strong consistency** for financial operations (within transaction scope).

**Eventual consistency** for analytical data (read replicas may lag by up to 1 second).

### 1.6 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Tables | snake_case, plural nouns | `accounts`, `transactions` |
| Columns | snake_case | `created_at`, `account_id` |
| Primary keys | `id` (bigint auto-increment) | `id` |
| Foreign keys | `{table_singular}_id` | `account_id`, `user_id` |
| Booleans | `is_` prefix | `is_active`, `is_frozen` |
| Timestamps | `_{action}_at` suffix | `created_at`, `updated_at` |
| Status columns | `{entity}_status` | `account_status`, `transfer_status` |
| Money columns | `_{type}_cents` | `amount_cents`, `balance_cents` |
| Currency columns | `_{type}_currency` | `amount_currency` |
| Indexes | `idx_{table}_{columns}` | `idx_transactions_account_id` |
| Unique indexes | `uniq_{table}_{columns}` | `uniq_users_email` |

**Currency handling:** All monetary values stored as integers in smallest currency unit (cents for USD). Separate currency column with ISO 4217 code. Eliminates floating-point precision issues.

### 1.7 Soft Delete Policy

**Every table has a `deleted_at` timestamp column.**

- `deleted_at IS NULL` = active record
- `deleted_at IS NOT NULL` = soft-deleted record
- Unique constraints apply only to non-deleted records (partial unique index)
- Financial records (transactions, audit entries) are NEVER soft-deleted

**Retention periods by domain:**

| Domain | Active Retention | Soft-Deleted Retention |
|---|---|---|
| Authentication | Account lifetime + 7 years | 30 days (then anonymized) |
| Accounts | Account lifetime + 7 years | 7 years |
| Transactions | 7 years | Never soft-deleted (immutable) |
| Cards | Card lifetime + 7 years | 7 years |
| Notifications | 2 years | 30 days |
| Audit | 7 years minimum | Never (append-only) |
| Analytics | 3 years | 90 days |

### 1.8 Audit Strategy

**Every table with business significance has audit columns:** `created_at`, `updated_at`, `created_by`, `updated_by`, `version` (optimistic concurrency).

**Separate audit trail** for financial operations in a dedicated `audit_entries` table capturing: what changed, when, who, why (correlation ID), and how.

---

## 2. Entity Identification

### 2.1 Complete Schema Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FINFLOW DATABASE SCHEMA MAP                           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  AUTHENTICATION (finflow_auth)         12 tables                 │   │
│  │  users, user_credentials, user_mfa_methods, sessions,            │   │
│  │  devices, trusted_devices, login_attempts, refresh_tokens,       │   │
│  │  roles, permissions, user_roles, role_permissions                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  USER MANAGEMENT (finflow_users)        6 tables                  │   │
│  │  user_profiles, user_addresses, user_preferences,                │   │
│  │  notification_preferences, user_kyc, kyc_documents               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ACCOUNTS (finflow_accounts)            7 tables                  │   │
│  │  customers, accounts, account_holders, account_status_history,   │   │
│  │  holds, account_limits, account_interest_rates                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  TRANSACTIONS (finflow_transactions)    4 tables                  │   │
│  │  transactions, balance_snapshots, transaction_categories,        │   │
│  │  transaction_metadata                                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  TRANSFERS (finflow_transfers)          9 tables                  │   │
│  │  transfers, transfer_status_history, beneficiaries,              │   │
│  │  beneficiary_verifications, recurring_transfers,                 │   │
│  │  recurring_transfer_history, fx_rates, transfer_limits,          │   │
│  │  limit_consumption                                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  CARDS (finflow_cards)                  6 tables                  │   │
│  │  cards, card_status_history, card_controls, card_limits,         │   │
│  │  card_authorizations, card_transactions                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  SAVINGS (finflow_savings)              5 tables                  │   │
│  │  savings_goals, savings_rules, savings_rule_triggers,            │   │
│  │  interest_accruals, interest_rate_history                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  NOTIFICATIONS (finflow_notifications)  3 tables                  │   │
│  │  notifications, notification_templates, notification_delivery_log│   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  AUDIT (finflow_audit)                  3 tables                  │   │
│  │  audit_entries, data_access_log, configuration_change_log        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  FRAUD (finflow_fraud)                  6 tables                  │   │
│  │  fraud_alerts, fraud_cases, fraud_case_events, fraud_rules,      │   │
│  │  fraud_rule_conditions, risk_scores                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  BILLING (finflow_billing)              8 tables                  │   │
│  │  subscription_plans, user_subscriptions, subscription_history,   │   │
│  │  invoices, invoice_line_items, payments, promotional_codes,      │   │
│  │  promotional_code_usage                                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ANALYTICS (finflow_analytics)          8 tables                  │   │
│  │  spending_categories, merchant_directory, daily_spending_summary,│   │
│  │  monthly_spending_summary, budgets, budget_alerts,               │   │
│  │  financial_insights, cash_flow_forecasts                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  SETTINGS (finflow_settings)            6 tables                  │   │
│  │  system_config, feature_flags, tier_config, fee_schedules,       │   │
│  │  limit_config, interest_rate_config                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  REPORTS (finflow_reports)              3 tables                  │   │
│  │  generated_reports, report_schedules, regulatory_filings         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Total Table Count

| Schema | Tables | Purpose |
|---|---|---|
| finflow_auth | 12 | Authentication, authorization, session, device management |
| finflow_users | 6 | User identity, profiles, KYC, preferences |
| finflow_accounts | 7 | Customer records, accounts, ownership, limits |
| finflow_transactions | 4 | Financial records, balance snapshots, categorization |
| finflow_transfers | 9 | Transfer orchestration, beneficiaries, limits, FX |
| finflow_cards | 6 | Card lifecycle, authorizations, controls |
| finflow_savings | 5 | Goals, rules, interest accrual |
| finflow_notifications | 3 | Notification delivery and tracking |
| finflow_audit | 3 | Audit trail, access logging, config changes |
| finflow_fraud | 6 | Alerts, cases, rules, scoring |
| finflow_billing | 8 | Subscriptions, invoices, payments, promotions |
| finflow_analytics | 8 | Spending summaries, budgets, insights, forecasts |
| finflow_settings | 6 | System configuration, feature flags, fee schedules |
| finflow_reports | 3 | Report generation, scheduling, regulatory filings |
| **TOTAL** | **86** | |

---

## 3. Table Design

### 3.1 Authentication Schema (finflow_auth)

#### users

| Attribute | Detail |
|---|---|
| **Purpose** | Foundational identity record for every person on the platform |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | A user represents platform identity distinct from banking relationship (Customer). A user may register without completing KYC. This separation enables the onboarding funnel and regulatory scope management. |
| **Relationships** | One-to-one with `user_profiles`; one-to-many with `user_credentials`, `sessions`, `devices`; many-to-many with `accounts` (through `account_holders`) |
| **Indexes** | PK(id); unique(email); unique(phone_number); index(status); index(created_at) |
| **Unique Constraints** | Email (global, case-insensitive); phone_number (global) |
| **Foreign Keys** | None (root table) |
| **Lifecycle** | Registration → Email/phone verified → KYC completed → Active → Closed → Anonymized |
| **Retention** | Active: account lifetime + 7 years. Soft-deleted: anonymized after 30 days. |
| **Soft Delete** | `deleted_at` column. Authentication disabled for soft-deleted users. |

#### user_credentials

| Attribute | Detail |
|---|---|
| **Purpose** | Authentication secrets (hashed passwords, passkey keys, biometric assertions) |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Supports multiple credential types per user. Passwords stored with bcrypt (cost factor 12). Passkeys stored as WebAuthn public key credentials. |
| **Relationships** | Many-to-one with `users` |
| **Indexes** | PK(id); index(user_id); unique(user_id, credential_type) for active credentials |
| **Unique Constraints** | One active credential per type per user |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Active → Updated (password change) → Revoked → Soft-deleted |
| **Retention** | Follows user retention. Revoked: 90 days for security audit. |
| **Soft Delete** | `deleted_at` column. |

#### user_mfa_methods

| Attribute | Detail |
|---|---|
| **Purpose** | Multi-factor authentication methods registered by users |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Supports TOTP, SMS OTP, email OTP. Maximum 3 active methods per user. Each method verified before activation. |
| **Relationships** | Many-to-one with `users` |
| **Indexes** | PK(id); index(user_id); unique(user_id, method_type) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Pending verification → Verified → Active → Deactivated |
| **Retention** | Follows user retention. Deactivated: 90 days. |
| **Soft Delete** | `deleted_at` column. |

#### sessions

| Attribute | Detail |
|---|---|
| **Purpose** | Active authenticated sessions per user per device |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Device-bound sessions with sliding window expiry. Maximum 3 sessions per device type (mobile, web, tablet). |
| **Relationships** | Many-to-one with `users`; many-to-one with `devices` |
| **Indexes** | PK(id); index(user_id); unique(user_id, device_id, session_type); index(expires_at) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE; `device_id` → `devices.id` ON DELETE CASCADE |
| **Lifecycle** | Created → Active (updated on activity) → Expired → Invalidated → Cleaned up |
| **Retention** | Active: current. Expired: 7 days for audit, then physically deleted. |
| **Soft Delete** | No soft delete. Physically deleted after retention. |

#### devices

| Attribute | Detail |
|---|---|
| **Purpose** | Recognized hardware endpoints used to access FinFlow |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Identified by fingerprint hash. Devices become trusted only through explicit user action. Trust affects session duration and authentication requirements. |
| **Relationships** | Many-to-many with `users` (through `trusted_devices`); one-to-many with `sessions` |
| **Indexes** | PK(id); unique(fingerprint_hash); index(last_seen_at) |
| **Foreign Keys** | None (root table) |
| **Lifecycle** | Detected → Active → Trusted → Revoked → Inactive (90 days) → Removed |
| **Retention** | Active: lifetime + 1 year. Inactive: removed after 90 days. |
| **Soft Delete** | `deleted_at` column. |

#### trusted_devices

| Attribute | Detail |
|---|---|
| **Purpose** | Explicit user trust decisions for specific devices |
| **Primary Key** | `id` — bigint, auto-increment |
| **Relationships** | Many-to-one with `users`; many-to-one with `devices` |
| **Indexes** | PK(id); unique(user_id, device_id); index(user_id) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE; `device_id` → `devices.id` ON DELETE CASCADE |
| **Lifecycle** | Created → Active → Revoked → Removed |
| **Retention** | Follows user retention. |
| **Soft Delete** | `deleted_at` column. |

#### login_attempts

| Attribute | Detail |
|---|---|
| **Purpose** | Authentication attempt log (successful and failed) |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Foundation for brute-force detection, account lockout logic, and fraud pattern detection. Append-only. |
| **Relationships** | Many-to-one with `users` |
| **Indexes** | PK(id); index(user_id); index(user_id, attempted_at) for lockout window; index(ip_address); index(outcome) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Immutable → Archived |
| **Retention** | Successful: 1 year. Failed: 3 years. |
| **Soft Delete** | Never soft-deleted. Append-only. |

#### refresh_tokens

| Attribute | Detail |
|---|---|
| **Purpose** | Refresh token tracking with single-use rotation |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Single-use with rotation. Each use invalidates the old token and issues a new one, preventing refresh token theft. |
| **Relationships** | Many-to-one with `users`; many-to-one with `devices` |
| **Indexes** | PK(id); unique(token_hash); index(user_id); index(expires_at) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE; `device_id` → `devices.id` ON DELETE CASCADE |
| **Lifecycle** | Created → Active → Used (invalidated) → Expired → Cleaned up |
| **Retention** | Used/expired: 30 days for audit. |
| **Soft Delete** | No soft delete. Physically deleted after retention. |

#### roles, permissions, user_roles, role_permissions

| Table | Purpose | Key Relationships |
|---|---|---|
| **roles** | Named permission sets (Admin, Compliance, Support, Customer) | Many-to-many with users and permissions |
| **permissions** | Granular access rights (resource:action format) | Many-to-many with roles |
| **user_roles** | User-to-role assignments (join table) | FK to users (CASCADE), FK to roles (RESTRICT) |
| **role_permissions** | Role-to-permission mappings (join table) | FK to both (CASCADE) |

### 3.2 User Management Schema (finflow_users)

#### user_profiles

| Attribute | Detail |
|---|---|
| **Purpose** | Public-facing identity information |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Non-sensitive user info: display name, profile picture, language, timezone. Separate from `users` (sensitive data) to enable controlled access. |
| **Relationships** | One-to-one with `users` |
| **Indexes** | PK(id); unique(user_id) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE |
| **Lifecycle** | Created → Updated → Anonymized (on user deletion) |
| **Retention** | Follows user retention. Anonymized on deletion. |
| **Soft Delete** | `deleted_at` column. |

#### user_addresses

| Attribute | Detail |
|---|---|
| **Purpose** | Physical addresses for KYC, compliance, and mailing |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Multiple addresses per user (current, previous, mailing). One designated primary. Used for KYC verification and proof of residence. |
| **Relationships** | Many-to-one with `users` |
| **Indexes** | PK(id); index(user_id); index(is_primary) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE |
| **Lifecycle** | Created → Active → Primary → Deprecated → Anonymized |
| **Retention** | Follows user retention. Previous addresses retained for compliance. |
| **Soft Delete** | `deleted_at` column. |

#### user_preferences

| Attribute | Detail |
|---|---|
| **Purpose** | Platform settings configured by users |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Key-value store for preferences: display_currency, date_format, language, theme, accessibility_settings. |
| **Relationships** | Many-to-one with `users` |
| **Indexes** | PK(id); unique(user_id, preference_key) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE |
| **Lifecycle** | Created (defaults) → Updated → Anonymized |
| **Retention** | Follows user retention. |
| **Soft Delete** | `deleted_at` column. |

#### notification_preferences

| Attribute | Detail |
|---|---|
| **Purpose** | User-configured notification channel and frequency settings |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Per-notification-type configuration: push, SMS, email enabled/disabled, frequency. Critical notifications (fraud) bypass user preferences. |
| **Relationships** | Many-to-one with `users` |
| **Indexes** | PK(id); unique(user_id, notification_type) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE CASCADE |
| **Lifecycle** | Created (defaults) → Updated → Anonymized |
| **Retention** | Follows user retention. |
| **Soft Delete** | `deleted_at` column. |

#### user_kyc

| Attribute | Detail |
|---|---|
| **Purpose** | KYC verification records |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Tracks the KYC process: document submissions, verification status, risk rating, expiration. Required before account activation. Different KYC levels unlock different products. |
| **Relationships** | One-to-one with `users`; one-to-many with `kyc_documents` |
| **Indexes** | PK(id); unique(user_id); index(verification_status); index(risk_rating) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Pending → Submitted → Under review → Approved/Rejected → Refresh → Expired |
| **Retention** | Active: lifetime + 7 years. Rejected: 7 years. |
| **Soft Delete** | Never soft-deleted (regulatory requirement). |

#### kyc_documents

| Attribute | Detail |
|---|---|
| **Purpose** | Identity document metadata (files stored in S3) |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Database stores metadata only; actual documents in encrypted object storage. Types: passport, driver's license, utility bill, bank statement. |
| **Relationships** | Many-to-one with `user_kyc` |
| **Indexes** | PK(id); index(kyc_record_id); index(document_type); index(verification_status) |
| **Foreign Keys** | `kyc_record_id` → `user_kyc.id` ON DELETE RESTRICT |
| **Lifecycle** | Uploaded → Pending → Verified/Rejected → Retained |
| **Retention** | 7 years after KYC expiration or account closure. |
| **Soft Delete** | Never soft-deleted (regulatory). |

### 3.3 Accounts Schema (finflow_accounts)

#### customers

| Attribute | Detail |
|---|---|
| **Purpose** | Verified banking relationship between a user and FinFlow |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Created at KYC approval. Carries risk profile, product eligibility, relationship history. Distinct from User for regulatory and data model separation. |
| **Relationships** | One-to-one with `users`; one-to-many with `accounts` (through `account_holders`) |
| **Indexes** | PK(id); unique(user_id); index(risk_rating); index(created_at) |
| **Foreign Keys** | `user_id` → `users.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Active → Flagged for review → Dormant → Closed |
| **Retention** | Active: lifetime + 7 years. Closed: 7 years. |
| **Soft Delete** | `deleted_at` column. Anonymized after retention. |

#### accounts

| Attribute | Detail |
|---|---|
| **Purpose** | Financial accounts — containers for money with defined rules |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | The central entity. Type (checking, savings, business), status (pending, active, restricted, suspended, closed), currency. Stores `ledger_balance` and `available_balance` (ledger minus holds). Account number is a separate, user-facing identifier. |
| **Relationships** | Many-to-one with `customers` (through `account_holders`); one-to-many with `transactions`, `holds`, `account_status_history` |
| **Indexes** | PK(id); unique(account_number); index(customer_id); index(account_type); index(account_status); index(created_at) |
| **Foreign Keys** | `customer_id` → `customers.id` ON DELETE RESTRICT |
| **Lifecycle** | Created (Pending) → Funded (Active) → Active → Restricted → Suspended → Closed |
| **Retention** | Active: lifetime + 7 years. Closed: 7 years. |
| **Soft Delete** | `deleted_at` column. |

#### account_holders

| Attribute | Detail |
|---|---|
| **Purpose** | Maps customers to accounts with ownership type |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Supports primary owner, joint owners, and authorized users. Many-to-many resolution between customers and accounts. |
| **Relationships** | Many-to-one with `customers`; many-to-one with `accounts` |
| **Indexes** | PK(id); unique(account_id, customer_id); index(customer_id); index(ownership_type) |
| **Foreign Keys** | `customer_id` → `customers.id` ON DELETE RESTRICT; `account_id` → `accounts.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Active → Removed (joint dissolution) |
| **Retention** | Follows account retention. |
| **Soft Delete** | `deleted_at` column. |

#### account_status_history

| Attribute | Detail |
|---|---|
| **Purpose** | Immutable log of account status transitions |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Records: previous status, new status, timestamp, reason, initiator. Essential for regulatory examination. |
| **Relationships** | Many-to-one with `accounts` |
| **Indexes** | PK(id); index(account_id); index(changed_at) |
| **Foreign Keys** | `account_id` → `accounts.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Immutable |
| **Retention** | 7 years minimum. |
| **Soft Delete** | Never. Append-only. |

#### holds

| Attribute | Detail |
|---|---|
| **Purpose** | Temporary balance restrictions |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Reduce available balance without changing ledger balance. Types: card authorization, pending transfer, fraud hold, regulatory hold. Each has amount, reason, source, and optional expiry. |
| **Relationships** | Many-to-one with `accounts` |
| **Indexes** | PK(id); index(account_id); index(status); index(expires_at); index(source_type, source_id) |
| **Foreign Keys** | `account_id` → `accounts.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Active → Released/Expired |
| **Retention** | 2 years for released/expired. |
| **Soft Delete** | Never. Status changes to 'released' or 'expired'. |

#### account_limits, account_interest_rates

| Table | Purpose | Key Design |
|---|---|---|
| **account_limits** | Configurable transfer limits per account | Unique on (account_id, limit_type, period). Created at account opening with defaults. |
| **account_interest_rates** | Interest rate configuration for savings | Append-only history with effective date ranges. Rate changes create new records. |

### 3.4 Transactions Schema (finflow_transactions)

#### transactions

| Attribute | Detail |
|---|---|
| **Purpose** | Immutable records of every financial event affecting account balance |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Every debit, credit, hold, reversal, fee, interest accrual is a Transaction. Immutable once posted. Corrections are new reversal transactions. Records: amount (cents), currency, type, category, source, running balance. |
| **Relationships** | Many-to-one with `accounts`; one-to-many with `transaction_categories`, `transaction_metadata` |
| **Indexes** | PK(id); index(account_id); index(transaction_type); index(posted_at); index(account_id, posted_at) for chronological; index(source_type, source_id) |
| **Foreign Keys** | `account_id` → `accounts.id` ON DELETE RESTRICT |
| **Lifecycle** | Created (initiated) → Posted (settled) → Disputed → Archived |
| **Retention** | 7 years minimum. Active: 3 years in primary. Archived: 4+ years. |
| **Soft Delete** | Never. Immutable. Status changes from 'pending' to 'posted' only. |

#### balance_snapshots

| Attribute | Detail |
|---|---|
| **Purpose** | Point-in-time balance records |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Captures balance at specific moments: end of day, before/after large transactions. Enables historical balance queries without recalculating. Taken daily minimum. |
| **Relationships** | Many-to-one with `accounts` |
| **Indexes** | PK(id); unique(account_id, snapshot_date); index(snapshot_date) |
| **Foreign Keys** | `account_id` → `accounts.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → Immutable |
| **Retention** | 7 years minimum. Active: 3 years. |
| **Soft Delete** | Never. Immutable. |

#### transaction_categories

| Attribute | Detail |
|---|---|
| **Purpose** | Spending category assignments for transactions |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Auto-categorized (merchant matching + ML) with user override capability. User overrides take priority. |
| **Relationships** | Many-to-one with `transactions` |
| **Indexes** | PK(id); unique(transaction_id, source); index(category_id) |
| **Foreign Keys** | `transaction_id` → `transactions.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → May be updated (override) → Immutable after confirmation |
| **Retention** | Follows transaction retention. |
| **Soft Delete** | Never. Changes create new records. |

#### transaction_metadata

| Attribute | Detail |
|---|---|
| **Purpose** | Extended semi-structured transaction information |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | JSON column for merchant details, location data, receipt images, custom tags. Provides flexibility without sacrificing normalized core. |
| **Relationships** | Many-to-one with `transactions` |
| **Indexes** | PK(id); unique(transaction_id); MySQL generated column indexes on frequently queried JSON paths |
| **Foreign Keys** | `transaction_id` → `transactions.id` ON DELETE RESTRICT |
| **Lifecycle** | Created → May be updated (additional details) |
| **Retention** | Follows transaction retention. |
| **Soft Delete** | Never. |

### 3.5 Transfers Schema (finflow_transfers)

#### transfers

| Attribute | Detail |
|---|---|
| **Purpose** | Orchestration records for money movement |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Represents the complete orchestration: validation, limit checking, fraud scoring, settlement, status tracking. A completed transfer generates at least two transactions (debit + credit). |
| **Relationships** | Many-to-one with `accounts` (source + destination); many-to-one with `beneficiaries`; one-to-many with `transfer_status_history`; many-to-one with `fx_rates` |
| **Indexes** | PK(id); index(source_account_id); index(destination_account_id); index(transfer_status); index(transfer_type); index(source_account_id, initiated_at); unique(correlation_id) |
| **Foreign Keys** | `source_account_id` → `accounts.id` RESTRICT; `destination_account_id` → `accounts.id` RESTRICT; `beneficiary_id` → `beneficiaries.id` SET NULL |
| **Lifecycle** | Initiated → Validated → Processing → Completed/Failed/Reversed |
| **Retention** | 7 years minimum. Active: 3 years. |
| **Soft Delete** | Never. Immutable once created. |

#### transfer_status_history

| Attribute | Detail |
|---|---|
| **Purpose** | Immutable transfer lifecycle transition log |
| **Relationships** | Many-to-one with `transfers` |
| **Indexes** | PK(id); index(transfer_id); index(changed_at) |
| **Foreign Keys** | `transfer_id` → `transfers.id` RESTRICT |
| **Retention** | 7 years minimum. |
| **Soft Delete** | Never. Append-only. |

#### beneficiaries

| Attribute | Detail |
|---|---|
| **Purpose** | Saved transfer recipients |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Trusted recipients with account details. First transfers may have holding periods. Beneficiaries accumulate trust over time. |
| **Relationships** | Many-to-one with `customers`; one-to-many with `beneficiary_verifications`, `transfers` |
| **Indexes** | PK(id); index(customer_id); index(status) |
| **Foreign Keys** | `customer_id` → `customers.id` RESTRICT |
| **Lifecycle** | Added → Pending verification → Active → Deactivated → Removed |
| **Retention** | Follows customer retention. Inactive: 7 years. |
| **Soft Delete** | `deleted_at` column. |

#### beneficiary_verifications, recurring_transfers, recurring_transfer_history, fx_rates, transfer_limits, limit_consumption

| Table | Purpose | Key Design |
|---|---|---|
| **beneficiary_verifications** | Verification records for beneficiary details | Micro-deposit or partner bank verification. |
| **recurring_transfers** | Scheduled recurring transfer configs | Links to source account + beneficiary. Tracks next execution date. |
| **recurring_transfer_history** | Execution history for recurring transfers | Links to parent config + resulting transfer. |
| **fx_rates** | Exchange rate snapshots at transfer initiation | Immutable. Source/target currency, rate, provider, validity window. |
| **transfer_limits** | Configurable transfer limits per account | Unique on (account_id, limit_type, period). |
| **limit_consumption** | Cumulative transfer amounts within periods | Unique on (account_id, limit_type, period_start). Resets at period boundaries. |

### 3.6 Cards Schema (finflow_cards)

#### cards

| Attribute | Detail |
|---|---|
| **Purpose** | Payment card records (virtual and physical) |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Tracks type, status, linked account, tokenized PAN (actual number at processor), expiry. Independent limits and controls from linked account. |
| **Relationships** | Many-to-one with `accounts`; one-to-many with `card_status_history`, `card_controls`, `card_limits`, `card_authorizations`, `card_transactions` |
| **Indexes** | PK(id); unique(tokenized_pan); index(account_id); index(card_status); index(card_type) |
| **Foreign Keys** | `account_id` → `accounts.id` RESTRICT |
| **Lifecycle** | Issued → Activated → Active → Frozen → Replaced → Closed |
| **Retention** | Card lifetime + 7 years. |
| **Soft Delete** | `deleted_at` column. |

#### card_authorizations

| Attribute | Detail |
|---|---|
| **Purpose** | Real-time authorization request records from card network |
| **Primary Key** | `id` — bigint, auto-increment |
| **Business Description** | Every card transaction generates an authorization before settlement. Records: merchant, amount, decision, decline reason, processing time. Creates holds on linked account. |
| **Relationships** | Many-to-one with `cards` |
| **Indexes** | PK(id); index(card_id); index(authorization_status); index(merchant_id); index(authorized_at); index(card_id, authorized_at) |
| **Foreign Keys** | `card_id` → `cards.id` RESTRICT |
| **Lifecycle** | Requested → Approved/Declined → Reversed → Settled |
| **Retention** | Approved: 3 years. Declined: 5 years. |
| **Soft Delete** | Never. Financial record. |

#### card_transactions

| Attribute | Detail |
|---|---|
| **Purpose** | Settled card transactions (post-authorization) |
| **Primary Key** | `id` — bigint, auto-increment |
| **Relationships** | Many-to-one with `cards`; one-to-one with `card_authorizations`; one-to-one with `transactions` |
| **Indexes** | PK(id); index(card_id); index(transaction_id); index(settled_at); index(card_id, settled_at) |
| **Foreign Keys** | `card_id` → `cards.id` RESTRICT; `authorization_id` → `card_authorizations.id` RESTRICT; `transaction_id` → `transactions.id` RESTRICT |
| **Lifecycle** | Created (at settlement) → Immutable |
| **Retention** | 7 years. |
| **Soft Delete** | Never. |

#### card_controls, card_limits, card_status_history

| Table | Purpose | Key Design |
|---|---|---|
| **card_controls** | User-configurable restrictions (MCC blocks, geographic, time-based) | Evaluated in priority order during authorization. |
| **card_limits** | Per-card spending limits | Unique on (card_id, limit_type, period). Independent of account limits. |
| **card_status_history** | Immutable card status transition log | Append-only. |

### 3.7 Savings Schema (finflow_savings)

#### savings_goals, savings_rules, savings_rule_triggers, interest_accruals, interest_rate_history

| Table | Purpose | Key Design |
|---|---|---|
| **savings_goals** | User-defined savings targets | Links to account + customer. Tracks progress toward target. Status: InProgress/Achieved/Closed. |
| **savings_rules** | Automated savings configurations | Links to goal. Types: round-up, percentage, recurring. JSON configuration for flexibility. |
| **savings_rule_triggers** | Execution log for rule triggers | Links to rule + resulting transfer. Append-only audit trail. |
| **interest_accruals** | Daily interest calculation records | Unique on (account_id, accrual_date). Posted monthly as credit transaction. |
| **interest_rate_history** | Historical rate changes | Append-only with effective date ranges. |

### 3.8 Notifications Schema (finflow_notifications)

| Table | Purpose | Key Design |
|---|---|---|
| **notifications** | Notification records | Links to user. Tracks type, channel, status. Critical notifications use multiple channels. |
| **notification_templates** | Reusable message templates | Versioned (template_name, version). Variable placeholders. |
| **notification_delivery_log** | Per-channel delivery tracking | Independent status per channel per notification. |

### 3.9 Audit Schema (finflow_audit)

| Table | Purpose | Key Design |
|---|---|---|
| **audit_entries** | Immutable business operation records | Append-only. Polymorphic references (entity_type + entity_id). 7 year minimum retention. |
| **data_access_log** | Who accessed what user data | GDPR compliance. Accessor, data, purpose, timestamp. |
| **configuration_change_log** | System configuration changes | Before/after values. Who changed and when. |

### 3.10 Fraud Schema (finflow_fraud)

| Table | Purpose | Key Design |
|---|---|---|
| **fraud_alerts** | Suspicious activity notifications | Priority, SLA deadline, assigned analyst. References triggered entities. |
| **fraud_cases** | Investigation records | Aggregates related alerts and evidence. Status workflow. |
| **fraud_case_events** | Case timeline entries | Immutable investigation log. |
| **fraud_rules** | Configurable detection rules | JSON conditions. Admin-configurable without deployment. |
| **fraud_rule_conditions** | Individual rule conditions | Links to parent rule. CASCADE on rule deletion. |
| **risk_scores** | Transaction/activity risk scores | Polymorphic references. Model version and contributing factors. |

### 3.11 Billing Schema (finflow_billing)

| Table | Purpose | Key Design |
|---|---|---|
| **subscription_plans** | Available subscription tiers | Versioned. Existing subscribers retain plan version. |
| **user_subscriptions** | Active subscription records | Unique active subscription per user per status. Tracks billing period and payment method. |
| **subscription_history** | Subscription lifecycle log | Immutable change log. |
| **invoices** | Billing documents | Sequential invoice numbers. Status: pending/paid/overdue/voided. |
| **invoice_line_items** | Invoice detail records | Base subscription, add-ons, prorations, credits. |
| **payments** | Payment processing records | Gateway reference for idempotency. Failed payments trigger dunning. |
| **promotional_codes** | Discount configurations | Unique code. Validity period and usage limits. |
| **promotional_code_usage** | Code redemption tracking | Prevents reuse beyond limits. |

### 3.12 Analytics Schema (finflow_analytics)

| Table | Purpose | Key Design |
|---|---|---|
| **spending_categories** | Category taxonomy | Hierarchical (parent-child). Self-referencing FK. |
| **merchant_directory** | Merchant-to-category mappings | Fulltext index on merchant name. MCC code index. |
| **daily_spending_summary** | Pre-aggregated daily spending | Denormalized. Unique on (account_id, category_id, date). Nightly batch. |
| **monthly_spending_summary** | Pre-aggregated monthly spending | Monthly rollup of daily summaries. |
| **budgets** | User-defined spending budgets | Links to customer + optional category. Alert thresholds. |
| **budget_alerts** | Budget threshold notifications | Unique per budget per threshold per period. |
| **financial_insights** | Generated user insights | AI/ML-generated. Type, relevance score, expiry. |
| **cash_flow_forecasts** | Predicted future balances | Daily predictions with confidence intervals. |

### 3.13 Settings & Reports Schemas

| Table | Purpose | Key Design |
|---|---|---|
| **system_config** | Global configuration key-value | Unique key. All changes logged. |
| **feature_flags** | Feature toggle states | Unique flag name. Percentage rollout support. |
| **tier_config** | Subscription tier feature mappings | Unique on (plan_id, feature_code). |
| **fee_schedules** | Fee configuration | Versioned with validity periods. |
| **limit_config** | Default limit configurations | Unique on (account_type, tier, limit_type). |
| **interest_rate_config** | Interest rate configurations | Balance tier ranges with validity periods. |
| **generated_reports** | Report generation queue/results | Type, status, file reference. |
| **report_schedules** | Recurring report configs | Frequency, delivery method, recipients. |
| **regulatory_filings** | CTR, SAR compliance filings | Never purged. Indefinite retention. |

---

## 4. Relationship Model

### 4.1 Cascade Rules by Domain

| Relationship | Rule | Rationale |
|---|---|---|
| Account → Transaction | RESTRICT | Financial integrity; accounts with transactions cannot be deleted |
| Account → Hold | RESTRICT | Holds must be resolved before account closure |
| Account → Status History | RESTRICT | Audit trail preservation |
| User → Session | CASCADE | Sessions lifecycle-bound to user |
| User → Refresh Token | CASCADE | Tokens lifecycle-bound to user |
| User → Preference | CASCADE | User-specific configuration |
| Transfer → Status History | RESTRICT | Audit trail preservation |
| Card → Authorization | RESTRICT | Financial records preservation |
| Card → Card Transaction | RESTRICT | Financial records preservation |
| Subscription → Invoice | RESTRICT | Financial records preservation |
| Invoice → Payment | RESTRICT | Financial records preservation |
| Beneficiary → Transfer | RESTRICT | Transfers reference beneficiaries |
| Fraud Rule → Condition | CASCADE | Conditions belong to rule |
| Notification → Delivery Log | RESTRICT | Delivery audit trail |

### 4.2 Referential Integrity Strategy

```
┌──────────────────────────────────────────────────────────────────┐
│              REFERENTIAL INTEGRITY LAYERS                         │
│                                                                    │
│  Layer 1: Database Constraints                                    │
│  ├── All foreign keys at schema level                            │
│  ├── NOT NULL on mandatory references                            │
│  ├── UNIQUE on natural keys                                      │
│  └── CHECK on value ranges                                       │
│                                                                    │
│  Layer 2: Application Validation                                  │
│  ├── Business rules before database write                        │
│  ├── Cross-aggregate consistency                                 │
│  └── Idempotency keys prevent duplicates                         │
│                                                                    │
│  Layer 3: Background Verification                                 │
│  ├── Nightly consistency checks                                  │
│  ├── Orphan detection and reporting                              │
│  └── Balance reconciliation                                      │
│                                                                    │
│  Layer 4: Audit Trail                                             │
│  ├── Every state change recorded                                 │
│  ├── Immutable audit entries                                     │
│  └── Regulatory examination support                              │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 Foreign Key Policy

- **Financial tables:** RESTRICT only. No CASCADE deletes. No CASCADE updates.
- **User-scoped tables:** CASCADE on user deletion (sessions, preferences, tokens).
- **Reference data:** No foreign keys (fee schedules, interest rate configs).
- **Audit tables:** RESTRICT. Append-only. No deletes of any kind.
- **Foreign keys are never updated.** Key changes create new records.

---

## 5. Indexing Strategy

### 5.1 Authentication Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| users | uniq_users_email | email (unique) | Login by email |
| users | uniq_users_phone | phone_number (unique) | Login by phone |
| users | idx_users_status | status | Active user queries |
| user_credentials | idx_uc_user_id | user_id | Credential lookup |
| user_mfa_methods | uniq_umfam_user_type | user_id, method_type (unique) | Active MFA lookup |
| sessions | uniq_sessions_user_device | user_id, device_id (unique) | Session deduplication |
| sessions | idx_sessions_expires | expires_at | Cleanup job |
| login_attempts | idx_la_user_time | user_id, attempted_at | Brute force detection |
| login_attempts | idx_la_ip | ip_address | IP-based fraud detection |
| refresh_tokens | uniq_rt_token | token_hash (unique) | Token validation |
| refresh_tokens | idx_rt_expires | expires_at | Cleanup job |

### 5.2 Transaction Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| transactions | idx_txn_account_time | account_id, posted_at | Account history (chronological) |
| transactions | idx_txn_type | transaction_type | Debit/credit filter |
| transactions | idx_txn_source | source_type, source_id | Link to originating entity |
| balance_snapshots | uniq_bs_account_date | account_id, snapshot_date (unique) | Daily balance lookup |
| transaction_categories | idx_tc_transaction | transaction_id | Category by transaction |
| transaction_categories | idx_tc_category | category_id | Transactions by category |

### 5.3 Transfer & Card Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| transfers | idx_xfer_source_time | source_account_id, initiated_at | Source account history |
| transfers | idx_xfer_status | transfer_status | Status filter |
| transfers | uniq_xfer_correlation | correlation_id (unique) | Idempotency check |
| limit_consumption | uniq_lc_account_type_period | account_id, limit_type, period_start (unique) | Limit check |
| cards | idx_cards_account | account_id | Cards by account |
| cards | uniq_cards_token | tokenized_pan (unique) | Card lookup |
| card_authorizations | idx_ca_card_time | card_id, authorized_at | Authorization history |
| card_transactions | idx_ct_auth | authorization_id (unique) | Auth-to-settlement link |

### 5.4 Dashboard & Analytics Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| transactions | idx_txn_account_posted_covering | account_id, posted_at, amount_cents, transaction_type | Dashboard feed (covering) |
| daily_spending_summary | idx_dss_account_date | account_id, summary_date | Dashboard summary |
| daily_spending_summary | idx_dss_category_date | category_id, summary_date | Category trends |
| monthly_spending_summary | idx_mss_account_year | account_id, summary_year | Annual comparison |
| cash_flow_forecasts | idx_cff_account_date | account_id, forecast_date | Forecast lookup |

### 5.5 Search Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| transactions | FULLTEXT idx_txn_fulltext | description, merchant_name | Transaction text search |
| merchant_directory | FULLTEXT idx_merch_name | merchant_name | Merchant search |
| beneficiaries | idx_ben_name | customer_id, name | Beneficiary search |
| audit_entries | FULLTEXT idx_ae_fulltext | entity_type, action, old_values, new_values | Audit search |

### 5.6 Fraud Detection Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| fraud_alerts | idx_fa_status_priority | alert_status, priority, created_at | Alert queue |
| fraud_alerts | idx_fa_sla | sla_deadline, alert_status | SLA monitoring |
| risk_scores | idx_rs_entity | entity_type, entity_id, scored_at | Score history |
| card_authorizations | idx_ca_card_time_amount | card_id, authorized_at, amount_cents | Velocity check |

### 5.7 Admin Indexing

| Table | Index | Columns | Purpose |
|---|---|---|---|
| audit_entries | idx_ae_entity | entity_type, entity_id | Entity audit trail |
| audit_entries | idx_ae_actor | actor_id, created_at | User activity audit |
| audit_entries | idx_ae_time | created_at | Time-range queries |
| data_access_log | idx_dal_user | user_id, accessed_at | Data access audit |
| configuration_change_log | idx_ccl_key | config_key, changed_at | Config change history |

---

## 6. Transaction Strategy

### 6.1 ACID Implementation

**Atomicity:** Every financial operation in a single BEGIN/COMMIT block. Failure rolls back entire transaction.

**Consistency:** Foreign key, check, and unique constraints enforce valid state transitions.

**Isolation:** Configured per operation type (see 6.2).

**Durability:** InnoDB redo log + binary log for replication and PITR.

### 6.2 Isolation Levels

| Operation Type | Isolation Level | Rationale |
|---|---|---|
| General reads | READ COMMITTED | Better concurrency for most queries |
| Financial reads | REPEATABLE READ | Consistent reads for balance + transfer |
| Critical operations | SERIALIZABLE | Account creation, large transfers |
| Analytical queries | READ COMMITTED (replicas) | Concurrency preferred |

**MySQL note:** InnoDB defaults to REPEATABLE READ with gap locking, providing phantom protection at that level.

### 6.3 Locking Strategy

**Row-level locking (default):** Only affected rows locked.

**Explicit locking for critical operations:**

| Operation | Lock Type | Rationale |
|---|---|---|
| Balance debit | SELECT ... FOR UPDATE | Prevent concurrent overspending |
| Limit consumption | SELECT ... FOR UPDATE | Prevent limit bypass |
| Card authorization | SELECT ... FOR UPDATE on card | Prevent limit bypass |
| Account status change | SELECT ... FOR UPDATE | Prevent conflicting transitions |
| Subscription activation | SELECT ... FOR UPDATE | Prevent duplicates |

### 6.4 Optimistic vs Pessimistic Locking

| Strategy | Used For | Tables |
|---|---|---|
| **Optimistic** | Low contention, non-financial | user_profiles, user_preferences, card_controls, budgets, system_config |
| **Pessimistic** | High contention, financial | accounts, transfer_limits, card_limits, limit_consumption |

### 6.5 Deadlock Prevention

1. **Consistent lock ordering:** Source account always locked before destination
2. **Minimal lock scope:** Locks acquired as late as possible, held briefly
3. **Lock timeout:** 5-second timeout on all pessimistic locks
4. **Deadlock detection:** MySQL InnoDB automatic detection and rollback
5. **Retry logic:** Max 3 retries with exponential backoff

```
Transaction → Acquire locks in consistent order
    ├── Lock acquired → Proceed
    ├── Lock timeout → Retry (max 3, backoff)
    └── Deadlock detected → Rollback, retry
All retries exhausted → Alert operations team
```

### 6.6 Transaction Boundaries

| Operation | Scope | Isolation |
|---|---|---|
| User login | Single transaction (attempt + session) | READ COMMITTED |
| Transfer initiation | Single transaction (validate + record + limit) | REPEATABLE READ |
| Transfer completion | Single transaction (debit + credit + status) | REPEATABLE READ |
| Card authorization | Single transaction (card + balance + hold + auth) | REPEATABLE READ |
| Account creation | Single transaction (account + holder + limits) | SERIALIZABLE |
| Subscription activation | Single transaction (subscription + invoice + payment) | REPEATABLE READ |
| Balance inquiry | Single transaction (read only) | READ COMMITTED |

---

## 7. Performance Strategy

### 7.1 Partitioning

| Table | Partition Strategy | Key | Rationale |
|---|---|---|---|
| transactions | RANGE by month | posted_at | Queries are time-scoped |
| card_authorizations | RANGE by month | authorized_at | Time-scoped |
| audit_entries | RANGE by month | created_at | Time-scoped |
| login_attempts | RANGE by month | attempted_at | Time-scoped |
| balance_snapshots | RANGE by month | snapshot_date | Time-scoped |
| notifications | RANGE by month | created_at | Time-scoped |

**Maintenance:** Monthly partitions auto-created. Old partitions archived to cold storage. Every query on partitioned tables must include the partition key (enforced).

### 7.2 Archiving

| Data Age | Location | Access |
|---|---|---|
| 0-3 years | Primary MySQL | Full query, indexed |
| 3-5 years | Read replica / warm storage | Read-only, indexed |
| 5-7 years | Archive storage (S3) | On-demand, compliance |
| Beyond 7 years | Purged (except regulatory permanent) | N/A |

### 7.3 Pagination

**Cursor-based pagination (mandatory for all user-facing lists):**
- Accepts cursor (last seen ID or timestamp)
- Returns fixed page size (default 20, max 100)
- Includes `has_more` flag and next cursor
- Consistent performance regardless of page depth
- No skipped/duplicate records during concurrent writes

### 7.4 Batch Processing

| Job | Schedule | SLA |
|---|---|---|
| Daily spending summary | Nightly | Before 6 AM UTC |
| Monthly spending summary | 1st of month | Before 1 AM UTC |
| Interest accrual | Daily | Before 6 AM UTC |
| Balance snapshot | Daily | Before 6 AM UTC |
| Session cleanup | Hourly | Within 1 hour |
| Report generation | As scheduled | Within 4 hours |
| Cash flow forecast | Daily | Before 6 AM UTC |

### 7.5 Connection Pooling

| Parameter | Value |
|---|---|
| Minimum connections | 10 |
| Maximum connections | 100 |
| Connection timeout | 30 seconds |
| Idle timeout | 300 seconds |
| Max lifetime | 1800 seconds |
| Validation query | SELECT 1 |

**Per-schema pools:** Each domain schema has its own connection pool and credentials for isolation.

### 7.6 Query Optimization

| Query Pattern | Optimization |
|---|---|
| Recent transactions | Covering index on (account_id, posted_at, amount, type) |
| Current balance | Direct read from accounts table |
| Monthly spending | Pre-aggregated daily_spending_summary |
| Merchant search | Fulltext index |
| Savings goals | Direct customer_id index query |
| Active cards | Index on (account_id, card_status) |
| Compliance audit | Partitioned audit_entries with time-range index |

### 7.7 Read Replica Strategy

| Query Type | Target | Rationale |
|---|---|---|
| Financial operations | Primary | Strong consistency required |
| Dashboard reads | Replica (preferred) | Eventual consistency acceptable |
| Search queries | Replica (preferred) | Read-heavy, non-financial |
| Analytics | Replica (preferred) | Heavy aggregations offloaded |
| Admin queries | Replica (preferred) | Operational offloaded |
| Report generation | Replica (preferred) | Heavy reads offloaded |

---

## 8. Security Strategy

### 8.1 Encryption at Rest

| Layer | Method | Scope |
|---|---|---|
| Disk-level | AES-256 (volume encryption) | All database storage |
| Column-level | AES-256-GCM with KMS keys | PII: email, phone, SSN, address |
| Backup | AES-256 with separate key hierarchy | All backup files |
| Object storage | SSE-S3 or SSE-KMS | KYC documents, statements |

### 8.2 Encryption in Transit

| Connection | Protocol | Requirement |
|---|---|---|
| Client → Gateway | TLS 1.3 | Required, min TLS 1.2 |
| Gateway → App | TLS 1.3 | Required |
| App → Database | TLS 1.2+ | Required, certificate verification |
| App → Redis | TLS 1.2+ | Required |
| Database replication | TLS 1.2+ | Required, mutual TLS |

### 8.3 Sensitive Data Classification

| Classification | Examples | Protection |
|---|---|---|
| **Critical** | Passwords, encryption keys, tokens | Encrypted, never logged, never displayed |
| **Sensitive** | SSN, full card numbers, bank accounts | Encrypted, masked in logs, restricted access |
| **PII** | Email, phone, address, DOB | Encrypted, masked in logs, access logged |
| **Internal** | Account numbers, transaction IDs | Not logged plaintext, access logged |
| **Public** | Display name, merchant names | No special protection |

### 8.4 PII Handling

- **Storage:** Column-level encryption with KMS-managed keys
- **Logging:** NEVER in plaintext. Masked (j***@***.com)
- **Access:** Logged in data_access_log. Restricted to authorized roles.
- **Deletion:** Anonymized (not physically deleted). Transaction records retained.

### 8.5 Password Storage

- **Algorithm:** bcrypt, cost factor 12 (~250ms per hash)
- **Properties:** One-way, salted, slow by design
- **Breach check:** HaveIBeenPwned API integration
- **Storage:** Only bcrypt hash in user_credentials. Raw password NEVER stored/logged.

### 8.6 Database Access Audit

- MySQL general query log: DISABLED (contains sensitive data)
- Binary log: ENABLED for replication and PITR
- Application-level audit: All business operations
- Database access: Connections logged (user, timestamp, query count). Slow queries (> 1s) logged with text.

---

## 9. Backup & Recovery

### 9.1 Daily Backup Strategy

| Backup Type | Frequency | RPO |
|---|---|---|
| Full backup | Nightly 2 AM UTC | 24 hours |
| Incremental backup | Every 4 hours | 4 hours |
| Transaction log backup | Continuous | < 1 minute |

### 9.2 Point-in-Time Recovery

**Capability:** Restore to any point within retention window.

**Process:** Restore full backup → Apply incrementals → Apply transaction logs → Verify consistency.

**RPO:** < 1 minute. **RTO:** < 30 minutes.

### 9.3 Disaster Recovery

**Multi-AZ (current):**
- Primary in AZ-A, synchronous standby in AZ-B
- Automated failover (< 30 seconds)
- Zero data loss for AZ failure

**Multi-region (future):**
- Asynchronous cross-region replication
- RPO: < 5 seconds. RTO: < 5 minutes
- Active-passive with automated failover

### 9.4 Backup Retention

| Backup Type | Retention |
|---|---|
| Daily full backups | 30 days |
| Weekly full backups | 12 weeks |
| Monthly full backups | 12 months |
| Transaction logs | 7 days |
| Annual backup | 7 years (regulatory) |

### 9.5 Backup Security

- All backups encrypted with AES-256
- Encryption keys managed through KMS (separate from database keys)
- Backup access restricted to DBA and security teams
- Backup integrity verified monthly through test restores
- Cross-region backup copy for geographic redundancy

---

## 10. Future Evolution

### 10.1 Schema Evolution Without Downtime

**MySQL 8.x online DDL:** Most schema changes can be applied without locking reads or writes:

| Operation | Online in MySQL 8.x | Impact |
|---|---|---|
| Add column (nullable, no default) | Yes | Near zero |
| Add column (with default) | Yes (Instant DDL for some types) | Near zero |
| Add index | Yes (ALGORITHM=INPLACE) | Read performance during build |
| Drop index | Yes | Minimal |
| Modify column type (compatible) | Yes | Minimal |
| Add foreign key | Yes (with caution) | Minimal |
| Rename column | Yes (Instant DDL) | Zero |

**Operations requiring downtime or careful migration:**
- Dropping a column (requires application code migration first)
- Changing a column type incompatibly (requires data migration)
- Splitting a table (requires dual-write migration)

### 10.2 Migration Strategy

**Phase 1: Additive changes (zero downtime)**
- New columns are added as NULLABLE with no default
- New tables are created alongside existing ones
- New indexes are built online
- Application code reads new columns when present, falls back to old

**Phase 2: Data migration (background)**
- Backfill new columns from existing data
- Migrate data to new tables if schema is changing
- Verify data consistency before proceeding

**Phase 3: Application cutover**
- Deploy application code that reads/writes new schema
- Verify correctness in production
- Old columns retained for rollback window (30 days)

**Phase 4: Cleanup**
- Drop old columns after rollback window
- Remove deprecated tables
- Update documentation

### 10.3 Microservice Extraction Preparation

**Schema-per-domain** is already in place. When extracting a module into a microservice:

1. Identify the schema to extract (e.g., finflow_cards)
2. Create a dedicated database for the extracted service
3. Migrate schema and data to the new database
4. Update the monolith to access the new database through the module's public interface
5. Validate in shadow mode (dual-read)
6. Cut over to the new database
7. Remove cross-database access from the monolith

**Prerequisites already satisfied:**
- Schema isolation (each domain has its own schema)
- No cross-schema foreign keys
- Event-driven communication (no direct cross-schema joins)
- Public interfaces defined for each module

### 10.4 Scaling Evolution

| Stage | Strategy | Trigger |
|---|---|---|
| **Current** | Single primary + read replicas | Baseline |
| **Scale reads** | Add read replicas | Read latency > 200ms at p95 |
| **Scale writes** | Partition high-volume tables | Write throughput > 10K TPS |
| **Scale globally** | Multi-region with regional primaries | International user base |
| **Scale completely** | Extract to dedicated databases per service | Module extraction to microservices |

### 10.5 Technology Evolution Path

| Current | Future | Trigger |
|---|---|---|
| MySQL 8.x single instance | MySQL InnoDB Cluster (Group Replication) | High availability requirement |
| Manual schema migrations | Automated migration framework | Team growth, migration complexity |
| Application-level connection pooling | ProxySQL or similar | Connection management at scale |
| Manual partitioning | Automated partition management | Partition count exceeds manual threshold |
| Single-region | Multi-region active-passive | Geographic expansion |
| Application-level audit | Dedicated audit database | Regulatory examination frequency |

### 10.6 Data Platform Evolution

| Phase | Capability | Timeline |
|---|---|---|
| **Phase 1** | Operational database (MySQL) + cache (Redis) | MVP |
| **Phase 2** | Add analytics database (read-optimized projections) | 6 months |
| **Phase 3** | Add data warehouse for complex analytics | 12 months |
| **Phase 4** | Add real-time streaming for ML features | 18 months |
| **Phase 5** | Add data lake for historical analysis and ML training | 24 months |

---

## Appendix A: Table Count Summary

| Schema | Tables | Key Financial Tables |
|---|---|---|
| finflow_auth | 12 | sessions, login_attempts |
| finflow_users | 6 | user_kyc, kyc_documents |
| finflow_accounts | 7 | accounts, holds, account_limits |
| finflow_transactions | 4 | transactions, balance_snapshots |
| finflow_transfers | 9 | transfers, beneficiaries, limit_consumption |
| finflow_cards | 6 | cards, card_authorizations, card_transactions |
| finflow_savings | 5 | savings_goals, interest_accruals |
| finflow_notifications | 3 | notifications, delivery_log |
| finflow_audit | 3 | audit_entries, data_access_log |
| finflow_fraud | 6 | fraud_alerts, fraud_cases, risk_scores |
| finflow_billing | 8 | invoices, payments, subscriptions |
| finflow_analytics | 8 | daily/monthly summaries, budgets |
| finflow_settings | 6 | system_config, feature_flags |
| finflow_reports | 3 | generated_reports, regulatory_filings |
| **TOTAL** | **86** | |

## Appendix B: Financial Record Protection

**Tables that are NEVER soft-deleted or physically deleted:**
- transactions
- balance_snapshots
- audit_entries
- data_access_log
- configuration_change_log
- transfer_status_history
- card_status_history
- account_status_history
- card_authorizations
- card_transactions
- interest_accruals
- regulatory_filings
- login_attempts

**Principle:** Financial records are immutable. Corrections are new entries. History is preserved.

## Appendix C: MySQL 8.x Specific Features Used

| Feature | Purpose |
|---|---|
| InnoDB | ACID transactions, row-level locking, foreign keys |
| JSON columns | Semi-structured data (transaction_metadata, fraud rule conditions) |
| Generated columns | Indexes on JSON paths for query performance |
| Window functions | Complex analytics queries on summary tables |
| CTEs (Common Table Expressions) | Readable recursive queries (category hierarchies) |
| Instant DDL | Zero-downtime column additions |
| Online DDL | Index builds without blocking |
| Partitioning | Time-based table partitioning for performance |
| Group Replication (future) | High availability clustering |
| X Protocol (future) | Document store for flexible data |

---

*This document is a living artifact. Schema changes must go through the Architecture Review Board. All migrations must be reversible and tested in staging before production deployment.*
