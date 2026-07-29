# FinFlow — Domain Model Document

**Document Classification:** Confidential — Domain Modeling Workshop Reference
**Version:** 1.0.0
**Status:** Draft for Review
**Last Updated:** July 2026
**Supersedes:** N/A
**Methodology:** Domain-Driven Design (Eric Evans, Vaughn Vernon)

---

## Table of Contents

1. [Core Domain](#1-core-domain)
2. [Subdomains](#2-subdomains)
3. [Bounded Contexts](#3-bounded-contexts)
4. [Domain Entities](#4-domain-entities)
5. [Value Objects](#5-value-objects)
6. [Aggregates](#6-aggregates)
7. [Domain Services](#7-domain-services)
8. [Domain Events](#8-domain-events)
9. [Ubiquitous Language](#9-ubiquitous-language)
10. [Business Rules](#10-business-rules)
11. [Domain Relationships](#11-domain-relationships)

---

## 1. Core Domain

### 1.1 What is FinFlow's Primary Business Domain?

FinFlow's core domain is **Digital Money Management** — the complete lifecycle of a customer's financial relationship with a banking platform, from account origination through active use to long-term financial health.

More precisely, the core domain is the **intelligent orchestration of money movement and financial awareness** for individuals and small businesses.

### 1.2 Why This is the Core Domain

A banking platform can do many things: issue cards, process loans, generate reports, send notifications. But the singular capability that no competitor can easily replicate — the capability that defines FinFlow's identity and competitive moat — is the **intelligent layer that sits on top of basic banking operations**.

Basic banking operations (holding money, moving money, issuing cards) are table stakes. Every neobank does them. What FinFlow must own as its core differentiator is:

1. **Financial Intelligence** — The ability to understand a user's financial behavior and provide actionable, personalized insights that improve their financial outcomes.
2. **Trust Architecture** — The systematic design of every interaction to build and maintain user trust through transparency, reliability, and security.
3. **Money Orchestration** — The seamless, intelligent routing of money across accounts, institutions, and borders with optimal speed, cost, and safety.

Everything else is either a **supporting capability** (necessary but not differentiating) or a **generic capability** (available as a commodity service).

### 1.3 Strategic Focus

The core domain receives the best engineers, the most architectural investment, and the tightest iteration cycles. Supporting domains receive competent engineering with sensible buy-vs-build decisions. Generic domains are bought or integrated from proven third-party providers.

| Domain Category | Investment Priority | Engineering Focus |
|---|---|---|
| Core Domain | Highest — best engineers, most time | Innovation, differentiation, competitive moat |
| Supporting Domains | Medium — solid engineering, pragmatic decisions | Efficiency, reliability, cost optimization |
| Generic Domains | Lowest — buy/integrate, customize minimally | Integration, configuration, vendor management |

---

## 2. Subdomains

### 2.1 Subdomain Classification

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FINFLOW DOMAIN LANDSCAPE                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    CORE DOMAIN                                  │  │
│  │                                                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │
│  │  │   Account     │  │   Money      │  │  Financial   │         │  │
│  │  │   Management  │  │   Movement   │  │  Intelligence│         │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  SUPPORTING DOMAINS                             │  │
│  │                                                                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │  │
│  │  │ Identity │ │   Card   │ │ Savings  │ │ Billing  │         │  │
│  │  │ & Access │ │ Services │ │ & Goals  │ │ & Revenue│         │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   GENERIC DOMAINS                               │  │
│  │                                                                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │  │
│  │  │Notifi-   │ │  Fraud   │ │  Audit   │ │ KYC &    │         │  │
│  │  │cation    │ │ Detection│ │  & Compl.│ │ Identity │         │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │  │
│  │  ┌──────────┐ ┌──────────┐                                    │  │
│  │  │Document  │ │ Reporting│                                    │  │
│  │  │ Storage  │ │ & Search │                                    │  │
│  │  └──────────┘ └──────────┘                                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Domains

#### Account Management

**Classification:** Core Domain

**Why it is core:** Account Management is the foundational business capability that every other capability depends on. It is not merely "opening an account" — it is the ongoing relationship between FinFlow and the customer's money. The way accounts are structured, the lifecycle states they support, the rules that govern them, and the intelligence applied to them define FinFlow's banking identity.

**Key business capabilities:**
- Account origination (onboarding a new customer's financial relationship)
- Account lifecycle management (active, restricted, suspended, closed)
- Balance management (available balance, held funds, pending transactions)
- Multi-account support (checking, savings, business under one identity)
- Account-level business rules (limits, restrictions, eligibility)

**Why it is not generic:** While "opening a bank account" might seem generic, the rules governing account behavior — how holds work, how balance is calculated, how restrictions are applied, how accounts evolve over time — are deeply business-specific and define the customer experience.

#### Money Movement

**Classification:** Core Domain

**Why it is core:** Money Movement is the primary action users take on the platform. Every transfer, payment, and card transaction is an instance of money moving. The intelligence of how money moves — selecting the optimal path, enforcing limits, ensuring safety, providing visibility — is what separates FinFlow from a basic bank account.

**Key business capabilities:**
- Internal transfers (between own accounts)
- External transfers (ACH, wire, international)
- Peer-to-peer transfers
- Bill payments
- Recurring transfers and scheduled payments
- FX conversion for international transfers
- Transfer limit enforcement and intelligence

**Why it is not generic:** The routing intelligence (which transfer method to use, when to execute for optimal settlement), the limit management (dynamic limits based on account history), and the real-time status tracking are differentiating capabilities.

#### Financial Intelligence

**Classification:** Core Domain

**Why it is core:** This is FinFlow's primary competitive moat. While every bank offers accounts and transfers, very few provide genuinely useful financial intelligence. This domain transforms raw transaction data into actionable financial awareness — the capability that makes FinFlow the user's primary financial relationship.

**Key business capabilities:**
- Spending categorization and analysis
- Budget creation, tracking, and alerting
- Cash flow forecasting
- Savings recommendations
- Financial health scoring
- Personalized insights based on behavioral patterns
- Merchant intelligence and spending comparisons

**Why it is not generic:** This is entirely custom-built, trained on user behavior, and represents the proprietary intelligence layer that improves with every user interaction. No third-party provider offers this at the level FinFlow requires.

### 2.3 Supporting Domains

#### Identity & Access Management

**Classification:** Supporting Domain

**Why it is supporting:** Identity and access management is essential — without it, nothing works — but it is not FinFlow's differentiator. Users do not choose FinFlow because of its login mechanism. They choose it for what they can do once logged in. This domain must be excellent and secure, but it follows industry-standard patterns.

**Key business capabilities:**
- User registration and profile management
- Authentication (password, biometric, passkey)
- Multi-factor authentication
- Session management
- Device management and trusted devices
- Role-based access control
- Password and credential lifecycle

#### Card Services

**Classification:** Supporting Domain

**Why it is supporting:** Card issuance and management is a critical capability, but it follows well-established industry standards (Visa/Mastercard specifications, EMV standards). FinFlow's differentiation is not in how cards work mechanically, but in the intelligent controls and integration with the broader financial platform.

**Key business capabilities:**
- Virtual card issuance and management
- Physical card lifecycle (issuance, activation, replacement, closure)
- Card authorization rules
- Spending limit management per card
- Card controls (merchant category blocks, geographic restrictions)
- Card freeze/unfreeze

#### Savings & Goals

**Classification:** Supporting Domain

**Why it is supporting:** Savings functionality is important for user retention and financial health, but it operates on well-understood financial principles (interest accrual, goal tracking, automated rules). The supporting nature is reflected in its dependency on Account Management and Money Movement.

**Key business capabilities:**
- Savings goal creation and tracking
- Automated savings rules (round-ups, percentage triggers, recurring transfers)
- Interest rate management and accrual
- Regulation D compliance (limited transfers per month)
- Goal achievement notifications and celebrations

#### Billing & Revenue

**Classification:** Supporting Domain

**Why it is supporting:** Billing manages FinFlow's monetization (subscription tiers, premium features, interchange revenue tracking). It is a business operations necessity but is not the product the customer interacts with directly.

**Key business capabilities:**
- Subscription tier management
- Premium feature access control
- Invoice generation
- Payment collection for premium services
- Promotional pricing and credits
- Revenue tracking and reporting

### 2.4 Generic Domains

#### Notification Delivery

**Classification:** Generic Domain

**Why it is generic:** Sending notifications (push, SMS, email) is a solved problem. Multiple vendors provide reliable delivery infrastructure. FinFlow's value is in *what* it notifies about (which is defined in other domains), not *how* it delivers notifications.

**Key business capabilities:**
- Multi-channel delivery (push, SMS, email, in-app)
- Template management
- Delivery status tracking
- Retry and fallback logic
- User preference management

#### Fraud Detection

**Classification:** Generic Domain (with domain-specific rules)

**Why it is generic:** While fraud detection rules are business-specific, the core capability (scoring transactions, detecting anomalies, managing alerts) follows established patterns. The rules engine and ML models are business-specific, but the infrastructure is generic.

**Key business capabilities:**
- Real-time transaction scoring
- Rule-based fraud detection
- Anomaly detection (ML-based, future)
- Fraud alert generation and case management
- Transaction blocking and review

#### Audit & Compliance

**Classification:** Generic Domain

**Why it is generic:** Audit logging and compliance reporting follow well-established regulatory requirements. The implementation is mechanical — record everything, retain for required periods, make available for examination. The business rules that trigger auditing are domain-specific, but the audit mechanism itself is generic.

**Key business capabilities:**
- Immutable audit trail
- Compliance data collection
- Regulatory reporting
- Data retention management
- Access logging

#### KYC & Identity Verification

**Classification:** Generic Domain

**Why it is generic:** KYC (Know Your Customer) and identity verification are regulated processes with well-defined requirements. Third-party providers (Jumio, Onfido, Trulioo) offer mature solutions. FinFlow integrates these services rather than building identity verification from scratch.

**Key business capabilities:**
- Document verification (passport, driver's license)
- Liveness detection
- Sanctions screening (OFAC, PEP lists)
- Adverse media monitoring
- Ongoing KYC refresh

#### Document Storage

**Classification:** Generic Domain

**Why it is generic:** Storing and retrieving documents (KYC documents, statements, tax forms) is infrastructure. Object storage services (S3) solve this problem completely.

#### Reporting & Search

**Classification:** Generic Domain

**Why it is generic:** Full-text search, log analysis, and operational reporting are infrastructure capabilities provided by established tools (Elasticsearch, analytics platforms).

---

## 3. Bounded Contexts

### 3.1 Bounded Context Overview

A bounded context defines a logical boundary within which a particular domain model applies consistently. Inside the boundary, every term has a single, unambiguous meaning. Across boundaries, the same word may mean different things.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FINFLOW BOUNDED CONTEXT MAP                          │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │    ┌───────────┐          ┌───────────┐        ┌───────────┐    │  │
│  │    │  Account   │◄────────│  Transfer  │───────►│   Card    │    │  │
│  │    │  Context   │  events  │  Context   │ events │  Context  │    │  │
│  │    │           │          │           │        │           │    │  │
│  │    └─────┬─────┘          └─────┬─────┘        └─────┬─────┘    │  │
│  │          │                      │                    │          │  │
│  │          │ events               │ events             │ events   │  │
│  │          ▼                      ▼                    ▼          │  │
│  │    ┌───────────┐          ┌───────────┐        ┌───────────┐    │  │
│  │    │  Savings   │          │ Analytics  │        │  Fraud    │    │  │
│  │    │  Context   │          │  Context   │        │  Context  │    │  │
│  │    │           │          │           │        │           │    │  │
│  │    └───────────┘          └───────────┘        └───────────┘    │  │
│  │                                                                   │  │
│  │    ┌───────────┐          ┌───────────┐        ┌───────────┐    │  │
│  │    │    Auth    │          │    B2B     │        │  Billing  │    │  │
│  │    │  Context   │          │  Context   │        │  Context  │    │  │
│  │    │           │          │  (future)  │        │           │    │  │
│  │    └───────────┘          └───────────┘        └───────────┘    │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  SHARED / GENERIC CONTEXTS                                        │  │
│  │                                                                    │  │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │  │
│  │  │Notifi-    │ │  Audit    │ │    KYC    │ │ Document  │        │  │
│  │  │cation     │ │  Context  │ │  Context  │ │  Context  │        │  │
│  │  │Context    │ │           │ │           │ │           │        │  │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Account Context

| Attribute | Detail |
|---|---|
| **Purpose** | Manage the complete lifecycle of financial accounts and the customer's relationship with FinFlow |
| **Responsibilities** | Account origination, account status management, balance calculation, hold management, account type configuration, account eligibility rules, customer-account relationship |
| **Business Rules** | An account must have exactly one primary owner; joint accounts have up to two owners; account status transitions follow a defined state machine; balance cannot go below zero without explicit overdraft authorization; holds reduce available balance but not ledger balance; account closure requires zero balance and no pending transactions |
| **Inputs** | Customer registration data, KYC verification results, account funding, balance-affecting operations, compliance directives |
| **Outputs** | Account status, balance information, account metadata, account events |
| **Dependencies** | Auth Context (customer identity), KYC Context (verification status), Audit Context (account activity) |
| **Future Microservice Candidate** | Yes — Account Service (foundational service, extracted last or retained as nucleus) |

**Ubiquitous Language within this Context:**
- **Account** — A financial relationship between a customer and FinFlow
- **Primary Owner** — The customer who opened the account
- **Account Status** — The current lifecycle state (Pending, Active, Restricted, Suspended, Closed)
- **Ledger Balance** — The actual balance including pending transactions
- **Available Balance** — Ledger balance minus holds
- **Hold** — A temporary restriction on a portion of the balance
- **Account Type** — The category of account (Checking, Savings, Business)

### 3.3 Transfer Context

| Attribute | Detail |
|---|---|
| **Purpose** | Orchestrate the movement of money between accounts, both internal and external |
| **Responsibilities** | Transfer initiation, validation, processing, status tracking, limit enforcement, FX conversion, recurring transfer scheduling, settlement coordination |
| **Business Rules** | A transfer must have sufficient available balance; transfers are subject to daily and per-transaction limits; international transfers require FX rate locking; recurring transfers execute on scheduled dates; failed transfers are retried according to defined policy; transfers to new beneficiaries have a holding period |
| **Inputs** | Transfer requests, account balance information, FX rates, fraud risk scores, limit configurations |
| **Outputs** | Transfer status updates, settlement confirmations, limit consumption records |
| **Dependencies** | Account Context (balance, account status), Card Context (card-funded transfers), Fraud Context (risk scoring), Partner Bank Gateway (external settlement) |
| **Future Microservice Candidate** | Yes — Transfer Service (different scaling profile than accounts) |

**Ubiquitous Language within this Context:**
- **Transfer** — The movement of money from one account to another
- **Transfer Type** — The category: Internal, ACH, Wire, International, P2P
- **Transfer Status** — The lifecycle state: Initiated, Validated, Processing, Completed, Failed, Reversed
- **Settlement** — The actual movement of funds through banking rails
- **Beneficiary** — The recipient of a transfer
- **Originator** — The sender of a transfer
- **Transfer Limit** — Maximum amount allowed per transfer or per period
- **Holding Period** — Delay applied to first-time beneficiary transfers

### 3.4 Card Context

| Attribute | Detail |
|---|---|
| **Purpose** | Manage the lifecycle of payment cards and process card authorization requests |
| **Responsibilities** | Card issuance, activation, lifecycle management, authorization processing, spending limit enforcement, card controls, card replacement |
| **Business Rules** | A card is linked to exactly one account; a card can be frozen instantly; card transactions deduct from available balance; card limits are independent of transfer limits; virtual cards can be issued instantly; physical cards require activation; compromised cards are replaced with new numbers |
| **Inputs** | Card issuance requests, authorization requests from card network, card control changes, account status changes |
| **Outputs** | Card status, authorization decisions (approve/decline), card metadata, card events |
| **Dependencies** | Account Context (linked account, balance), Fraud Context (real-time scoring), Payment Processor (card network integration) |
| **Future Microservice Candidate** | Yes — Card Service (requires sub-100ms authorization latency, independent scaling) |

**Ubiquitous Language within this Context:**
- **Card** — A payment instrument linked to an account
- **Virtual Card** — A card existing only digitally (no physical form)
- **Physical Card** — A plastic card with chip and contactless capability
- **Authorization** — A request from the card network to approve or decline a transaction
- **Card Status** — Lifecycle state: Issued, Active, Frozen, Replacement Pending, Closed
- **Card Controls** — User-configurable restrictions on card usage
- **Spending Limit** — Maximum amount per transaction or per period on a specific card
- **Merchant Category Code (MCC)** — Standardized code for the type of merchant

### 3.5 Auth Context

| Attribute | Detail |
|---|---|
| **Purpose** | Manage customer identity, authentication, authorization, and session lifecycle |
| **Responsibilities** | User registration, authentication (password, biometric, passkey), MFA management, session lifecycle, device management, access control, credential lifecycle |
| **Business Rules** | A user must authenticate before any account access; failed logins trigger progressive lockout; sessions expire after defined inactivity period; password changes invalidate all active sessions; biometric is client-side verified; device trust requires explicit user action |
| **Inputs** | Registration data, authentication attempts, MFA codes, device information, credential changes |
| **Outputs** | Authentication tokens, session state, device trust status, access permissions |
| **Dependencies** | None (foundational context — all others depend on it) |
| **Future Microservice Candidate** | Yes, but — should remain centralized for security audit consistency; may be deployed as dedicated service but should not be duplicated |

**Ubiquitous Language within this Context:**
- **User** — A person registered on the FinFlow platform
- **Credential** — Authentication secret (password, biometric template, passkey)
- **Session** — An authenticated period of platform access
- **Device** — A recognized hardware endpoint used to access FinFlow
- **MFA Factor** — A secondary authentication mechanism (TOTP, SMS OTP, email OTP)
- **Access Token** — A short-lived JWT representing an authenticated session
- **Refresh Token** — A long-lived token used to obtain new access tokens
- **Account Lockout** — Temporary restriction after failed authentication attempts

### 3.6 Savings Context

| Attribute | Detail |
|---|---|
| **Purpose** | Enable goal-oriented saving behaviors and automated savings rules |
| **Responsibilities** | Savings goal creation and tracking, automated savings rules, interest accrual, Regulation D compliance, goal achievement |
| **Business Rules** | Savings goals have a target amount and optional deadline; automated rules execute on trigger conditions; Regulation D limits certain transfer types to 6 per month; interest accrues daily on savings balances; goal achievement triggers celebration notification |
| **Inputs** | Goal creation requests, trigger events (transactions, time), interest rate updates, transfer completions |
| **Outputs** | Goal progress, savings rule execution events, interest accrual entries, goal status |
| **Dependencies** | Account Context (linked account, balance), Transfer Context (automated transfers to savings) |
| **Future Microservice Candidate** | Low — tightly coupled with account operations |

**Ubiquitous Language within this Context:**
- **Savings Goal** — A named target amount with optional deadline
- **Savings Rule** — An automated behavior that triggers savings actions
- **Round-Up Rule** — A rule that rounds transactions to the nearest dollar and saves the difference
- **Interest Accrual** — The daily calculation of interest earned on savings balances
- **Regulation D** — Federal regulation limiting certain types of transfers from savings accounts

### 3.7 Analytics Context

| Attribute | Detail |
|---|---|
| **Purpose** | Transform raw financial data into actionable insights and financial awareness |
| **Responsibilities** | Transaction categorization, spending analysis, budget tracking, cash flow forecasting, financial health scoring, merchant intelligence, report generation |
| **Business Rules** | Spending categories use merchant database matching and ML classification; budgets can be set per category or overall; forecasts use historical patterns with configurable confidence intervals; reports are generated asynchronously; insights are personalized based on user behavior patterns |
| **Inputs** | Transaction events (all types), user preferences, merchant data, historical patterns |
| **Outputs** | Categorized transactions, spending summaries, budget alerts, forecasts, insights, reports |
| **Dependencies** | Account Context (account data), Transfer Context (transaction data), Card Context (card transaction data) |
| **Future Microservice Candidate** | Yes — heavy read workload, independent data pipeline needs |

**Ubiquitous Language within this Context:**
- **Spending Category** — A classification of a transaction (Groceries, Dining, Transport, etc.)
- **Budget** — A planned spending limit for a category or period
- **Cash Flow Forecast** — A prediction of future account balance based on historical patterns
- **Financial Health Score** — A composite score measuring overall financial wellness
- **Merchant Intelligence** — Information about where and how the user spends
- **Insight** — A personalized observation or recommendation about financial behavior
- **Report** — A generated document summarizing financial activity over a period

### 3.8 Fraud Context

| Attribute | Detail |
|---|---|
| **Purpose** | Detect, prevent, and respond to fraudulent activity on the platform |
| **Responsibilities** | Real-time transaction scoring, rule-based detection, ML anomaly detection, fraud alert generation, case management, transaction blocking |
| **Business Rules** | Every financial transaction is scored before processing; alerts above threshold trigger automatic holds; false positive rate is tracked as a business metric; fraud cases have defined SLAs for resolution; blocked transactions are held for manual review |
| **Inputs** | Transaction events, login events, user behavioral data, historical fraud patterns, external threat intelligence |
| **Outputs** | Risk scores, fraud alerts, block/allow decisions, case assignments |
| **Dependencies** | Account Context (user profile), Transfer Context (transaction details), Card Context (card details), Auth Context (login patterns) |
| **Future Microservice Candidate** | Yes — computationally expensive, benefits from independent scaling and ML infrastructure |

**Ubiquitous Language within this Context:**
- **Risk Score** — A numerical assessment of transaction likelihood of fraud
- **Fraud Alert** — A notification that a transaction or event may be fraudulent
- **Fraud Case** — A documented investigation of suspected fraudulent activity
- **False Positive** — A legitimate transaction incorrectly flagged as fraud
- **Velocity Check** — Checking the frequency and amount of recent transactions
- **Anomaly Detection** — Identifying transactions that deviate from established patterns

### 3.9 Notification Context

| Attribute | Detail |
|---|---|
| **Purpose** | Deliver timely, relevant communications to users across all channels |
| **Responsibilities** | Multi-channel delivery (push, SMS, email, in-app), template management, delivery tracking, retry logic, preference management |
| **Business Rules** | Critical notifications (fraud alerts) use multiple channels simultaneously; non-critical notifications respect user channel preferences; delivery failures are retried with exponential backoff; notification frequency is capped to prevent fatigue; sensitive information is not included in push notifications |
| **Inputs** | Domain events from all contexts, user notification preferences, template configurations |
| **Outputs** | Delivery confirmations, read receipts, delivery failure reports |
| **Dependencies** | Auth Context (user contact information), external delivery providers (SMS, email, push) |
| **Future Microservice Candidate** | Yes — stateless, independent scaling, different failure mode than core banking |

**Ubiquitous Language within this Context:**
- **Notification** — A communication sent to a user
- **Notification Channel** — The delivery method (Push, SMS, Email, In-App)
- **Notification Template** — A reusable message format with variable placeholders
- **Delivery Status** — The state of a notification: Queued, Sent, Delivered, Failed, Read
- **Notification Preference** — User-configured channel and frequency settings

### 3.10 Audit Context

| Attribute | Detail |
|---|---|
| **Purpose** | Maintain an immutable, complete record of all business operations for regulatory compliance and operational accountability |
| **Responsibilities** | Audit trail creation for all state changes, compliance data collection, regulatory reporting, access logging, change tracking |
| **Business Rules** | Audit entries are append-only (no updates, no deletes); every financial operation generates an audit entry; audit entries include who, what, when, where, and outcome; audit data is retained for minimum 7 years; audit entries include correlation IDs for traceability |
| **Inputs** | All domain events from all contexts (passive subscriber) |
| **Outputs** | Audit entries, compliance reports, access logs |
| **Dependencies** | None (passive consumer of all events; reads data from all contexts for compliance queries) |
| **Future Microservice Candidate** | Yes, but — must maintain unified view; best deployed as a dedicated service consuming the event stream |

**Ubiquitous Language within this Context:**
- **Audit Entry** — An immutable record of a business operation
- **Audit Action** — The type of operation recorded (AccountCreated, TransferCompleted, etc.)
- **Compliance Record** — A data point collected for regulatory requirements
- **Access Log** — A record of who accessed what data and when
- **Correlation ID** — A unique identifier linking all entries from a single user request

### 3.11 Billing Context

| Attribute | Detail |
|---|---|
| **Purpose** | Manage FinFlow's monetization through subscriptions, premium features, and revenue tracking |
| **Responsibilities** | Subscription tier management, premium feature access control, invoice generation, payment collection, promotional pricing, revenue tracking |
| **Business Rules** | Free tier provides core banking features; premium tier unlocks advanced intelligence and features; subscription failures trigger a dunning process; promotional codes have defined validity and usage limits; account closure cancels active subscriptions |
| **Inputs** | Subscription changes, payment events, promotional code applications, feature usage data |
| **Outputs** | Subscription status, invoices, revenue records, access entitlements |
| **Dependencies** | Auth Context (user identity), Account Context (billing account), external payment processor |
| **Future Microservice Candidate** | Medium — relatively independent but low scaling needs initially |

**Ubiquitous Language within this Context:**
- **Subscription** — A recurring entitlement to premium features
- **Plan** — A defined tier of features and pricing
- **Invoice** — A document requesting payment for a subscription period
- **Dunning** — The process of retrying failed subscription payments
- **Promotional Code** — A temporary discount or credit applied to a subscription

### 3.12 B2B Context (Future)

| Attribute | Detail |
|---|---|
| **Purpose** | Enable Banking-as-a-Service capabilities for partner platforms |
| **Responsibilities** | Partner onboarding, API key management, usage tracking, revenue sharing, white-label configuration |
| **Business Rules** | Partners must complete compliance review before onboarding; API usage is metered and billed; partners cannot access other partners' data; white-label configuration is isolated per partner |
| **Inputs** | Partner registration data, API usage, configuration changes |
| **Outputs** | API access credentials, usage reports, revenue sharing statements |
| **Dependencies** | All core and supporting contexts (partner access is a cross-cutting concern) |
| **Future Microservice Candidate** | Yes — isolated from consumer platform entirely |

---

## 4. Domain Entities

### 4.1 Entity Identification Principles

An entity is a domain object defined by its identity, not its attributes. Two entities are the same if they have the same identity, even if all their attributes differ. Entities have lifecycle — they are created, modified, and eventually archived or deleted. They participate in business operations and enforce invariants.

### 4.2 Core Entities

#### User

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a person who has registered on the FinFlow platform. The User is the fundamental identity that everything else relates to. |
| **Lifecycle** | Created during registration → Email/phone verified → Profile completed → Active usage → Account closure (user may remain even after closing all accounts for regulatory retention) |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | A User is NOT a customer in the banking sense — a User may register but not complete KYC, or may complete KYC but not fund an account. The User entity represents platform identity, while the Customer entity (see below) represents a banking relationship. This distinction is critical: it allows the platform to separate authentication concerns from financial relationship concerns. |

#### Customer

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a person who has an active banking relationship with FinFlow. A Customer has completed KYC verification and holds at least one account. |
| **Lifecycle** | Created when KYC is approved → Linked to accounts → Active banking relationship → May become dormant (no activity for extended period) → Relationship closed (all accounts closed, retention period observed) |
| **Ownership** | Owned by the Account Context |
| **Business Meaning** | The Customer entity is the financial identity. It carries risk profiles, eligibility for products, and the banking relationship history. A User becomes a Customer through the KYC process. This separation allows different data models for platform identity vs. banking relationship, which is essential for regulatory compliance. |

#### Account

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a financial account — a container for money and the rules governing that money. |
| **Lifecycle** | Created (Pending status) → Funded (Active status) → Ongoing operations → May be Restricted/Suspended → Closed (zero balance required, no pending transactions) |
| **Ownership** | Owned by the Account Context. Account is the aggregate root for balance and hold management. |
| **Business Meaning** | An Account is the central entity of the entire system. Every financial operation ultimately relates back to an Account. The Account enforces critical invariants: balance cannot go below zero (without overdraft), holds reduce available balance, status transitions follow a strict state machine. |

#### Transaction

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a single financial event — any movement of money that affects an account balance. |
| **Lifecycle** | Created (when a financial event occurs) → Posted (when settlement is confirmed) → May be disputed → Eventually archived |
| **Ownership** | Conceptually owned by the Account Context, but created by various contexts (Transfer, Card, Savings, Billing). Transaction is a cross-cutting entity. |
| **Business Meaning** | A Transaction is the atomic unit of financial history. Every debit, credit, hold, and reversal is a Transaction. Transactions are immutable once posted — corrections are recorded as new reversal transactions, never by modifying existing records. This immutability is a regulatory requirement and a trust mechanism. |

#### Transfer

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a specific type of financial operation: the movement of money from one account to another, potentially across different institutions. |
| **Lifecycle** | Initiated → Validated → Processing → Completed/Failed/Reversed |
| **Ownership** | Owned by the Transfer Context. Transfer is the aggregate root for the money movement process. |
| **Business Meaning** | A Transfer is more complex than a Transaction. It represents an orchestration process that spans multiple systems (account validation, limit checking, fraud scoring, settlement). The Transfer entity tracks the complete lifecycle of this orchestration, including failure handling and compensating actions. |

#### Card

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a payment instrument (virtual or physical) linked to an account. |
| **Lifecycle** | Issued → Activated → Active usage → May be Frozen → May be Replaced → Closed |
| **Ownership** | Owned by the Card Context. Card is the aggregate root for card-related operations. |
| **Business Meaning** | A Card is a financial instrument that enables the account holder to make purchases and withdraw cash. The Card entity manages its own lifecycle independently of the account — a card can be frozen even if the account is active, and vice versa. |

#### Beneficiary

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a recipient of transfers — a person or entity to whom the user can send money. |
| **Lifecycle** | Added → First transfer may have holding period → Active → May be deactivated → Removed |
| **Ownership** | Owned by the Transfer Context |
| **Business Meaning** | A Beneficiary represents a trusted transfer recipient. The first transfer to a new beneficiary may be subject to additional verification or holding period. Beneficiaries accumulate trust over time — repeat recipients have lower friction for subsequent transfers. |

### 4.3 Supporting Entities

#### Session

| Attribute | Detail |
|---|---|
| **Purpose** | Represents an authenticated period of platform access for a specific user on a specific device. |
| **Lifecycle** | Created at authentication → Active during use → Expires after inactivity or explicit logout → Invalidated on security events |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | A Session is the security boundary for platform access. It carries the authenticated identity and is subject to timeout, device binding, and concurrent session limits. |

#### Device

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a recognized hardware endpoint (phone, tablet, computer) used to access FinFlow. |
| **Lifecycle** | Detected (first login) → May be trusted (user explicitly trusts) → Active usage → May be revoked → Removed |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | A Device represents a known access point. Trusted devices have extended session lifetimes and reduced authentication friction. Unknown devices trigger additional verification steps. |

#### SavingsGoal

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a named financial target that the user is working toward. |
| **Lifecycle** | Created → In Progress → May be Achieved → May be Closed early |
| **Ownership** | Owned by the Savings Context |
| **Business Meaning** | A SavingsGoal is an emotional and financial commitment. It drives user engagement by providing a tangible target and visual progress. Goals can be funded manually or through automated rules. |

#### SavingsRule

| Attribute | Detail |
|---|---|
| **Purpose** | Represents an automated behavior that triggers savings actions based on defined conditions. |
| **Lifecycle** | Created → Active → May be paused → May be modified → May be deactivated |
| **Ownership** | Owned by the Savings Context |
| **Business Meaning** | A SavingsRule automates the discipline of saving. Common rules include round-ups (round transaction to nearest dollar, save the difference), percentage triggers (save X% of income), and recurring transfers. |

#### Subscription

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a customer's entitlement to premium features on the platform. |
| **Lifecycle** | Created (at upgrade) → Active → May be Downgraded → May be Cancelled → May expire (payment failure) |
| **Ownership** | Owned by the Billing Context |
| **Business Meaning** | A Subscription represents the monetization relationship. It determines feature access, pricing tier, and billing cycle. |

#### FraudCase

| Attribute | Detail |
|---|---|
| **Purpose** | Represents an investigation of suspected fraudulent activity. |
| **Lifecycle** | Created (from alert) → Under Investigation → May be Escalated → Resolved (Confirmed Fraud / False Positive / Inconclusive) |
| **Ownership** | Owned by the Fraud Context |
| **Business Meaning** | A FraudCase is the operational unit for fraud investigation. It aggregates all evidence, transactions, and communications related to a suspected incident. Resolution of fraud cases feeds back into detection rules. |

#### AuditEntry

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a single, immutable record of a business operation. |
| **Lifecycle** | Created (append-only) → Retained (minimum 7 years) → Archived |
| **Ownership** | Owned by the Audit Context |
| **Business Meaning** | An AuditEntry is a regulatory and operational requirement. It provides the evidentiary trail for all business operations, enabling compliance examination, dispute resolution, and operational accountability. |

#### Notification

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a communication sent to a user through a specific channel. |
| **Lifecycle** | Created → Queued → Sent → Delivered → May be Read → May Fail (retry or dead letter) |
| **Ownership** | Owned by the Notification Context |
| **Business Meaning** | A Notification is the communication bridge between the platform and the user. Its lifecycle tracks delivery reliability, which is critical for time-sensitive communications like fraud alerts. |

### 4.4 Cross-Cutting Entities

#### Address

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a physical location associated with a user or account. |
| **Lifecycle** | Created → May be updated → May be marked as primary → Eventually archived |
| **Ownership** | Used across Auth Context (user address) and Account Context (mailing address) |
| **Business Meaning** | Address is a shared entity that appears in multiple contexts. In the Auth Context, it is part of the user profile. In the Account Context, it may be used for regulatory compliance (proof of address). In the KYC Context, it is verified against identity documents. |

#### Profile

| Attribute | Detail |
|---|---|
| **Purpose** | Represents the public-facing identity information of a user within the platform. |
| **Lifecycle** | Created at registration → Updated as information changes → May include preferences, display settings, and personal information |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | Profile is the user-facing view of identity. It includes non-sensitive information that other users or systems may see (display name, profile picture). It is distinct from the full User entity, which includes sensitive data like email, phone, and credentials. |

#### OTP (One-Time Password)

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a temporary, single-use verification code used for multi-factor authentication or transaction verification. |
| **Lifecycle** | Generated → Sent to user → Awaiting verification → Verified or Expired |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | An OTP is a time-bound security mechanism. It represents a brief window of verification that expires automatically. OTPs are generated per-purpose (login, transaction, password reset) and are never reused. |

#### Role

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a named set of permissions that can be assigned to users. |
| **Lifecycle** | Defined → Active → May be modified (permission changes) → May be deprecated |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | A Role is an authorization abstraction. It groups permissions into meaningful sets (e.g., "Account Owner," "Account Viewer," "Admin"). Roles simplify access management and ensure consistent permission enforcement. |

#### Permission

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a specific, granular ability to perform an action on a resource. |
| **Lifecycle** | Defined → Active → May be modified → May be deprecated |
| **Ownership** | Owned by the Auth Context |
| **Business Meaning** | A Permission is the atomic unit of authorization. It answers: "Can this user perform this action on this resource?" Examples: "Transfer money from checking account," "View transaction history," "Freeze card." |

---

## 5. Value Objects

### 5.1 Value Object Principles

A value object is defined by its attributes, not its identity. Two value objects with the same attributes are interchangeable. Value objects are immutable — once created, they cannot be changed. If a value needs to change, a new value object is created to replace the old one.

**Why immutability matters in banking:**
- **Auditability:** An immutable value cannot be silently modified after the fact
- **Thread safety:** Immutable objects are inherently thread-safe
- **Correctness:** No partial updates or inconsistent state
- **Reasoning:** Once a value object is validated at creation, it remains valid throughout its lifecycle

### 5.2 Financial Value Objects

#### Money

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a monetary amount with its currency. The fundamental unit of financial value. |
| **Why Value Object** | Money is defined by its amount and currency. $100 USD is $100 USD regardless of where or when it appears. Creating a new Money object for each operation ensures that arithmetic operations are explicit and auditable. |
| **Business Meaning** | Money is the most critical value object in the system. Every financial operation involves Money. Immutability ensures that a balance is never accidentally modified — a new balance is calculated and a new value object is created. |

#### Currency

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a specific currency (USD, EUR, GBP, etc.) with its properties (symbol, decimal precision, name). |
| **Why Value Object** | Currency is a fixed, well-defined concept. USD is USD everywhere. There is no lifecycle or identity — only attributes. |
| **Business Meaning** | Currency determines how Money is displayed, calculated, and converted. Each currency has specific rules (e.g., JPY has no decimal places). |

#### Balance

| Attribute | Detail |
|---|---|
| **Purpose** | Represents the complete financial state of an account at a point in time: ledger balance, available balance, and holds. |
| **Why Value Object** | Balance is a snapshot of financial state. It is calculated, not mutated. When a transaction occurs, a new Balance value object is computed — the old one becomes a historical record. |
| **Business Meaning** | Balance is what the user sees and what the system uses for authorization decisions. The distinction between ledger balance (actual) and available balance (after holds) is a fundamental banking concept. |

#### FXRate

| Attribute | Detail |
|---|---|
| **Purpose** | Represents an exchange rate between two currencies at a specific point in time. |
| **Why Value Object** | An FX rate is a snapshot of market conditions. It has no identity — only its numerical value and the currency pair it relates. Rates change constantly; each rate capture is an independent, immutable value. |
| **Business Meaning** | FXRate determines the cost of international transfers. Rates are locked at the time of transfer initiation and have a validity window (TTL). |

#### Fee

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a charge applied to a financial operation. |
| **Why Value Object** | A fee is a fixed, determined amount. Once calculated, it does not change. If a fee needs to be adjusted, a new Fee value object is created (and the old one may be reversed). |
| **Business Meaning** | Fee represents the cost of a financial service. FinFlow's fee structure is a competitive differentiator — many services are free, and remaining fees are transparent. |

#### AccountNumber

| Attribute | Detail |
|---|---|
| **Purpose** | Represents the unique identifier for a financial account, potentially in a format suitable for display or external sharing. |
| **Why Value Object** | An account number is a stable, immutable identifier. It does not change over the account's lifecycle. It has no behavior — only meaning. |
| **Business Meaning** | AccountNumber is the externally visible identifier. It is distinct from the internal Account ID (which may be a UUID). The account number may be masked for display (showing only last 4 digits). |

#### RoutingNumber

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a bank routing number used for ACH transfers in the US banking system. |
| **Why Value Object** | A routing number is a fixed, standardized value. It identifies a financial institution and does not change. |
| **Business Meaning** | RoutingNumber is required for external ACH transfers. It identifies the destination bank. |

### 5.3 Identity Value Objects

#### EmailAddress

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a validated email address associated with a user. |
| **Why Value Object** | An email address is a string that follows specific format rules. Once validated and created, it does not change (if it needs to change, a new EmailAddress is created). Immutability prevents accidental corruption of a critical communication channel. |
| **Business Meaning** | EmailAddress is used for authentication, notifications, and P2P transfers. It must be unique across the platform. |

#### PhoneNumber

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a validated phone number in international format. |
| **Why Value Object** | Same rationale as EmailAddress — immutable, validated at creation, stable throughout lifecycle. |
| **Business Meaning** | PhoneNumber is used for SMS authentication, P2P transfers, and account recovery. Must be unique and verified. |

#### Password

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a securely hashed user password. |
| **Why Value Object** | A Password value object encapsulates the hashing and verification logic. The raw password is never stored — only the hash. Creating a new Password object for each password change ensures the old hash is discarded. |
| **Business Meaning** | Password is the legacy authentication mechanism. The system supports but de-emphasizes passwords in favor of passkeys and biometric authentication. |

#### BiometricTemplate

| Attribute | Detail |
|---|---|
| **Purpose** | Represents the cryptographic template of a user's biometric data (fingerprint, face). |
| **Why Value Object** | Biometric data is processed client-side and never transmitted to the server. The server stores only a cryptographic assertion. The template is immutable — if biometric data changes (e.g., face recognition after surgery), a new template is registered. |
| **Business Meaning** | BiometricTemplate enables passwordless authentication. The server never sees raw biometric data — only mathematical proofs of a match. |

#### DeviceFingerprint

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a unique identifier for a physical device, derived from hardware and software characteristics. |
| **Why Value Object** | A device fingerprint is a computed value based on device attributes. It is stable for a given device configuration and immutable once captured. |
| **Business Meaning** | DeviceFingerprint is used for device recognition, trusted device management, and fraud detection (unknown device = higher risk). |

### 5.4 Temporal Value Objects

#### DateRange

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a period of time with a start and end date. |
| **Why Value Object** | A date range is defined by its boundaries. Once set, it does not change. If the period needs to extend, a new DateRange is created. |
| **Business Meaning** | DateRange is used for statement periods, budget cycles, subscription billing periods, and reporting windows. |

#### TimeWindow

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a specific time window within a day (e.g., business hours, maintenance window). |
| **Why Value Object** | A time window is a fixed, recurring pattern. It has no lifecycle — only configuration. |
| **Business Meaning** | TimeWindow is used for business hours for support, maintenance windows, and time-based security rules (e.g., large transfers only during business hours). |

### 5.5 Geographic Value Objects

#### Address

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a physical location with structured components (street, city, state, postal code, country). |
| **Why Value Object** | An address is a fixed description of a location. If an address changes, a new Address value object is created — the old one becomes a historical record. |
| **Business Meaning** | Address is used for KYC verification, regulatory compliance (proof of residence), mailing, and geographic risk assessment. |

#### Country

| Attribute | Detail |
|---|---|
| **Purpose** | Represents a country with its ISO code, name, and regulatory properties. |
| **Why Value Object** | A country is a fixed, standardized concept. It has no identity beyond its code — only attributes (name, currency, regulatory requirements). |
| **Business Meaning** | Country determines regulatory requirements, available services, FX availability, and sanctions screening scope. |

### 5.6 Configuration Value Objects

#### TransferLimit

| Attribute | Detail |
|---|---|
| **Purpose** | Represents the maximum amount allowed for a specific type of transfer within a specific time period. |
| **Why Value Object** | A limit is a fixed configuration value. When limits change (e.g., user graduates to higher limits), a new TransferLimit is created — the old one becomes historical. |
| **Business Meaning** | TransferLimit balances user convenience with fraud prevention and regulatory compliance. Limits are configurable per user tier, account age, and transaction history. |

#### InterestRate

| Attribute | Detail |
|---|---|
| **Purpose** | Represents the annual interest rate applied to a savings balance. |
| **Why Value Object** | An interest rate is a fixed value for a given period. When rates change, a new InterestRate is created — the old rate continues to apply to existing accrual periods. |
| **Business Meaning** | InterestRate determines the return on savings. Rates may vary by balance tier, promotional periods, and market conditions. |

---

## 6. Aggregates

### 6.1 Aggregate Principles

An aggregate is a cluster of domain entities and value objects that can be treated as a single unit for data changes. The aggregate root is the single entry point — all modifications to the aggregate go through the root. The aggregate ensures that all invariants (business rules) are satisfied within a single transaction.

**Transaction boundary principle:** A single aggregate is modified within a single database transaction. Cross-aggregate consistency is achieved through domain events and eventual consistency.

### 6.2 Aggregate Definitions

#### Account Aggregate

```
Account (Aggregate Root)
├── AccountId
├── AccountType
├── AccountStatus
├── Balance (Ledger)
├── AvailableBalance
├── Holds (Collection of Hold entities)
│   ├── HoldId
│   ├── Amount
│   ├── Reason
│   └── ExpiryDate
├── Limits (Collection of TransferLimit value objects)
└── Metadata (owner, creation date, last modified)
```

**Transaction boundary:** All operations on a single account (debit, credit, hold placement, hold release) execute within one transaction.

**Invariants:**
- Available Balance = Ledger Balance - Sum(Active Holds)
- Available Balance cannot be negative (without overdraft authorization)
- Hold amount cannot exceed Ledger Balance
- Status transitions follow defined state machine
- Account must have exactly one primary owner

#### Transfer Aggregate

```
Transfer (Aggregate Root)
├── TransferId
├── TransferType
├── TransferStatus
├── OriginatorAccount (Reference)
├── BeneficiaryAccount (Reference or ExternalDetails)
├── Amount
├── FXRate (if international)
├── Fee
├── StatusHistory (Collection of status transitions)
├── FailureReason (if failed)
└── Metadata (initiated by, correlation ID, timestamps)
```

**Transaction boundary:** Transfer creation and initial validation execute in one transaction. Subsequent status updates (processing → completed) may occur in separate transactions.

**Invariants:**
- A transfer cannot be cancelled after Processing status
- FX Rate must be locked before transfer initiation
- Fee must be calculated before transfer initiation
- Status transitions are strictly ordered
- Every status change must have a timestamp and reason

#### Card Aggregate

```
Card (Aggregate Root)
├── CardId
├── CardType (Virtual/Physical)
├── CardStatus
├── LinkedAccount (Reference)
├── SpendingLimits (Collection of CardLimit value objects)
├── CardControls (Collection of CardControl value objects)
├── TokenizedNumber (encrypted card number representation)
├── ExpiryDate
└── Metadata (issuance date, activation date, replacement history)
```

**Transaction boundary:** Card status changes (freeze, unfreeze) execute in one transaction. Authorization processing is read-only within the aggregate (the actual balance deduction happens in the Account aggregate).

**Invariants:**
- A frozen card cannot process authorizations
- Spending limits are checked atomically during authorization
- Card controls are evaluated in priority order
- Physical card requires activation before use
- Replacement card inherits linked account but gets new number

#### User/Auth Aggregate

```
User (Aggregate Root)
├── UserId
├── Credentials (Collection of Credential entities)
│   ├── CredentialType (Password, Passkey, Biometric)
│   ├── HashedValue
│   └── Status
├── MFAMethods (Collection of MFAMethod entities)
│   ├── MethodType (TOTP, SMS, Email)
│   ├── Verified
│   └── Status
├── Sessions (Collection of Session entities)
│   ├── SessionId
│   ├── Device
│   ├── ExpiresAt
│   └── Status
├── Devices (Collection of Device entities)
│   ├── DeviceId
│   ├── Fingerprint
│   ├── Trusted
│   └── LastSeenAt
├── LoginAttempts (Collection of LoginAttempt value objects)
└── Profile (Profile value object)
```

**Transaction boundary:** Authentication operations (login, session creation, credential update) execute in one transaction per operation.

**Invariants:**
- Maximum 3 active sessions per device type
- Account lockout after 5 failed login attempts (exponential backoff)
- Password change invalidates all sessions
- Trusted device status requires explicit user action
- MFA must be set up for sensitive operations

#### Beneficiary Aggregate

```
Beneficiary (Aggregate Root)
├── BeneficiaryId
├── Name
├── AccountDetails (AccountNumber, RoutingNumber, or IBAN)
├── InstitutionDetails
├── Status (Active, Inactive, Pending Verification)
├── TransferHistory (summary of past transfers)
├── TrustLevel (based on transfer history)
└── Metadata (added date, last transfer date)
```

**Transaction boundary:** Beneficiary creation and verification execute in one transaction.

**Invariants:**
- Beneficiary details must be verified before first large transfer
- First transfer to new beneficiary may be held for 24 hours
- Beneficiary cannot be removed if a transfer is in progress

#### SavingsGoal Aggregate

```
SavingsGoal (Aggregate Root)
├── GoalId
├── GoalName
├── TargetAmount
├── CurrentProgress
├── Deadline (optional)
├── Status (InProgress, Achieved, Closed)
├── LinkedAccount (Reference)
├── Rules (Collection of SavingsRule entities)
│   ├── RuleId
│   ├── RuleType
│   ├── Configuration
│   └── Status
└── ProgressHistory (Collection of progress snapshots)
```

**Transaction boundary:** Goal progress updates (from automated rules) execute in one transaction.

**Invariants:**
- Current Progress cannot exceed Target Amount
- Rules can only be modified when goal is InProgress
- Achieved goal cannot be reopened (create a new goal instead)

#### FraudCase Aggregate

```
FraudCase (Aggregate Root)
├── CaseId
├── AlertId (reference to triggering alert)
├── Status (Open, Investigating, Escalated, Resolved)
├── Resolution (Confirmed Fraud, False Positive, Inconclusive)
├── Evidence (Collection of EvidenceItem entities)
│   ├── EvidenceType
│   ├── Description
│   └── Timestamp
├── AssignedTo (analyst reference)
├── Timeline (Collection of CaseEvent entities)
└── ResolutionNotes
```

**Transaction boundary:** Case status changes and evidence additions execute in one transaction.

**Invariants:**
- Case cannot be resolved without evidence
- Escalation requires supervisor approval
- Resolution must include reasoning
- All actions on case are audit-logged

#### Subscription Aggregate

```
Subscription (Aggregate Root)
├── SubscriptionId
├── PlanId
├── Status (Active, PastDue, Cancelled, Expired)
├── BillingPeriod (Monthly, Annual)
├── CurrentPeriodStart
├── CurrentPeriodEnd
├── PaymentMethod (Reference)
├── InvoiceHistory (Collection of Invoice references)
└── DunningState (Collection of PaymentAttempt value objects)
```

**Transaction boundary:** Subscription state changes (upgrade, downgrade, cancellation) execute in one transaction.

**Invariants:**
- Subscription cannot be activated without valid payment method
- Cancellation takes effect at end of current billing period (or immediately for non-payment)
- Dunning follows defined retry schedule (3 retries over 14 days)

### 6.3 Aggregate Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    AGGREGATE RELATIONSHIPS                        │
│                                                                    │
│  ┌──────────┐    references    ┌──────────┐                      │
│  │ Transfer  │────────────────►│ Account  │                      │
│  │ Aggregate │                 │ Aggregate│                      │
│  └──────────┘                 └─────┬────┘                      │
│       │                              │ owns                       │
│       │ references                   │                            │
│       ▼                              ▼                            │
│  ┌──────────┐                 ┌──────────┐                      │
│  │Beneficiary│                │  Card    │                      │
│  │ Aggregate │                │Aggregate │                      │
│  └──────────┘                 └──────────┘                      │
│                                                                    │
│  ┌──────────┐    triggered by ┌──────────┐                      │
│  │ Savings  │────────────────►│ Transfer │                      │
│  │ Aggregate│  (auto rules)   │ Aggregate│                      │
│  └──────────┘                 └──────────┘                      │
│                                                                    │
│  ┌──────────┐    monitors     ┌──────────┐                      │
│  │  Fraud   │────────────────►│ Transfer │                      │
│  │ Aggregate│                 │ + Card   │                      │
│  └──────────┘                 └──────────┘                      │
│                                                                    │
│  ┌──────────┐    depends on   ┌──────────┐                      │
│  │Subscription│───────────────►│  User    │                      │
│  │ Aggregate │                │Aggregate │                      │
│  └──────────┘                 └──────────┘                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Domain Services

### 7.1 Domain Service Principles

A domain service contains business logic that does not naturally belong inside any single entity or value object. Domain services are stateless — they orchestrate operations across entities and aggregates but do not hold data themselves. When an operation involves multiple aggregates or requires coordination that spans entity boundaries, a domain service is the appropriate home.

**When to use a domain service:**
- The operation involves multiple aggregates
- The operation requires information from multiple sources
- The operation does not naturally belong to any single entity
- The operation is a domain concept, not an infrastructure concern

### 7.2 Domain Services

#### TransferOrchestrationService

| Attribute | Detail |
|---|---|
| **Purpose** | Orchestrates the complete lifecycle of a money transfer, coordinating across Account, Transfer, Beneficiary, and Fraud aggregates |
| **Responsibilities** | Validates transfer eligibility (balance, limits, account status), coordinates fraud scoring, initiates settlement, handles failure and compensation |
| **Why it is a domain service** | Transfer orchestration involves multiple aggregates (source account, destination account, beneficiary, fraud check). No single entity owns this process — it is a business process that coordinates multiple domain objects |
| **Business Rules enforced** | Sufficient available balance, transfer limit compliance, account status verification, beneficiary trust level assessment, fraud score threshold application |

#### BalanceCalculationService

| Attribute | Detail |
|---|---|
| **Purpose** | Calculates and maintains account balances considering holds, pending transactions, and settlement status |
| **Responsibilities** | Computes available balance from ledger balance and active holds, processes balance updates from transactions, manages hold lifecycle |
| **Why it is a domain service** | Balance calculation involves coordination between the Account aggregate (holds) and multiple Transaction entities. The calculation logic is a domain concept that does not belong inside either entity alone |
| **Business Rules enforced** | Available balance = Ledger balance - active holds; balance cannot go below zero without overdraft; holds are released on settlement or expiry |

#### InterestAccrualService

| Attribute | Detail |
|---|---|
| **Purpose** | Calculates and applies interest to savings balances based on daily balance and applicable interest rates |
| **Responsibilities** | Daily balance sampling, rate application, accrual entry generation, compounding logic |
| **Why it is a domain service** | Interest accrual spans the Account aggregate (balance) and the Savings aggregate (rates, goals). It is a periodic calculation that does not naturally belong to either entity |
| **Business Rules enforced** | Interest calculated on daily closing balance; rate applied based on balance tier; accrual posted monthly; Regulation D limits respected |

#### FXConversionService

| Attribute | Detail |
|---|---|
| **Purpose** | Determines optimal currency conversion for international transfers, including rate locking and cost calculation |
| **Responsibilities** | Fetches current FX rates, calculates conversion amounts, locks rates for transfer window, computes FX fees |
| **Why it is a domain service** | FX conversion is a cross-cutting concern that affects transfers and involves external rate data. No single entity owns exchange rate determination |
| **Business Rules enforced** | Rate locked at initiation time with configurable TTL; transparent FX markup; minimum and maximum conversion amounts; supported currency pairs only |

#### SpendCategorizationService

| Attribute | Detail |
|---|---|
| **Purpose** | Assigns spending categories to transactions based on merchant data, transaction patterns, and ML classification |
| **Responsibilities** | Merchant database matching, category assignment, learning from user corrections, handling ambiguous transactions |
| **Why it is a domain service** | Categorization involves data from multiple sources (merchant database, transaction data, user corrections) and spans the Transaction and Analytics domains |
| **Business Rules enforced** | Categories follow a defined taxonomy; user overrides take priority over automated classification; uncategorized transactions flagged for review |

#### AccountEligibilityService

| Attribute | Detail |
|---|---|
| **Purpose** | Determines whether a user is eligible for specific account types, features, or products based on their profile and history |
| **Responsibilities** | Evaluates eligibility criteria, calculates product suitability, determines tier upgrades |
| **Why it is a domain service** | Eligibility determination requires evaluating information across multiple aggregates (User, Account, Subscription) and external data (KYC status) |
| **Business Rules enforced** | KYC completion required for all accounts; account age affects eligibility for features; transaction history affects limit tiers; creditworthiness affects lending eligibility |

#### FraudScoringService

| Attribute | Detail |
|---|---|
| **Purpose** | Evaluates the risk level of transactions and account activities using rule-based and ML-based scoring |
| **Responsibilities** | Real-time transaction scoring, anomaly detection, rule evaluation, score aggregation |
| **Why it is a domain service** | Fraud scoring involves reading data from multiple aggregates (transaction details, user history, device information) and applying business rules that do not belong to any single entity |
| **Business Rules enforced** | Every transaction above threshold is scored; scoring must complete within latency budget; false positives are tracked; high-risk transactions trigger additional verification |

#### NotificationRoutingService

| Attribute | Detail |
|---|---|
| **Purpose** | Determines the appropriate channel(s), timing, and format for user notifications based on notification type, user preferences, and urgency |
| **Responsibilities** | Channel selection, frequency management, template selection, delivery prioritization |
| **Why it is a domain service** | Routing decisions involve reading user preferences, notification type configuration, and delivery channel status — information spanning multiple concerns |
| **Business Rules enforced** | Critical notifications (fraud) use all channels; user preferences respected for non-critical; frequency caps prevent notification fatigue; sensitive data excluded from push notifications |

#### SubscriptionEvaluationService

| Attribute | Detail |
|---|---|
| **Purpose** | Evaluates feature access entitlements based on the user's current subscription tier and determines upgrade/downgrade eligibility |
| **Responsibilities** | Feature gate evaluation, tier comparison, proration calculation for mid-cycle changes |
| **Why it is a domain service** | Subscription evaluation requires reading from the Subscription aggregate and determining access rights across multiple feature domains |
| **Business Rules enforced** | Free tier provides core banking; premium unlocks advanced features; downgrades take effect at period end; feature access checked in real-time |

#### RegulatoryComplianceService

| Attribute | Detail |
|---|---|
| **Purpose** | Ensures all operations comply with applicable banking regulations, including reporting thresholds and prohibited activities |
| **Responsibilities** | Transaction monitoring for regulatory thresholds, CTR (Currency Transaction Report) generation, SAR (Suspicious Activity Report) triggers, sanctions screening |
| **Why it is a domain service** | Compliance checks span all financial operations and require evaluating transaction patterns across multiple aggregates |
| **Business Rules enforced** | Transactions above $10,000 trigger CTR; patterns suggestive of structuring trigger SAR; sanctions screening on all new beneficiaries; compliance data retained 7 years |

---

## 8. Domain Events

### 8.1 Domain Event Principles

A domain event is something that happened in the domain that other parts of the system may need to know about. Events are named in past tense — they describe something that has already occurred, not something that might occur. Events are immutable records of fact.

**Why events matter in banking:**
- **Auditability:** Every event is a historical record
- **Decoupling:** Producers do not need to know about consumers
- **Extensibility:** New features can subscribe to existing events
- **Regulatory compliance:** Events provide the traceability regulators require

### 8.2 Complete Event Catalog

#### Account Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| AccountCreated | Account Context | Audit, Notification, Analytics | Record account creation; send welcome notification; initialize analytics profile |
| AccountActivated | Account Context | Notification, Analytics | Notify user account is ready; begin tracking activity |
| AccountSuspended | Account Context | Card, Transfer, Notification, Auth | Freeze all cards; halt pending transfers; notify user; restrict login |
| AccountReactivated | Account Context | Card, Transfer, Notification | Unfreeze cards; resume transfers; notify user |
| AccountClosed | Account Context | Card, Transfer, Savings, Billing, Notification | Close all cards; cancel pending transfers; close savings goals; cancel subscription; final notification |
| BalanceUpdated | Account Context | Analytics, Notification | Update spending analytics; trigger low-balance alerts |
| HoldPlaced | Account Context | Analytics | Update available balance analytics |
| HoldReleased | Account Context | Analytics | Update available balance analytics |
| KYCStatusChanged | Account Context | Auth, Notification, Billing | Update access permissions; notify user of status; enable/disable premium features |

#### Transfer Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| TransferInitiated | Transfer Context | Fraud, Audit | Trigger fraud scoring; record initiation |
| TransferValidated | Transfer Context | Audit | Record validation success |
| TransferProcessing | Transfer Context | Notification, Audit | Notify user transfer is in progress; record status |
| TransferCompleted | Transfer Context | Account (debit/credit), Notification, Analytics, Savings, Audit | Execute balance changes; notify all parties; update spending analytics; trigger savings rules; record completion |
| TransferFailed | Transfer Context | Notification, Audit, Account | Notify user of failure; record failure; release holds |
| TransferReversed | Transfer Context | Account, Notification, Audit | Reverse balance changes; notify user; record reversal |
| TransferLimitReached | Transfer Context | Notification, Fraud | Notify user; trigger fraud review if unusual pattern |

#### Card Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| CardIssued | Card Context | Notification, Audit | Notify user card is issued; record issuance |
| CardActivated | Card Context | Notification, Audit | Notify user card is ready for use; record activation |
| CardFrozen | Card Context | Transfer, Fraud, Notification, Audit | Prevent card transactions; investigate if fraud-triggered; notify user; record freeze |
| CardUnfrozen | Card Context | Notification, Audit | Notify user card is available; record unfreeze |
| CardDeclined | Card Context | Fraud, Notification, Analytics | Trigger fraud review if pattern; notify user; update analytics |
| CardTransactionAuthored | Card Context | Account (hold), Fraud, Analytics | Place hold on account; score for fraud; update analytics |
| CardReplaced | Card Context | Notification, Audit | Notify user of new card details; record replacement |

#### Auth Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| UserRegistered | Auth Context | Account, Notification, Audit, Billing | Create customer record; send welcome; record registration; activate trial |
| UserAuthenticated | Auth Context | Fraud, Audit | Update login patterns; record authentication |
| SessionCreated | Auth Context | Audit | Record session creation |
| SessionExpired | Auth Context | Audit | Record session expiry |
| LoginFailed | Auth Context | Fraud, Audit (if threshold) | Monitor for brute force; record attempt |
| AccountLocked | Auth Context | Notification, Fraud, Audit | Notify user; investigate if attack; record lockout |
| PasswordChanged | Auth Context | Notification, Audit | Notify user; record change; invalidate other sessions |
| MFAMethodAdded | Auth Context | Notification, Audit | Notify user; record method addition |
| DeviceTrusted | Auth Context | Notification, Audit | Notify user; record trust action |

#### Savings Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| GoalCreated | Savings Context | Notification, Analytics | Notify user; track goal engagement |
| GoalAchieved | Savings Context | Notification, Analytics, Billing (premium celebration) | Celebrate with user; update analytics; possibly unlock premium feature |
| SavingsRuleTriggered | Savings Context | Transfer (auto-debit) | Execute automated transfer |
| InterestAccrued | Savings Context | Account (credit), Analytics | Apply interest to balance; update financial analytics |

#### Fraud Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| FraudDetected | Fraud Context | Card (freeze), Transfer (block), Notification (alert), Account (restrict), Audit | Immediate protective actions; alert user; record detection |
| FraudApproved | Fraud Context | Transfer (allow), Card (unfreeze) | Release held transactions; resume normal operations |
| FraudRejected | Fraud Context | Transfer (cancel), Card (maintain freeze), Notification (inform user), Audit | Cancel fraudulent transactions; maintain freeze; inform user; record rejection |
| FraudCaseOpened | Fraud Context | Notification (to analyst), Audit | Assign to analyst; record case creation |
| FraudCaseResolved | Fraud Context | Notification (to user and analyst), Account (update trust), Audit | Notify stakeholders; update user trust profile; record resolution |

#### Billing Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| SubscriptionCreated | Billing Context | Auth (feature access), Notification, Audit | Grant premium access; welcome user; record subscription |
| SubscriptionChanged | Billing Context | Auth (update access), Notification, Audit | Adjust feature access; notify user; record change |
| SubscriptionCancelled | Billing Context | Auth (revoke access), Notification, Audit | Revoke premium access; notify user; record cancellation |
| InvoiceGenerated | Billing Context | Notification | Send invoice to user |
| PaymentProcessed | Billing Context | Audit | Record payment |
| PaymentFailed | Billing Context | Notification, Subscription (dunning) | Notify user; initiate dunning process |

#### Notification Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| NotificationSent | Notification Context | Audit | Record delivery attempt |
| NotificationDelivered | Notification Context | Audit | Record successful delivery |
| NotificationFailed | Notification Context | Audit, Notification (retry) | Record failure; trigger retry logic |
| NotificationRead | Notification Context | Analytics | Track engagement |

#### Audit Events

| Event | Producer | Consumers | Business Purpose |
|---|---|---|---|
| AuditEntryCreated | Audit Context | None (terminal event) | Record is stored; no further processing |

---

## 9. Ubiquitous Language

### 9.1 Banking Glossary

This glossary defines the precise meaning of every business term used within the FinFlow domain. Within each bounded context, these terms have exactly one meaning. Where a term has different meanings in different contexts, each meaning is explicitly listed.

| Term | Definition | Context |
|---|---|---|
| **Account** | A financial relationship between a customer and FinFlow that holds money and is subject to banking rules | Account Context |
| **Account Holder** | A person or entity that owns or co-owns an account | Account Context |
| **Account Number** | The unique identifier assigned to a financial account, used for external identification | Account Context |
| **ACH** | Automated Clearing House — an electronic network for processing financial transactions in the US, typically used for direct deposits and bill payments | Transfer Context |
| **Available Balance** | The portion of the ledger balance that can be used for new transactions, calculated as ledger balance minus active holds | Account Context |
| **Authorization** | A request from a merchant or ATM to approve or decline a card transaction in real-time | Card Context |
| **Beneficiary** | A recipient of a transfer — a person or entity to whom money is sent | Transfer Context |
| **Block** | A hold placed on a transaction by the fraud system pending investigation | Fraud Context |
| **Budget** | A user-defined spending limit for a category or time period | Analytics Context |
| **Card Controls** | User-configurable restrictions on card usage (spending limits, merchant category blocks, geographic restrictions) | Card Context |
| **Card Network** | The payment network (Visa, Mastercard) that processes card transactions between merchants, banks, and processors | Card Context |
| **Circuit Breaker** | A resilience pattern that prevents cascading failures by stopping requests to a failing dependency | Infrastructure |
| **Correlation ID** | A unique identifier assigned to a user request that traces it through all system components | Cross-cutting |
| **Currency Conversion** | The process of converting money from one currency to another using an exchange rate | Transfer Context |
| **Customer** | A person who has completed KYC verification and holds at least one account with FinFlow | Account Context |
| **Debit** | A deduction from an account balance | Account Context |
| **Direct Deposit** | An electronic transfer of funds directly into an account, typically from an employer | Transfer Context |
| **Dunning** | The process of retrying failed subscription payments according to a defined schedule | Billing Context |
| **Eventual Consistency** | A consistency model where all components will eventually have the same data, but not immediately after a change | Cross-cutting |
| **Fee** | A charge applied to a financial service or operation | Cross-cutting |
| **Fiduciary** | A person or entity legally responsible for managing money on behalf of another person | Account Context |
| **Fraud Alert** | A notification that a transaction or activity may be fraudulent, requiring investigation | Fraud Context |
| **Holding Period** | A delay applied to the first transfer to a new beneficiary, typically 24 hours, for security verification | Transfer Context |
| **Hold** | A temporary restriction on a portion of an account balance, reducing available balance without changing ledger balance | Account Context |
| **IDEMPOTENCY** | The property where performing an operation multiple times produces the same result as performing it once | Cross-cutting |
| **Interest Accrual** | The daily calculation of interest earned on a savings balance, applied monthly | Savings Context |
| **International Transfer** | A transfer that involves currency conversion and crosses national borders | Transfer Context |
| **KYC** | Know Your Customer — the process of verifying a customer's identity and assessing their risk profile, required by banking regulations | KYC Context |
| **Ledger Balance** | The actual account balance including all posted and pending transactions | Account Context |
| **Liveness Detection** | A biometric verification technique that confirms a live person is present (not a photo or video) | KYC Context |
| **Merchant** | A business or individual that accepts payment for goods or services | Card Context |
| **MFA** | Multi-Factor Authentication — requiring two or more verification methods for authentication | Auth Context |
| **OFAC** | Office of Foreign Assets Control — US Treasury department that administers economic sanctions | KYC Context |
| **OTP** | One-Time Password — a temporary, single-use verification code | Auth Context |
| **Overdraft** | An account balance below zero, typically requiring explicit authorization and potentially incurring fees | Account Context |
| **Passkey** | A FIDO2/WebAuthn credential that replaces passwords with cryptographic key pairs | Auth Context |
| **P2P Transfer** | Peer-to-peer transfer — sending money directly from one person to another, typically identified by phone or email | Transfer Context |
| **Pending Transaction** | A transaction that has been initiated but not yet settled | Account Context |
| **PEP** | Politically Exposed Person — an individual in a prominent public function, subject to enhanced due diligence | KYC Context |
| **Round-Up** | A savings rule that rounds each transaction to the nearest dollar and saves the difference | Savings Context |
| **SAR** | Suspicious Activity Report — a filing required when a financial institution suspects money laundering or fraud | Compliance Context |
| **Settlement** | The actual transfer of funds between financial institutions, completing a transaction | Transfer Context |
| **Spend Categorization** | The classification of transactions into business categories (Groceries, Dining, etc.) for analysis | Analytics Context |
| **Structuring** | The act of breaking large transactions into smaller ones to avoid reporting thresholds, a federal crime | Compliance Context |
| **Tokenization** | The replacement of sensitive data (like card numbers) with non-sensitive equivalents that retain no exploitable meaning | Card Context |
| **Transfer Limit** | The maximum amount allowed for a transfer, applied per transaction, per day, or per month | Transfer Context |
| **Virtual Card** | A payment card that exists only digitally, with no physical form | Card Context |
| **Wire Transfer** | An electronic transfer of funds through a network like Fedwire or SWIFT, typically for large amounts with same-day settlement | Transfer Context |

### 9.2 Context-Specific Term Resolution

Some terms have different meanings in different contexts. This section explicitly resolves those ambiguities.

| Term | Context A Meaning | Context B Meaning |
|---|---|---|
| **Account** | Financial account (Account Context) | User account / login (Auth Context) |
| **Balance** | Financial balance (Account Context) | Balance remaining in a budget (Analytics Context) |
| **Card** | Payment instrument (Card Context) | Reference card for comparison (Analytics Context) |
| **Transaction** | Financial transaction (Account Context) | Analytics event (Analytics Context) |
| **Limit** | Transfer limit (Transfer Context) | Spending limit (Analytics Context) |
| **Status** | Account status (Account Context) | Transfer status (Transfer Context) — different state machines |

---

## 10. Business Rules

### 10.1 Business Rule Classification

Business rules are classified into three categories:
- **Invariants:** Rules that must always be true (enforced at the aggregate level)
- **Policies:** Rules that govern business processes and decisions
- **Constraints:** Rules that restrict what is allowed

### 10.2 Account Rules

| Rule | Type | Description |
|---|---|---|
| An account must have exactly one primary owner at all times | Invariant | Enforced by the Account aggregate |
| Joint accounts may have up to two owners | Constraint | Maximum co-ownership limit |
| An account balance cannot go below zero without explicit overdraft authorization | Invariant | Available balance is always >= 0 (unless overdraft is explicitly granted) |
| An account can only be closed when the balance is zero and no pending transactions exist | Constraint | Prevents data loss and incomplete settlements |
| Account status must transition through defined states: Pending → Active → [Restricted → Suspended] → Closed | Policy | No status may be skipped; certain transitions require authorization |
| A Restricted account may only receive credits, not debits | Constraint | Partial restriction model for compliance holds |
| A Suspended account has all operations halted except incoming credits from known sources | Constraint | Full suspension with compliance exception |
| Each account type has specific eligibility requirements (age, KYC level, residency) | Policy | Different account types serve different customer segments |
| An account must have a designated currency at creation that cannot be changed | Invariant | Multi-currency is handled through separate accounts, not multi-currency accounts |
| Account information changes (address, email, phone) require re-verification for security | Policy | Prevents unauthorized account modifications |

### 10.3 Transfer Rules

| Rule | Type | Description |
|---|---|---|
| A transfer may not exceed the available balance of the source account | Invariant | Insufficient funds = decline |
| Transfers are subject to per-transaction, daily, and monthly limits | Constraint | Limits are configurable per user tier and account history |
| International transfers require FX rate locking before initiation | Policy | Protects user from rate fluctuation during processing |
| First-time beneficiary transfers are subject to a 24-hour holding period | Policy | Security measure against social engineering and fraud |
| Transfers above $10,000 trigger a Currency Transaction Report (CTR) | Policy | Federal regulatory requirement |
| Transfers that appear to be structured (multiple just-under-$10,000 transfers) trigger a Suspicious Activity Report (SAR) | Policy | Anti-money laundering compliance |
| A transfer cannot be cancelled after it enters Processing status | Invariant | Once settlement is initiated, cancellation is not possible |
| Failed transfers are not retried automatically — user must re-initiate | Policy | Prevents duplicate transfers; user must confirm intent |
| Recurring transfers execute on business days only (skip weekends and holidays) | Policy | Banking rail availability |
| Internal transfers (between own accounts) are instant and free | Policy | Encourages internal money management |
| ACH transfers have a standard settlement window of 1-3 business days | Policy | ACH network processing times |
| Wire transfers same-day settlement if initiated before cutoff time | Policy | Cutoff time depends on receiving bank |

### 10.4 Card Rules

| Rule | Type | Description |
|---|---|---|
| A card can only be linked to one account at a time | Invariant | Simplifies balance management and authorization |
| A frozen card cannot process any transactions | Invariant | Instant freeze = instant effect |
| Virtual cards can be issued instantly without physical production | Policy | Immediate usability for online transactions |
| Physical cards require activation before use | Policy | Prevents fraud from intercepted shipments |
| Card spending limits are independent of account transfer limits | Constraint | Separate controls for separate use cases |
| A compromised card is replaced with a new number (not reissued with same number) | Policy | Security — compromised numbers cannot be reused |
| Card authorization checks: account status, available balance, card status, card limits, card controls, fraud score | Policy | Multi-layered authorization decision |
| Card controls are evaluated in priority order; first matching rule determines the outcome | Policy | Allows hierarchical control configuration |
| A replacement card inherits the linked account but gets new credentials | Policy | Seamless transition for user; security through new number |

### 10.5 Authentication Rules

| Rule | Type | Description |
|---|---|---|
| A user must authenticate before accessing any account information | Invariant | No unauthenticated access |
| After 5 consecutive failed login attempts, the account is locked for 30 minutes | Policy | Progressive lockout to prevent brute force |
| After 10 consecutive failed attempts, the account is locked for 24 hours | Policy | Escalating lockout for persistent attacks |
| A password must be at least 12 characters; no arbitrary complexity requirements | Policy | NIST 800-63B guidelines — length over complexity |
| Passwords are checked against known breach databases | Policy | Prevents use of compromised credentials |
| Password change invalidates all active sessions | Policy | Ensures new credential takes effect immediately |
| Refresh tokens are single-use with rotation | Policy | Prevents refresh token theft |
| Maximum 3 active sessions per device type (mobile, web, tablet) | Constraint | Prevents session accumulation |
| Biometric authentication is verified client-side; server receives only a cryptographic assertion | Policy | Biometric data never leaves the device |
| Passkeys are supported as primary authentication method | Policy | Industry direction toward passwordless |

### 10.6 Savings Rules

| Rule | Type | Description |
|---|---|---|
| Savings goals have a target amount and optional deadline | Constraint | Goals must be well-defined |
| Automated savings rules execute on triggering conditions (transaction, time, balance threshold) | Policy | Automation reduces user friction |
| Regulation D limits certain types of transfers from savings accounts to 6 per month | Policy | Federal regulation compliance |
| Interest accrues daily on savings balances and is posted monthly | Policy | Standard banking practice |
| Goal achievement triggers a celebration notification | Policy | Positive reinforcement for savings behavior |
| Round-up savings are calculated per transaction and batched for transfer | Policy | Reduces transaction overhead |

### 10.7 Subscription Rules

| Rule | Type | Description |
|---|---|---|
| Core banking features are free; premium features require a subscription | Policy | Freemium model |
| Failed subscription payments are retried on days 1, 3, 7, and 14 | Policy | Dunning schedule |
| After 4 failed payment attempts, the subscription is cancelled | Policy | Maximum dunning attempts |
| Subscription downgrade takes effect at the end of the current billing period | Policy | No mid-period downgrade (user retains access until period end) |
| Subscription upgrade takes effect immediately with prorated billing | Policy | Immediate value for upgrade |
| Account closure cancels the active subscription | Policy | Clean disengagement |
| Promotional codes have defined validity periods and single/multi-use configuration | Constraint | Prevents abuse of promotional offers |

### 10.8 Fraud Rules

| Rule | Type | Description |
|---|---|---|
| Every transaction above a configurable threshold is scored for fraud risk | Policy | Proactive detection |
| Transactions flagged as high-risk are automatically held pending review | Policy | Preventive protection |
| Fraud alerts must be resolved within defined SLAs (4 hours for high-risk) | Policy | Operational accountability |
| False positives are tracked and used to refine detection rules | Policy | Continuous improvement |
| Fraud cases require documented evidence before resolution | Policy | Investigation rigor |
| Confirmed fraud triggers automatic card freeze and account restriction | Policy | Immediate protective action |
| User trust scores are updated based on fraud investigation outcomes | Policy | Long-term risk management |

### 10.9 Compliance Rules

| Rule | Type | Description |
|---|---|---|
| All financial operations generate an immutable audit entry | Policy | Regulatory requirement |
| Audit entries are retained for minimum 7 years | Policy | Regulatory retention |
| Currency Transaction Reports (CTR) are filed for transactions above $10,000 | Policy | Bank Secrecy Act |
| Suspicious Activity Reports (SAR) are filed for suspected money laundering | Policy | Bank Secrecy Act |
| KYC must be completed before account activation | Policy | Customer Identification Program |
| KYC information is refreshed periodically based on risk profile | Policy | Ongoing due diligence |
| Sanctions screening is performed on all new beneficiaries | Policy | OFAC compliance |
| Adverse media checks are performed during KYC and periodically thereafter | Policy | Enhanced due diligence |

---

## 11. Domain Relationships

### 11.1 Relationship Principles

Domain relationships describe how business concepts relate to each other conceptually. These are NOT database relationships — they describe business associations, not foreign keys.

### 11.2 Core Relationship Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOMAIN RELATIONSHIP MAP                               │
│                                                                          │
│                          ┌──────────┐                                   │
│                          │   User   │                                   │
│                          │ (Auth)   │                                   │
│                          └────┬─────┘                                   │
│                               │                                          │
│                    ┌──────────┴──────────┐                              │
│                    │                     │                              │
│              ┌─────▼─────┐        ┌─────▼─────┐                       │
│              │ Customer  │        │ Subscription│                       │
│              │ (Account) │        │  (Billing) │                       │
│              └─────┬─────┘        └───────────┘                       │
│                    │                                                     │
│        ┌───────────┼───────────┐                                       │
│        │           │           │                                       │
│   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐                                 │
│   │ Account │ │  Card   │ │Beneficiary│                                │
│   │ (core)  │ │         │ │           │                                │
│   └────┬────┘ └─────────┘ └─────┬─────┘                                │
│        │                        │                                       │
│   ┌────┴────────────────┐      │                                       │
│   │                     │      │                                       │
│ ┌─▼───┐  ┌──────────┐  │  ┌───▼─────┐                                │
│ │Trans-│  │ Savings  │  │  │  FX     │                                │
│ │action│  │  Goal    │  │  │  Rate   │                                │
│ └──┬───┘  └──────────┘  │  └─────────┘                                │
│    │                     │                                              │
│    │  ┌──────────┐       │                                              │
│    ├──┤ Transfer │       │                                              │
│    │  └──────────┘       │                                              │
│    │                     │                                              │
│    │  ┌──────────┐       │                                              │
│    └──┤  Fraud   │       │                                              │
│       │  Case    │       │                                              │
│       └──────────┘       │                                              │
│                           │                                              │
│                    ┌──────▼──────┐                                     │
│                    │   Audit     │                                     │
│                    │   Entry     │                                     │
│                    │ (all events)│                                     │
│                    └─────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Detailed Relationships

#### User → Customer
**Relationship:** A User becomes a Customer through KYC verification
**Nature:** One-to-one (a Customer always has exactly one User identity; a User may or may not be a Customer)
**Business Meaning:** This is a transformation relationship. The User entity represents platform identity, while the Customer entity represents a verified banking relationship. Not all Users are Customers (some may register but not complete KYC). All Customers are Users.

#### Customer → Account
**Relationship:** A Customer owns one or more Accounts
**Nature:** One-to-many (a Customer can have multiple accounts; an account belongs to exactly one primary owner)
**Business Meaning:** This is the fundamental banking relationship. The Customer is the person; the Account is their money. A Customer may have checking, savings, and business accounts — each is a separate Account entity. Joint accounts add a second owner, but the primary ownership relationship is one-to-one.

#### Account → Transaction
**Relationship:** An Account accumulates Transactions over its lifetime
**Nature:** One-to-many (an account has many transactions; a transaction belongs to one account)
**Business Meaning:** Transactions are the financial history of an account. Every debit, credit, hold, and reversal is recorded as a Transaction. The collection of Transactions defines the account's financial story. Transactions are immutable — corrections are new reversal transactions, not modifications.

#### Account → Hold
**Relationship:** An Account may have active Holds that reduce available balance
**Nature:** One-to-many (an account can have multiple concurrent holds)
**Business Meaning:** Holds represent pending deductions that have not yet settled. A hold reduces available balance but not ledger balance. Holds expire or are released when the underlying transaction settles or is cancelled.

#### Account → Card
**Relationship:** An Account is linked to one or more Cards
**Nature:** One-to-many (an account can have multiple cards; a card links to exactly one account)
**Business Meaning:** Cards are spending instruments drawn on an account's balance. Each card has independent controls and limits, but they all draw from the same available balance. Virtual and physical cards are both linked to the same account.

#### Account → Transfer
**Relationship:** An Account is the source and/or destination of Transfers
**Nature:** Many-to-many (an account can send and receive many transfers)
**Business Meaning:** Transfers are the movement of money between accounts. Each Transfer references a source account (originator) and a destination (which may be another FinFlow account or an external account). The Transfer orchestrates the balance changes on both accounts.

#### Transfer → Beneficiary
**Relationship:** A Transfer is sent to a Beneficiary
**Nature:** Many-to-one (many transfers can be sent to the same beneficiary)
**Business Meaning:** Beneficiaries represent trusted recipients. Repeated transfers to the same beneficiary build trust and reduce friction. First-time beneficiary transfers may be subject to holding periods.

#### Transfer → Transaction
**Relationship:** A Transfer generates Transactions on the affected accounts
**Nature:** One-to-many (a transfer creates at least two transactions: debit on source, credit on destination)
**Business Meaning:** A Transfer is the orchestration; Transactions are the accounting records. When a transfer completes, it generates a debit Transaction on the source account and a credit Transaction on the destination account. This distinction is important: Transfer represents the business process, while Transaction represents the financial record.

#### Transfer → FXRate
**Relationship:** An international Transfer uses an FXRate for currency conversion
**Nature:** Many-to-one (many transfers can use the same rate if initiated within the rate's validity window)
**Business Meaning:** FX rates are snapshots of market conditions. When an international transfer is initiated, the current rate is captured and locked for that transfer. The rate is immutable for the duration of the transfer — the user sees exactly what they will pay.

#### Card → Authorization
**Relationship:** A Card generates Authorization requests during use
**Nature:** One-to-many (a card can have many authorizations)
**Business Meaning:** Authorization is the real-time approval process for card transactions. Each swipe, tap, or online payment generates an Authorization request that checks balance, limits, controls, and fraud score. Approved authorizations eventually become Transactions.

#### User → Session
**Relationship:** A User has active Sessions representing authenticated access
**Nature:** One-to-many (a user can have multiple concurrent sessions across devices)
**Business Meaning:** Sessions represent the user's authenticated presence on the platform. Each session is bound to a device and has an expiry time. Concurrent sessions are limited for security. Session management is a security boundary.

#### User → Device
**Relationship:** A User accesses the platform through recognized Devices
**Nature:** Many-to-many (a user can use multiple devices; a device can be used by multiple users — rare but possible on shared devices)
**Business Meaning:** Devices represent known access points. Trusted devices have reduced authentication friction. Unknown devices trigger additional verification. Device fingerprinting supports fraud detection.

#### FraudCase → Transaction/Transfer/Card
**Relationship:** A FraudCase is triggered by suspicious activity on a Transaction, Transfer, or Card
**Nature:** Many-to-one (many suspicious activities can be part of one FraudCase)
**Business Meaning:** Fraud cases aggregate evidence from multiple related events. A single fraudulent pattern may involve multiple transactions, which are grouped into one case for investigation.

#### Subscription → User
**Relationship:** A Subscription belongs to a User
**Nature:** One-to-one (at most one active subscription per user)
**Business Meaning:** Subscriptions determine feature access tiers. A user's subscription state gates access to premium analytics, advanced features, and higher limits.

#### AuditEntry → [All Entities]
**Relationship:** An AuditEntry records a business operation on any entity
**Nature:** One-to-many from entity to audit entries (each entity operation generates an audit entry)
**Business Meaning:** Audit entries are the universal record of business operations. Every state change, every financial operation, every security event generates an audit entry. The audit trail is append-only, immutable, and retained for regulatory compliance.

### 11.4 Cross-Context Event Flows

The following describes how domain events flow between bounded contexts, enabling loose coupling while maintaining business consistency:

```
USER ONBOARDING FLOW:
UserRegistered (Auth) → creates Customer (Account)
KYCStatusChanged (Account) → enables Account creation
AccountCreated (Account) → initializes Analytics profile
AccountActivated (Account) → sends welcome Notification

MONEY TRANSFER FLOW:
TransferInitiated (Transfer) → Fraud scoring (Fraud)
FraudApproved (Fraud) → enables Transfer processing
TransferCompleted (Transfer) → debits/credits Account
TransferCompleted (Transfer) → updates Analytics
TransferCompleted (Transfer) → triggers Savings rules
TransferCompleted (Transfer) → generates Audit entry
TransferCompleted (Transfer) → sends Notification

CARD TRANSACTION FLOW:
CardTransactionAuthored (Card) → checks Account balance
CardTransactionAuthored (Card) → Fraud scoring (Fraud)
CardTransactionAuthored (Card) → updates Analytics
FraudDetected (Fraud) → freezes Card
FraudDetected (Fraud) → sends Alert Notification

SAVINGS AUTOMATION FLOW:
Transaction occurs → triggers SavingsRule evaluation
SavingsRuleTriggered (Savings) → initiates auto-transfer
Transfer completed → updates SavingsGoal progress
GoalAchieved (Savings) → sends celebration Notification

FRAUD RESPONSE FLOW:
Anomaly detected → FraudDetected event
FraudDetected → freezes Card
FraudDetected → blocks Transfer
FraudDetected → restricts Account
FraudDetected → alerts user (Notification)
FraudDetected → creates FraudCase
Fraud investigation → FraudApproved or FraudRejected
FraudApproved → unfreezes Card, unblocks Transfer
FraudRejected → maintains restrictions, notifies user
```

---

## Appendix A: Domain Model Validation Checklist

Before finalizing the domain model, verify:

| Check | Status |
|---|---|
| All bounded contexts have clear boundaries | ✓ |
| Every entity has a well-defined lifecycle | ✓ |
| Value objects are immutable and properly identified | ✓ |
| Aggregate boundaries enforce transactional consistency | ✓ |
| Domain events cover all cross-context communication | ✓ |
| Ubiquitous language is consistent and unambiguous | ✓ |
| Business rules are classified (invariant, policy, constraint) | ✓ |
| No infrastructure concerns leak into the domain model | ✓ |
| Domain services are genuinely domain-level, not technical | ✓ |
| All relationships are business relationships, not database relationships | ✓ |

## Appendix B: Domain Model Anti-Patterns to Avoid

| Anti-Pattern | Description | Prevention |
|---|---|---|
| **Anemic Domain Model** | Entities with only getters/setters; all logic in "service" classes | Rich domain models with behavior encapsulated in entities |
| **God Object** | One entity that knows about everything | Strict bounded context separation |
| **Business Logic in Infrastructure** | Rules implemented in database triggers, API middleware, or UI code | Rules live in domain layer only |
| **Leaking Persistence** | Domain model shaped by database concerns (orm annotations, table names) | Persistence ignorance in domain layer |
| **Over-Coupled Events** | Events that carry too much data or trigger too many side effects | Events carry minimal necessary data; consumers decide relevance |
| **Missing Invariants** | Business rules enforced at the API layer instead of the aggregate | Invariants enforced at aggregate boundary |

---

*This document is a living artifact. The domain model should be refined through DDD modeling workshops with domain experts. Every term, rule, and relationship should be validated against real business scenarios. The model evolves as our understanding of the domain deepens.*
