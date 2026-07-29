# FinFlow — High-Level Architecture Document

**Document Classification:** Confidential — CTO & Architecture Review
**Version:** 1.0.0
**Status:** Draft for Review
**Last Updated:** July 2026
**Supersedes:** N/A

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [Architectural Style](#2-architectural-style)
3. [High-Level System Architecture](#3-high-level-system-architecture)
4. [Domain Decomposition](#4-domain-decomposition)
5. [Internal Module Communication](#5-internal-module-communication)
6. [Layered Architecture](#6-layered-architecture)
7. [Cross-Cutting Concerns](#7-cross-cutting-concerns)
8. [Scalability Strategy](#8-scalability-strategy)
9. [Reliability Strategy](#9-reliability-strategy)
10. [Technology Decision Record](#10-technology-decision-record)
11. [Future Evolution](#11-future-evolution)

---

## 1. Architecture Philosophy

### 1.1 Guiding Principles

Every architectural decision in FinFlow traces back to eight non-negotiable principles. These are not aspirational — they are enforced through architectural governance, code review, and automated checks.

#### Principle 1: Domain-Driven Design as the Organizing Force

**Statement:** The codebase is organized around business domains, not technical layers.

**Rationale:** Traditional three-tier architectures (presentation → service → data) create an organizational mismatch: the business thinks in terms of accounts, transfers, and cards, but the code is organized by controllers, services, and repositories. This mismatch leads to bloated service classes that handle multiple domains, unclear ownership, and painful refactoring when domains evolve. By decomposing along domain boundaries, each module encapsulates a cohesive business capability. Changes to the "Card" domain do not ripple into the "Transfer" domain. Teams can reason about their module without understanding the entire system.

**Enforcement:** Every new module must define a clear domain model, bounded context, and explicit integration contracts with other modules.

#### Principle 2: Modular Monolith as the Starting Point

**Statement:** We begin as a modular monolith — a single deployable unit with strict internal boundaries — and preserve the ability to extract modules into services later.

**Rationale:** Microservices are not free. They introduce distributed system complexity: network failures, eventual consistency, distributed transactions, operational overhead of multiple deployments, and the need for sophisticated observability from day one. For a startup building an MVP, this overhead is crippling. A modular monolith gives us the organizational benefits of modularity (clear boundaries, team ownership, testable units) without the operational cost of distribution. The critical discipline is enforcing those boundaries as if we were already distributed — using internal APIs, event-based communication, and strict dependency rules.

**Enforcement:** Module boundaries are enforced at the build level (separate packages/modules), code review, and static analysis. No module may directly access another module's internal data structures.

#### Principle 3: Event-First Thinking

**Statement:** Modules communicate primarily through domain events, not direct method calls.

**Rationale:** Event-driven communication decouples modules in time and knowledge. The Account module does not need to know that the Notification module exists. It publishes an "AccountFunded" event, and any interested module reacts accordingly. This pattern is the single most important enabler for future microservice extraction: when we extract the Notification module into its own service, the event publishing mechanism simply changes from in-process to a message broker — the producing module does not change.

**Enforcement:** All inter-module communication must go through an event bus abstraction (in-process initially, replaceable with Kafka/RabbitMQ later). Direct module-to-module method calls for side-effect operations are prohibited.

#### Principle 4: Explicit over Implicit

**Statement:** All boundaries, contracts, dependencies, and behaviors must be explicitly defined. No hidden coupling, no convention-over-configuration magic.

**Rationale:** In financial systems, implicit behavior is a liability. When a module silently modifies another module's state, or when a framework convention hides a critical behavior, debugging becomes forensic archaeology. Explicit contracts between modules mean that integration points are visible, testable, and auditable.

**Enforcement:** Module interfaces are explicitly defined. Event schemas are versioned and documented. Configuration is centralized and versioned. Dependency injection is explicit.

#### Principle 5: Security as Architecture, Not Feature

**Statement:** Security is embedded in the architectural structure, not bolted on as middleware or afterthought.

**Rationale:** The financial services industry has learned repeatedly that security as a feature — something you add later — fails catastrophically. Authentication, authorization, encryption, audit logging, and fraud detection must be architectural concerns that every module inherits by design. A developer building the Savings module should not need to "remember" to add audit logging — the architecture ensures it happens automatically.

**Enforcement:** Security concerns are implemented as cross-cutting infrastructure that is mandatory at the architecture level. Modules cannot bypass security interceptors. All state mutations are audited by default.

#### Principle 6: Design for Failure

**Statement:** Every component assumes that its dependencies will fail, and every failure has a defined recovery path.

**Rationale:** In a banking platform, availability is not optional. Users need to check balances, make payments, and receive alerts at 3 AM as much as at 3 PM. Designing for failure means: circuit breakers on external calls, retry logic with exponential backoff, graceful degradation when non-critical services are unavailable, and clear blast radius containment. The system should degrade gracefully, not fail catastrophically.

**Enforcement:** All external integrations (payment processors, partner banks, third-party services) are wrapped in resilience patterns. Health checks are mandatory for every module. Failure scenarios are documented for each integration point.

#### Principle 7: Observability as a First-Class Concern

**Statement:** Every operation in the system must be observable, traceable, and measurable from the moment it enters the system to the moment it completes.

**Rationale:** In a monolithic system, debugging is relatively straightforward — everything is in one process. As we evolve toward microservices, distributed tracing becomes essential. Building observability in from day one means: structured logging with correlation IDs, distributed tracing spans, business metrics alongside technical metrics, and audit trails that satisfy regulatory requirements. When an incident occurs at 2 AM, the on-call engineer should be able to trace a user's transaction through every module and external call in seconds, not hours.

**Enforcement:** Correlation IDs are propagated through every layer. All business operations emit structured logs with standardized fields. Metrics are collected at the module boundary level.

#### Principle 8: Evolutionary Architecture

**Statement:** The architecture must accommodate change without requiring wholesale rewrites.

**Rationale:** The only constant in software is change. Business requirements evolve, regulations change, technology landscapes shift, and user expectations grow. An architecture that cannot accommodate these changes becomes a liability. Evolutionary architecture means: stable abstractions at module boundaries, feature flags for gradual rollouts, contract testing between modules, and the ability to replace internal implementations without affecting consumers.

**Enforcement:** Module interfaces are stable and versioned. Feature flags control rollout of new behavior. Contract tests validate inter-module agreements. Internal refactoring does not require changes to module consumers.

---

## 2. Architectural Style

### 2.1 The Fundamental Trade-Off

The choice of architectural style is the single most consequential decision in the system's design. It determines team structure, deployment complexity, failure modes, development velocity, and the path of future evolution.

We evaluated two primary options: **Modular Monolith** and **Microservices**.

### 2.2 Modular Monolith vs. Microservices

| Dimension | Modular Monolith | Microservices |
|---|---|---|
| **Deployment** | Single unit — simple, atomic, predictable | Multiple units — complex orchestration, partial failures |
| **Development Velocity (early)** | Fast — no network overhead, simple debugging | Slow — service boundaries, distributed tracing, contract management |
| **Development Velocity (late)** | Slows as codebase grows, module boundaries help | Faster for independent teams once foundation is established |
| **Operational Complexity** | Low — one thing to monitor, deploy, scale | High — service mesh, observability, multiple deployments |
| **Data Consistency** | Strong — single database, ACID transactions | Eventual — distributed data, saga patterns required |
| **Team Autonomy** | Moderate — shared codebase requires coordination | High — independent deployment, independent databases |
| **Cost** | Low — single infrastructure footprint | High — minimum 3x infrastructure overhead |
| **Failure Isolation** | Poor by default — one crash affects all (mitigated by modular design) | Excellent — failures contained to individual services |
| **Technology Flexibility** | Single stack — simpler to maintain | Polyglot — each service chooses its stack |
| **Testing Complexity** | Moderate — in-process testing is fast | High — integration testing across services is slow and flaky |
| **Regulatory Compliance** | Simpler — one system to audit | Complex — multiple systems, data flows, and access patterns |

### 2.3 Why Modular Monolith First

**The core argument:** At our current stage, the organizational and operational costs of microservices exceed their benefits by a wide margin.

Specific considerations for FinFlow:

1. **Team size.** We are a startup. Microservices assume multiple independent teams. With a small team, the coordination overhead of managing 15+ services, each with its own deployment pipeline, monitoring, and data store, would consume more engineering capacity than the services themselves.

2. **Data consistency.** Banking requires strong consistency for many operations. Account balance updates, transfer processing, and card authorization must be atomic. In a monolith, this is a database transaction. In microservices, this requires distributed sagas — a significant complexity increase.

3. **Regulatory simplicity.** Regulators audit systems. Auditing one system with clear internal boundaries is straightforward. Auditing 15 microservices with event-driven data flows is a multi-month exercise.

4. **Speed to market.** We need to ship an MVP. Microservices infrastructure (service mesh, API gateways, distributed tracing, circuit breakers, configuration management) takes months to build correctly. A modular monolith gives us the same domain decomposition with weeks of setup.

5. **The modular monolith is not a compromise.** If done correctly, it is a genuinely good architecture. The key is discipline: strict module boundaries, event-driven communication, and no shortcuts that create hidden coupling.

### 2.4 Migration Strategy to Microservices

The migration from modular monolith to microservices is not a future rewrite — it is an architectural evolution designed from day one.

**Stage 1: Modular Monolith (Current)**
- Single deployable unit
- In-process event bus
- Single database (schema-per-module)
- Module communication via in-process events

**Stage 2: Modular Monolith with External Events**
- Same single deployable unit
- Event bus upgraded to Kafka (or equivalent)
- Modules publish and consume events through Kafka
- This validates event schemas, latency, and operational patterns before extraction

**Stage 3: Selective Module Extraction**
- Modules with the highest independent scaling needs or team ownership boundaries are extracted into services
- Extraction criteria: team independence, scaling profile, failure isolation need, or technology divergence
- Each extraction follows a disciplined process:
  1. Define the service's public API (derived from existing module interface)
  2. Set up dedicated data store for the extracted module
  3. Route events through Kafka (already in place from Stage 2)
  4. Implement contract testing between monolith and extracted service
  5. Run in shadow mode (dual-read) before cutting traffic
  6. Decommission internal module implementation

**Stage 4: Mature Microservices Architecture**
- Critical modules extracted as services
- Remaining monolith modules either extracted or retained as appropriate
- Full distributed tracing and observability
- Service mesh for inter-service communication
- Independent deployment pipelines per service

**Extraction Priority Order (based on scaling and isolation needs):**

| Priority | Module | Rationale |
|---|---|---|
| 1 | Notification Engine | Stateless, high-throughput, independent scaling, no data consistency requirements |
| 2 | Fraud Detection | Computationally expensive, independent lifecycle, can tolerate eventual consistency |
| 3 | Analytics & Reporting | Heavy read workload, independent data needs, non-transactional |
| 4 | Card Processing | High availability requirements, independent from core account operations |
| 5 | Transfer Engine | Complex orchestration, benefits from independent scaling during peak loads |

**What we will NOT extract:**
- Core Account module — remains the monolith's nucleus or becomes the "Account Service" that everything depends on
- Authentication — remains centralized for security audit trail consistency
- Audit & Compliance — must maintain unified view across all modules

### 2.5 Anti-Patterns We Explicitly Avoid

| Anti-Pattern | Why It's Dangerous | Our Prevention |
|---|---|---|
| **Distributed Monolith** | Services coupled so tightly that they must be deployed together — all the cost of microservices, none of the benefit | Strict event-driven communication; no synchronous cross-service calls for business logic |
| **Big Ball of Mud** | No discernible structure; every change risks breaking unrelated features | Module boundaries enforced at build level |
| **Golden Hammer** | Applying the same pattern to every problem | Different modules may use different internal patterns as appropriate |
| **Shared Database** | Multiple modules directly reading/writing the same tables | Schema-per-module with explicit event-based integration |
| **Anemic Domain Model** | Business logic scattered across service layers instead of encapsulated in domain objects | Domain-Driven Design with rich domain models |

---

## 3. High-Level System Architecture

### 3.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                 │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Mobile App   │  │  Web App      │  │  Admin Panel  │  │  API       │ │
│  │  (iOS/Android)│  │  (React SPA)  │  │  (Internal)   │  │  Partners  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
└─────────┼──────────────────┼──────────────────┼────────────────┼─────────┘
          │                  │                  │                │
          ▼                  ▼                  ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDGE LAYER                                     │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  CDN          │  │  WAF / DDoS   │  │  Rate         │  │  TLS       │ │
│  │  (Static)     │  │  Protection   │  │  Limiter      │  │  Terminate │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                               │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  API Gateway (Kong / AWS API Gateway)                            │   │
│  │  - Request routing                                                │   │
│  │  - Authentication validation (JWT verification)                   │   │
│  │  - Rate limiting per user/tier                                    │   │
│  │  - Request/response transformation                                │   │
│  │  - API versioning                                                 │   │
│  │  - Circuit breaking for downstream                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER (Monolith)                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Event Bus (In-Process)                        │   │
│  │         (Replaceable with Kafka for future extraction)           │   │
│  └───────┬─────────┬──────────┬──────────┬──────────┬─────────────┘   │
│          │         │          │          │          │                   │
│  ┌───────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌─▼──────┐          │
│  │ Account   │ │Transfer│ │ Card   │ │Notif-  │ │ Fraud  │          │
│  │ Module    │ │ Module │ │ Module │ │ication │ │ Det.   │          │
│  │           │ │        │ │        │ │ Module │ │ Module │          │
│  └───────┬───┘ └───┬────┘ └───┬────┘ └───┬────┘ └─┬──────┘          │
│          │         │          │          │        │                    │
│  ┌───────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌─▼──────┐          │
│  │Auth &     │ │Savings │ │Analytics│ │Audit   │ │ Billing│          │
│  │Identity   │ │ Module │ │ Module │ │ Module │ │ Module │          │
│  │ Module    │ │        │ │        │ │        │ │        │          │
│  └───────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              Shared Infrastructure Services                      │   │
│  │  - Logging  - Validation  - Configuration  - Resilience        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   DATA LAYER      │  │   INFRASTRUCTURE  │  │   EXTERNAL       │
│                    │  │   SERVICES        │  │   SERVICES       │
│  ┌──────────────┐ │  │                  │  │                  │
│  │ Primary DB   │ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │
│  │ (PostgreSQL) │ │  │ │ Redis Cache  │ │  │ │ Partner Bank │ │
│  └──────────────┘ │  │ └──────────────┘ │  │ │ Gateway      │ │
│  ┌──────────────┐ │  │ ┌──────────────┐ │  │ └──────────────┘ │
│  │ Read Replicas│ │  │ │ Object Store │ │  │ ┌──────────────┐ │
│  │              │ │  │ │ (S3)         │ │  │ │ Payment      │ │
│  └──────────────┘ │  │ └──────────────┘ │  │ │ Processor    │ │
│  ┌──────────────┐ │  │ ┌──────────────┐ │  │ └──────────────┘ │
│  │ Event Store  │ │  │ │ Search       │ │  │ ┌──────────────┐ │
│  │ (Kafka)      │ │  │ │ (Elastic)    │ │  │ │ SMS/Email    │ │
│  └──────────────┘ │  │ └──────────────┘ │  │ │ Provider     │ │
│                    │  └──────────────────┘  │ └──────────────┘ │
│                    │                        │ ┌──────────────┐ │
│                    │                        │ │ KYC/Identity │ │
│                    │                        │ │ Provider     │ │
│                    │                        │ └──────────────┘ │
└────────────────────┘  └────────────────────┘  └────────────────┘
```

### 3.2 Component Descriptions

#### 3.2.1 Client Layer

**Mobile Application (iOS/Android)**
Native mobile applications providing the primary user interface for retail banking customers. Communicates exclusively through the API Gateway via HTTPS. Implements local encryption for sensitive data at rest. Supports push notifications, biometric authentication, and offline capability for read operations (cached transaction history, balances).

**Web Application (React SPA)**
A single-page application providing full banking functionality through web browsers. Shared component library with mobile where possible. Communicates through the same API Gateway endpoints. Implements WebAuthn for passwordless authentication support.

**Admin Panel (Internal)**
Internal tooling for FinFlow operations, compliance, and support teams. Restricted to internal network / VPN. Provides user management, transaction monitoring, fraud review queues, compliance reporting, and system health dashboards. Separate authentication chain with elevated access controls.

**Partner API**
External-facing API for future Banking-as-a-Service capabilities. Not part of MVP but architecture accounts for its future existence. Strict rate limiting, API key management, and usage monitoring from day one.

#### 3.2.2 Edge Layer

**CDN (Content Delivery Network)**
Serves static assets (JavaScript bundles, CSS, images, fonts) from edge locations closest to users. Reduces latency for initial page load and subsequent asset requests. Also provides DDoS mitigation at the edge.

**Web Application Firewall (WAF) / DDoS Protection**
First line of defense against malicious traffic. OWASP Top 10 protection, IP reputation filtering, bot detection, and volumetric DDoS mitigation. Operates before traffic reaches application infrastructure.

**Rate Limiter**
Token-bucket rate limiting applied at the edge, before traffic reaches the application. Limits configured per user tier, endpoint, and IP. Protects against brute force attacks and ensures fair resource usage.

**TLS Termination**
All external traffic encrypted with TLS 1.3. TLS terminates at the edge layer, with internal traffic optionally encrypted via mutual TLS for sensitive paths (database connections, inter-service communication in future stages).

#### 3.2.3 API Gateway Layer

The API Gateway is the single entry point for all client requests. It is not a business logic layer — it is a routing, security, and operational infrastructure layer.

**Responsibilities:**
- **Request routing** — Routes requests to the appropriate module handler based on path, version, and method
- **JWT validation** — Verifies authentication tokens; does not manage sessions (that is the Auth module's responsibility)
- **Per-user rate limiting** — Applies rate limits based on authenticated user identity and subscription tier
- **Request transformation** — Translates external API contracts to internal module interfaces
- **Response transformation** — Normalizes internal responses to external API contracts
- **API versioning** — Routes versioned API paths (v1, v2) to appropriate handlers during transitions
- **Circuit breaking** — Detects module failures and returns appropriate responses rather than hanging
- **Request logging** — Logs all incoming requests with correlation IDs for distributed tracing
- **Geographic routing** — Future capability for routing to regional deployment clusters

**What the API Gateway does NOT do:**
- Business logic
- Data transformation beyond contract normalization
- Session management
- Authorization decisions (it verifies tokens; the module enforces authorization)

#### 3.2.4 Application Layer (The Monolith)

This is the core of FinFlow. A single deployable unit containing all business modules, organized as a modular monolith with strict internal boundaries.

**Event Bus (In-Process)**
The internal nervous system of the application. An in-process publish/subscribe mechanism that enables modules to communicate without direct knowledge of each other. Designed with an interface that can be swapped for Kafka without changing module code.

**Business Modules** (detailed in Section 4)
- Account Module
- Transfer Module
- Card Module
- Notification Module
- Fraud Detection Module
- Authentication & Identity Module
- Savings Module
- Analytics Module
- Audit Module
- Billing Module

**Shared Infrastructure Services**
Reusable capabilities that all modules depend on:
- Structured logging with correlation propagation
- Input validation framework
- Configuration management
- Resilience patterns (circuit breakers, retry, bulkhead)
- Serialization/deserialization
- Time service (consistent timezone handling)

#### 3.2.5 Data Layer

**Primary Database (PostgreSQL)**
The system of record for all financial data. PostgreSQL chosen for ACID compliance, JSON support, mature ecosystem, and strong consistency guarantees required for banking. Schema-per-module design ensures data isolation between bounded contexts.

**Read Replicas**
PostgreSQL streaming replicas for read-heavy operations (analytics, reporting, transaction history). Offloads read traffic from the primary during peak periods. Eventual consistency is acceptable for read-after-write delay of < 1 second.

**Event Store (Kafka)**
Initially used only for external event publishing and audit logging. Becomes the primary inter-module communication channel in Stage 2 of evolution. Retains event history for regulatory replay and debugging.

#### 3.2.6 Infrastructure Services

**Redis Cache**
Multi-purpose caching layer:
- Session storage (encrypted, with TTL)
- Frequently accessed data cache (user profiles, account summaries)
- Distributed rate limiting counters
- Feature flag storage
- Pub/Sub for real-time notifications (fallback, not primary)

**Object Storage (S3-compatible)**
Stores non-relational data:
- User-uploaded documents (KYC documents, identity verification photos)
- Generated statements and reports
- Static assets not served by CDN
- Audit log archives

**Search Engine (Elasticsearch)**
Full-text search and analytics:
- Transaction search with fuzzy matching
- Merchant name resolution
- Operational log search (devops)
- Compliance reporting queries

#### 3.2.7 External Services

**Partner Bank Gateway**
Integration with the Banking-as-a-Service (BaaS) provider that provides the actual banking charter, FDIC insurance, and regulatory coverage. All core banking operations (account creation, ACH processing, wire transfers) ultimately flow through this gateway. Circuit breaker pattern is critical here — partner bank downtime must not make FinFlow completely unusable.

**Payment Processor**
Card network integration (Visa/Mastercard) for debit card authorization, settlement, and dispute management. Direct integration with processor for real-time authorization.

**SMS/Email Provider**
Transactional messaging infrastructure for:
- OTP delivery (SMS and email)
- Account notifications (email and push)
- Marketing communications (email, opt-in only)
- Document delivery (encrypted email)

**KYC/Identity Provider**
Third-party identity verification service for:
- Document verification (passport, driver's license)
- Liveness detection
- Sanctions screening (OFAC, PEP)
- Ongoing monitoring for adverse media

---

## 4. Domain Decomposition

### 4.1 Bounded Context Identification

The domain is decomposed into modules based on Domain-Driven Design principles. Each module represents a bounded context — a boundary within which a particular domain model applies and is consistent.

```
┌──────────────────────────────────────────────────────────────────┐
│                    FINFLOW DOMAIN MAP                             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Account     │  │  Transfer   │  │  Card       │             │
│  │  Domain      │  │  Domain     │  │  Domain     │             │
│  │             │  │             │  │             │             │
│  │  - Accounts │  │  - ACH      │  │  - Virtual  │             │
│  │  - Balances │  │  - Wires    │  │  - Physical │             │
│  │  - KYC      │  │  - P2P      │  │  - Auth     │             │
│  │  - Status   │  │  - FX       │  │  - Limits   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                      │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐             │
│  │  Savings    │  │  Auth &     │  │  Notif-     │             │
│  │  Domain     │  │  Identity   │  │  ication    │             │
│  │             │  │  Domain     │  │  Domain     │             │
│  │  - Goals    │  │             │  │             │             │
│  │  - Rules    │  │  - Login    │  │  - Push     │             │
│  │  - Interest │  │  - Sessions │  │  - SMS      │             │
│  │  - Round-up │  │  - 2FA      │  │  - Email    │             │
│  └─────────────┘  │  - Passkeys │  │  - In-App   │             │
│                    └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Fraud      │  │  Analytics  │  │  Audit      │             │
│  │  Detection  │  │  Domain     │  │  Domain     │             │
│  │  Domain     │  │             │  │             │             │
│  │             │  │  - Spending │  │  - Logs     │             │
│  │  - Rules    │  │  - Reports  │  │  - Trail    │             │
│  │  - ML Score │  │  - Forecasts│  │  - Compli-  │             │
│  │  - Alerts   │  │  - Insights │  │    ance     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─────────────┐                                                 │
│  │  Billing    │                                                 │
│  │  Domain     │                                                 │
│  │             │                                                 │
│  │  - Subscriptions                                              │
│  │  - Invoices  │                                                 │
│  │  - Revenue   │                                                 │
│  └─────────────┘                                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Module Specifications

#### 4.2.1 Account Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Account lifecycle management (creation, activation, suspension, closure), balance tracking and inquiry, account type management (checking, savings, business), KYC status tracking, account metadata management |
| **Bounded Context** | Everything related to the existence, status, and properties of a financial account |
| **Ownership** | Core Banking Team |
| **Key Domain Concepts** | Account, AccountType, AccountStatus, Balance, Hold, AccountLimits |
| **Published Events** | AccountCreated, AccountActivated, AccountSuspended, AccountClosed, BalanceUpdated, KYCStatusChanged, AccountFunded |
| **Consumed Events** | TransferCompleted (balance update), CardTransaction (balance update), InterestAccrued (balance update) |
| **Dependencies** | Auth & Identity (identity verification), Audit (account activity logging) |
| **Future Microservice Potential** | HIGH — This is the core service. Extraction priority: 4 (after supporting services are extracted first, account remains the nucleus) |

**Design Decisions:**
- Balance is always read from the database (source of truth), never from cache alone
- Holds and pending transactions are tracked separately from available balance
- Account status transitions are strictly governed by a state machine
- All balance mutations are idempotent

#### 4.2.2 Transfer Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Money movement between accounts (internal, ACH, wire, P2P), FX conversion for international transfers, transfer status tracking, transfer limit enforcement, recurring transfer scheduling |
| **Bounded Context** | All operations that move money from one account to another |
| **Ownership** | Payments Team |
| **Key Domain Concepts** | Transfer, TransferType, TransferStatus, TransferLimit, FXRate, RecurringTransfer |
| **Published Events** | TransferInitiated, TransferProcessing, TransferCompleted, TransferFailed, TransferReversed |
| **Consumed Events** | AccountFunded (triggers limit resets), FraudApproved (enables transfer), FraudRejected (blocks transfer) |
| **Dependencies** | Account (balance verification, account existence), Card (debit card transfers), Fraud Detection (risk scoring), Partner Bank Gateway (external transfers) |
| **Future Microservice Potential** | HIGH — Transfer processing has different scaling and availability requirements than core accounts. Extraction priority: 5 |

**Design Decisions:**
- Every transfer goes through a status machine: Initiated → Validated → Processing → Completed/Failed/Reversed
- Limit checks happen before any external calls (fail fast)
- Partner bank calls are wrapped in circuit breakers with fallback to queuing
- FX rates are locked at initiation time with a configurable TTL

#### 4.2.3 Card Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Virtual and physical card lifecycle (issuance, activation, freeze, unfreeze, replacement, closure), card authorization processing, spending limit management, card controls (merchant category blocks, geographic restrictions) |
| **Bounded Context** | Everything related to payment cards — virtual, physical, and their operational state |
| **Ownership** | Payments Team |
| **Key Domain Concepts** | Card, CardType, CardStatus, CardLimit, CardControls, AuthorizationRequest |
| **Published Events** | CardIssued, CardActivated, CardFrozen, CardUnfrozen, CardDeclined, CardTransactionAuthored, CardLimitChanged |
| **Consumed Events** | AccountSuspended (auto-freeze cards), FraudDetected (auto-freeze card), AccountClosed (return cards) |
| **Dependencies** | Account (linked account, balance check), Payment Processor (card network integration), Fraud Detection (real-time scoring) |
| **Future Microservice Potential** | HIGH — Card authorization requires sub-100ms latency and high availability independent of other modules. Extraction priority: 4 |

**Design Decisions:**
- Card numbers are never stored in plaintext; tokenization via payment processor
- Real-time authorization checks: balance, limits, controls, fraud score — all in < 100ms
- Card freeze is instantaneous (no external calls needed)
- Physical card status is tracked separately from virtual card

#### 4.2.4 Authentication & Identity Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | User registration and identity management, authentication (password, biometric, passkey), session management, multi-factor authentication, device management, password/reset flows, access control policy enforcement |
| **Bounded Context** | User identity, authentication, authorization, and session lifecycle |
| **Ownership** | Security Team |
| **Key Domain Concepts** | User, Credential, Session, Device, MFAMethod, AccessPolicy, AuthToken |
| **Published Events** | UserRegistered, UserAuthenticated, SessionCreated, SessionExpired, DeviceTrusted, PasswordChanged, MFAMethodAdded |
| **Consumed Events** | AccountSuspended (invalidate sessions), AccountClosed (invalidate all) |
| **Dependencies** | None (foundational module — everything depends on it, but it depends on nothing) |
| **Future Microservice Potential** | LOW — Must remain centralized for security audit consistency. May be deployed as a dedicated service but should not be duplicated |

**Design Decisions:**
- Authentication is stateless (JWT with short TTL, refresh token rotation)
- Sessions are stored in Redis with configurable TTL per device type
- Biometric verification happens client-side; server receives a signed assertion
- Account lockout uses exponential backoff, not fixed delays
- Passkeys are supported as primary authentication method (WebAuthn)

#### 4.2.5 Savings Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Savings goal creation and tracking, automated savings rules (round-ups, percentage triggers, recurring transfers), interest calculation and accrual, savings account features (limited transactions per month per Regulation D) |
| **Bounded Context** | Goal-oriented savings, automated savings behaviors, and interest accrual |
| **Ownership** | Core Banking Team |
| **Key Domain Concepts** | SavingsGoal, SavingsRule, InterestRate, Accrual, RoundUpRule |
| **Published Events** | GoalCreated, GoalAchieved, SavingsRuleActivated, SavingsRuleTriggered, InterestAccrued |
| **Consumed Events** | TransferCompleted (evaluate savings rules), BalanceUpdated (check goal progress) |
| **Dependencies** | Account (linked account, balance), Transfer (automated transfers to savings) |
| **Future Microservice Potential** | LOW — Tightly coupled with account operations. Better retained within the core banking context |

**Design Decisions:**
- Interest accrual runs as a scheduled job, not real-time
- Savings rules are evaluated asynchronously after transfer completion
- Regulation D compliance enforced at the module level (6 transfers per month limit)

#### 4.2.6 Notification Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Multi-channel notification delivery (push, SMS, email, in-app), notification preference management, template management, delivery status tracking, retry and failed delivery handling |
| **Bounded Context** | User-facing communications across all channels |
| **Ownership** | Platform Team |
| **Key Domain Concepts** | Notification, NotificationChannel, NotificationTemplate, DeliveryStatus, UserPreferences |
| **Published Events** | NotificationSent, NotificationDelivered, NotificationFailed, NotificationRead |
| **Consumed Events** | All domain events that trigger user notifications (transfer completed, fraud alert, low balance, etc.) |
| **Dependencies** | Auth & Identity (user contact information, preferences), external SMS/Email/Push providers |
| **Future Microservice Potential** | HIGH — Stateless, independent scaling, different failure mode than core banking. Extraction priority: 1 |

**Design Decisions:**
- Notification delivery is asynchronous and best-effort (non-critical path)
- Critical notifications (fraud alerts) use multiple channels simultaneously
- Notification preferences are respected; channel fallback chains configurable
- Delivery failures are retried with exponential backoff, then queued for manual review

#### 4.2.7 Fraud Detection Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Real-time transaction risk scoring, rule-based fraud detection, ML-based anomaly detection (future), fraud alert generation, transaction blocking (with manual review), fraud case management |
| **Bounded Context** | All fraud prevention, detection, and response operations |
| **Ownership** | Risk & Compliance Team |
| **Key Domain Concepts** | FraudRule, RiskScore, FraudAlert, FraudCase, TransactionPattern, AnomalyDetection |
| **Published Events** | FraudDetected, FraudApproved, FraudRejected, FraudCaseOpened, FraudCaseResolved |
| **Consumed Events** | TransferInitiated (risk scoring), CardTransactionAuthored (risk scoring), AccountCreated (initial risk profile) |
| **Dependencies** | Account (user profile), Transfer (transaction details), Card (card details), Auth (login patterns) |
| **Future Microservice Potential** | HIGH — Computationally expensive, benefits from independent scaling and ML infrastructure. Extraction priority: 2 |

**Design Decisions:**
- Real-time scoring must complete in < 50ms (does not block transfers; scoring is asynchronous but must be fast for synchronous decisions)
- Rules engine is configurable without deployment (admin panel)
- ML models are trained offline, served online via model serving infrastructure
- False positive rate is a tracked business metric (target: < 1%)

#### 4.2.8 Analytics Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Spending categorization and analytics, budget tracking and reporting, cash flow forecasting, financial insights generation, monthly/weekly reports, merchant intelligence |
| **Bounded Context** | User-facing financial intelligence and reporting |
| **Ownership** | Data & Insights Team |
| **Key Domain Concepts** | SpendingCategory, Budget, CashFlowForecast, FinancialInsight, Report |
| **Published Events** | InsightGenerated, ReportReady, BudgetAlertTriggered |
| **Consumed Events** | TransferCompleted (spending analysis), CardTransactionAuthored (spending analysis), AccountFunded (income tracking) |
| **Dependencies** | Account (account data), Transfer (transaction data), Card (card transaction data) |
| **Future Microservice Potential** | HIGH — Heavy read workload, independent data pipeline needs. Extraction priority: 3 |

**Design Decisions:**
- Analytics operate on a read-optimized data projection (eventual consistency acceptable)
- Spending categorization uses a combination of merchant database matching and ML classification
- Reports are generated asynchronously and stored in object storage
- Cash flow forecasts use historical patterns with configurable confidence intervals

#### 4.2.9 Audit Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Immutable audit trail for all business operations, compliance logging, regulatory reporting data collection, access logging, change tracking |
| **Bounded Context** | Complete audit trail and compliance data |
| **Ownership** | Compliance Team |
| **Key Domain Concepts** | AuditEntry, AuditAction, ComplianceRecord, AccessLog, ChangeRecord |
| **Published Events** | AuditEntryCreated (for compliance monitoring) |
| **Consumed Events** | ALL domain events (the audit module subscribes to everything) |
| **Dependencies** | None (passive consumer of all events) |
| **Future Microservice Potential** | LOW — Must maintain unified view. Best deployed as a dedicated service that consumes the event stream |

**Design Decisions:**
- Audit entries are append-only; no updates, no deletes
- Audit log is stored in a write-optimized, append-only data store
- Retention policy: 7 years minimum (regulatory requirement)
- Audit entries include: who, what, when, where (IP/device), outcome, correlation ID
- Audit module has read access to all modules' data for compliance queries

#### 4.2.10 Billing Module

| Attribute | Detail |
|---|---|
| **Responsibilities** | Subscription tier management, premium feature access control, invoice generation, revenue tracking, promotional pricing and credits |
| **Bounded Context** | All monetization, billing, and subscription operations |
| **Ownership** | Business Operations Team |
| **Key Domain Concepts** | Subscription, Plan, Invoice, Payment, PromoCode, Credit |
| **Published Events** | SubscriptionCreated, SubscriptionChanged, SubscriptionCancelled, InvoiceGenerated, PaymentProcessed |
| **Consumed Events** | UserRegistered (trial activation), AccountClosed (subscription cancellation) |
| **Dependencies** | Auth & Identity (user identity), Account (billing account), external payment processor |
| **Future Microservice Potential** | MEDIUM — Relatively independent but low scaling needs initially |

**Design Decisions:**
- Subscription state changes are event-driven (not polling)
- Failed payment retries follow a defined dunning schedule
- Promotional codes have defined validity periods and usage limits
- Invoice generation is batched (daily) to reduce processing overhead

---

## 5. Internal Module Communication

### 5.1 Communication Principles

Modules must collaborate to deliver business value, but that collaboration must not create hidden coupling. Three communication patterns are used, ordered from most preferred to least preferred:

### 5.2 Event-Based Communication (Preferred)

**Pattern:** A module publishes a domain event. Other modules subscribe to events they care about and react independently.

**When to use:** For side effects, notifications, analytics, audit logging, and any operation where the producing module should not need to know about the consumer.

**Characteristics:**
- Loosely coupled: producer does not know about consumers
- Temporally decoupled: consumer does not need to be available at publish time
- Asynchronous: producer does not wait for consumer to complete
- One-to-many: multiple modules can react to the same event

**Example flow:**

```
Transfer Module                    Event Bus                    Notification Module
     │                                │                                │
     │  TransferCompleted             │                                │
     │  {to, from, amount, ...}       │                                │
     │───────────────────────────────►│                                │
     │                                │  TransferCompleted             │
     │                                │───────────────────────────────►│
     │                                │                                │
     │                                │                    Send notification to user
     │                                │                                │
     │                                │                    NotificationModule completes
     │                                │                                │
     │  (Transfer Module is unaware   │                                │
     │   that notifications were sent)│                                │
```

**Event Schema Contract:**
Every event must include:
- Event ID (UUID)
- Event type (versioned, e.g., "TransferCompleted.v1")
- Timestamp (UTC)
- Correlation ID (traces the original request)
- Aggregate ID (the entity this event relates to)
- Event payload (domain-specific data)

**Event versioning:** Events are versioned. Breaking changes require a new version number. Old versions are supported for a deprecation period (90 days minimum).

### 5.3 Interface-Based Communication (When Synchronous is Required)

**Pattern:** A module defines a public interface (contract) that other modules can call synchronously.

**When to use:** When the producing module needs an immediate answer to continue its own operation. Example: the Transfer module needs to verify the Account module's balance before initiating a transfer.

**Characteristics:**
- Tighter coupling: caller depends on the interface of the callee
- Temporally coupled: callee must be available
- Synchronous: caller waits for response
- One-to-one: direct communication between two modules

**Contract rules:**
- Public interfaces are explicitly defined and versioned
- Modules may NOT access other modules' internal implementations, repositories, or domain objects
- Interface methods must be idempotent where possible
- Interface methods must have clear error contracts (what errors can be thrown)

**Dependency direction:** Dependencies flow inward. Domain modules depend on infrastructure, not the reverse. Cross-module dependencies are mediated through interfaces or events, never through direct repository access.

```
┌──────────────────────────────────────────────┐
│              Dependency Direction              │
│                                                │
│    ┌──────────┐     ┌──────────┐              │
│    │ Transfer │────►│ Account  │              │
│    │ Module   │     │ Module   │              │
│    └──────────┘     └──────────┘              │
│         │                │                    │
│         │                │                    │
│         ▼                ▼                    │
│    ┌──────────────────────────────┐          │
│    │     Infrastructure Layer      │          │
│    │  (Event Bus, DB, Cache, etc) │          │
│    └──────────────────────────────┘          │
│                                                │
│  ✓ Transfer depends on Account's PUBLIC interface  │
│  ✗ Transfer NEVER accesses Account's repositories  │
│  ✗ Account NEVER depends on Transfer               │
└──────────────────────────────────────────────────────┘
```

### 5.4 Shared Kernel (Minimum Viable Shared Code)

**Pattern:** A small set of shared types, interfaces, and utilities that all modules depend on.

**When to use:** Only for truly universal concepts that cannot belong to any single module.

**What belongs in the shared kernel:**
- Base domain types (AggregateId, Money, Currency, Timestamp)
- Event base types and interfaces
- Common value objects (Email, PhoneNumber, Address)
- Shared infrastructure interfaces (EventBus, Cache, Logger)

**What does NOT belong in the shared kernel:**
- Business logic
- Module-specific types
- Infrastructure implementations
- Configuration

### 5.5 Transaction Boundaries

**Principle:** Each module's public interface methods that modify state are transactional boundaries.

**Rules:**
- A single business operation within one module executes within a single database transaction
- Cross-module state changes that must be atomic use the Saga pattern (see below)
- Read operations across modules do not require transactional consistency (eventual consistency is acceptable)

**Saga Pattern for Cross-Module Operations:**

When an operation spans multiple modules and must maintain consistency, a choreography-based saga coordinates the flow:

```
Transfer Saga (Choreography):

1. Transfer Module: ValidateTransfer → emit TransferValidated
2. Account Module: DebitSourceAccount → emit SourceAccountDebited
3. Account Module: CreditDestinationAccount → emit DestinationAccountCredited
4. Transfer Module: FinalizeTransfer → emit TransferCompleted

Compensating actions (on failure):
- If CreditDestinationAccount fails → Account Module: ReverseSourceDebit → emit SourceDebitReversed
- Transfer Module: MarkTransferFailed → emit TransferFailed
```

**Saga guarantees:**
- Eventual consistency (not immediate)
- Every step has a compensating action
- Sagas are idempotent at each step
- Saga state is tracked for monitoring and debugging

### 5.6 Module Boundary Enforcement

| Mechanism | Purpose |
|---|---|
| **Package/module structure** | Each module is a separate package with public and internal visibility |
| **Build-level enforcement** | Module A cannot import from Module B's internal packages |
| **Interface-based access** | Cross-module access only through explicitly defined public interfaces |
| **Event-based decoupling** | Side effects always through events, never direct calls |
| **Contract testing** | Automated tests verify that module interfaces are not broken |
| **Architecture fitness functions** | Automated checks that enforce dependency rules (no circular dependencies, no unauthorized cross-module access) |

---

## 6. Layered Architecture

### 6.1 Layer Overview

Within each module, a four-layer architecture separates concerns from outermost (user-facing) to innermost (domain logic):

```
┌─────────────────────────────────────────────────────────────┐
│                    MODULE INTERNAL LAYERS                     │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  PRESENTATION LAYER                                      │ │
│  │  Controllers, DTOs, Request/Response mapping              │ │
│  └─────────────────────────┬───────────────────────────────┘ │
│                              │                                 │
│  ┌─────────────────────────▼───────────────────────────────┐ │
│  │  APPLICATION LAYER                                       │ │
│  │  Use Cases, Orchestration, Transaction boundaries         │ │
│  └─────────────────────────┬───────────────────────────────┘ │
│                              │                                 │
│  ┌─────────────────────────▼───────────────────────────────┐ │
│  │  DOMAIN LAYER                                            │ │
│  │  Domain Models, Business Rules, Domain Events,           │ │
│  │  Domain Services, Repository Interfaces                  │ │
│  └─────────────────────────┬───────────────────────────────┘ │
│                              │                                 │
│  ┌─────────────────────────▼───────────────────────────────┐ │
│  │  INFRASTRUCTURE LAYER                                    │ │
│  │  Repository Implementations, External Integrations,       │ │
│  │  Event Publishing, Cache Access, Config                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Layer Responsibilities

#### Presentation Layer

**Purpose:** Translates external requests into application commands and externalizes internal responses.

**Responsibilities:**
- HTTP request parsing and validation (structure, types, required fields)
- DTO-to-command mapping (external contracts to internal use case inputs)
- Command-to-response mapping (internal results to external contracts)
- HTTP status code assignment
- Request correlation ID injection
- Content negotiation (JSON format)

**Rules:**
- Contains zero business logic
- Contains zero data access logic
- Does not make decisions about business rules
- Does not call infrastructure directly (only through application layer)
- May validate request format but NOT business validity

#### Application Layer

**Purpose:** Orchestrates business operations. Contains use cases — the "verbs" of the system.

**Responsibilities:**
- Use case implementation (e.g., "InitiateTransfer", "FreezeCard", "CreateSavingsGoal")
- Transaction boundary management (begin, commit, rollback)
- Cross-module communication (calling other modules' interfaces, publishing events)
- Authorization checks (does this user have permission for this operation?)
- Input validation against business rules (before domain model is involved)
- Audit trail entry creation
- Correlation ID propagation

**Rules:**
- Contains no business rules (that belongs to domain layer)
- Contains no data access code (that belongs to infrastructure layer)
- Is the ONLY layer that coordinates cross-module interactions
- Orchestrates domain objects but does not replace them
- Each use case is a single class/method with a single responsibility

#### Domain Layer

**Purpose:** Contains the core business logic and domain model. The heart of the system.

**Responsibilities:**
- Domain model (aggregates, entities, value objects)
- Business rule enforcement (invariant checking, state transitions)
- Domain event definition and emission
- Domain service implementation (business logic that spans multiple entities)
- Repository interface definition (the domain defines what it needs; infrastructure provides it)

**Rules:**
- Contains ZERO infrastructure dependencies (no database, no cache, no external services)
- Contains ZERO framework dependencies (no Spring, no HTTP, no serialization)
- Is the innermost layer — it depends on nothing
- Is testable in complete isolation
- Business rules are expressed in the domain language, not technical language

**Example domain model conceptual structure:**

```
Account Aggregate:
├── AccountId (value object)
├── AccountStatus (value object with state machine)
├── Balance (value object)
├── AvailableBalance (value object)
├── Holds (collection of Hold entities)
├── Business Rules:
│   ├── CanDebit(amount) → bool
│   ├── CanCredit(amount) → bool
│   ├── CanTransferTo(destination) → bool
│   └── Status transitions (state machine)
└── Domain Events:
    ├── AccountDebited(amount, resultingBalance)
    ├── AccountCredited(amount, resultingBalance)
    └── HoldPlaced(amount, reason)
```

#### Infrastructure Layer

**Purpose:** Provides implementations for everything the domain and application layers need but don't own.

**Responsibilities:**
- Repository implementations (database queries, data mapping)
- Event publishing implementation (in-process bus or Kafka)
- External service integration (partner bank, payment processor, KYC provider)
- Cache implementation
- Configuration loading
- Logging implementation
- File storage operations

**Rules:**
- Implements interfaces defined by the domain layer (dependency inversion)
- Adapts external system APIs to internal domain concepts
- Contains all framework-specific code (Spring, JPA, etc.)
- Is the only layer that knows about databases, HTTP clients, and external systems
- Can be replaced entirely without affecting domain or application layers

### 6.3 Data Flow Through Layers

```
HTTP Request
    │
    ▼
Presentation Layer ── Parse & Validate Request Format
    │
    ▼
Application Layer ── Authorization Check → Load Domain Objects → Execute Use Case
    │                          │                    │                    │
    │                    (Infrastructure)      (Domain)          (Domain + Events)
    │
    ▼
Domain Layer ── Business Rules → State Changes → Emit Events
    │
    ▼
Infrastructure Layer ── Persist Changes → Publish Events → External Calls
    │
    ▼
Application Layer ── Commit Transaction → Return Result
    │
    ▼
Presentation Layer ── Map to Response DTO
    │
    ▼
HTTP Response
```

### 6.4 Layer Dependency Rules

| Rule | Enforcement |
|---|---|
| Presentation → Application → Domain ← Infrastructure | Dependency direction is strictly inward; domain depends on nothing |
| Domain defines repository interfaces; Infrastructure implements them | Dependency Inversion Principle |
| Cross-module calls go through Application layer only | Domain layer does not call other modules |
| Infrastructure layer is replaceable | Swapping database, cache, or external service only affects infrastructure layer |

---

## 7. Cross-Cutting Concerns

### 7.1 Logging

**Approach:** Structured logging with correlation IDs propagated through all layers.

**Requirements:**
- All log entries are structured (JSON format) with standardized fields
- Every request receives a correlation ID at the edge layer, propagated through all layers
- Log levels: ERROR (system errors), WARN (degraded but functional), INFO (significant business events), DEBUG (diagnostic information)
- Sensitive data (passwords, account numbers, SSN) is NEVER logged
- Card numbers are masked (show last 4 only)
- All logs include: timestamp, correlation ID, module name, class name, log level, message
- Business-critical operations log both entry and exit with timing

**Log retention:** Hot storage (30 days), warm storage (1 year), cold/archive (7 years for regulatory compliance).

### 7.2 Validation

**Approach:** Multi-level validation with clear responsibility boundaries.

| Level | What is Validated | Where |
|---|---|---|
| Format validation | Data types, required fields, string lengths, email format | Presentation Layer |
| Business rule validation | Sufficient balance, transfer limits, account status, business invariants | Domain Layer |
| Cross-module validation | Account existence, user authorization, cross-module invariants | Application Layer |
| External validation | KYC verification, sanctions screening, address verification | Infrastructure Layer (external calls) |

**Principle:** Fail fast. Format validation happens first (cheapest), business validation second, external validation last (most expensive).

### 7.3 Exception Handling

**Approach:** Structured exception hierarchy with global exception handling and module-specific error translation.

**Exception hierarchy:**

```
FinFlowException (base)
├── DomainException (business rule violations)
│   ├── InsufficientBalanceException
│   ├── TransferLimitExceededException
│   ├── AccountFrozenException
│   └── InvalidStateTransitionException
├── AuthenticationException (auth failures)
│   ├── InvalidCredentialsException
│   ├── SessionExpiredException
│   └── MFRequiredException
├── AuthorizationException (permission failures)
│   ├── InsufficientPermissionsException
│   └── AccountAccessDeniedException
├── ValidationException (input validation)
│   ├── InvalidInputException
│   └── RequiredFieldMissingException
├── IntegrationException (external service failures)
│   ├── PartnerBankUnavailableException
│   ├── PaymentProcessorException
│   └── KYCServiceException
└── InfrastructureException (system failures)
    ├── DatabaseException
    ├── CacheException
    └── EventPublishException
```

**Global exception handler** translates internal exceptions to appropriate HTTP status codes and standardized error responses. Internal stack traces are NEVER exposed to clients.

### 7.4 Security

**Approach:** Security implemented as architectural layers, not feature additions.

| Security Concern | Implementation |
|---|---|
| Authentication | JWT-based with short TTL (15 minutes), refresh token rotation |
| Authorization | Role-based access control (RBAC) with resource-level permissions |
| Data encryption at rest | AES-256 for all sensitive data; field-level encryption for PII |
| Data encryption in transit | TLS 1.3 for all communications; mTLS for internal service communication |
| Input sanitization | Parameterized queries (no raw SQL), input encoding, CSRF protection |
| Rate limiting | Per-user, per-endpoint, and global rate limits |
| Fraud detection | Real-time scoring on all financial operations |
| Audit logging | Immutable audit trail for all state changes |
| Secret management | Vault-based secret management, no secrets in code or config files |
| Dependency scanning | Automated vulnerability scanning of all dependencies |
| Penetration testing | Quarterly third-party penetration tests |

### 7.5 Configuration

**Approach:** Centralized, environment-aware configuration with hierarchical overrides.

**Configuration sources (in priority order):**
1. Environment variables (highest priority, for secrets and environment-specific values)
2. Configuration files (per-environment: dev, staging, production)
3. Default values (compiled into the application)
4. Feature flags (for runtime behavior changes)

**Configuration categories:**
- **Infrastructure:** Database connections, cache hosts, Kafka brokers
- **External services:** API keys, service endpoints, timeout values
- **Business rules:** Transfer limits, fee schedules, lockout thresholds
- **Feature flags:** Toggle features without deployment
- **Security:** Session TTLs, password policies, encryption keys

**Sensitive configuration** (API keys, database credentials, encryption keys) is stored in a secrets management system (HashiCorp Vault or cloud-native equivalent), never in files or environment variables directly.

### 7.6 Caching

**Approach:** Multi-level caching with clear invalidation strategies.

| Cache Level | What | TTL | Invalidation |
|---|---|---|---|
| Client-side | Transaction history, user preferences | 5 minutes | Pull-based refresh |
| CDN | Static assets, public API responses | 1 hour | Versioned asset names |
| Application (Redis) | User sessions, rate limit counters, frequently accessed data | Varies by data type | Event-driven invalidation |
| Database query cache | Repeated query results | 30 seconds | Time-based expiry |
| Materialized views | Analytics aggregations | 5 minutes | Scheduled refresh |

**Cache-aside pattern** for most data: application checks cache first, falls back to database, writes to cache. Write-through for data that must be immediately consistent.

**Cache invalidation events:** When a module publishes a domain event that affects cached data, a cache invalidation message is published. Subscribers invalidate their relevant cache entries.

### 7.7 Auditing

**Approach:** Comprehensive, immutable audit trail for all business operations.

**What is audited:**
- All financial transactions (transfers, card transactions, balance changes)
- All account state changes (creation, status changes, closure)
- All authentication events (login, logout, password change, failed attempts)
- All administrative actions (support agent actions, compliance reviews)
- All configuration changes (business rule changes, limit changes)
- All data access (who accessed what user data and when)

**Audit entry structure:**
- Unique entry ID
- Timestamp (UTC, microsecond precision)
- Correlation ID (links to originating request)
- Actor (user ID, system process, or admin ID)
- Action performed
- Target entity (type, ID)
- Before state (for state changes)
- After state (for state changes)
- IP address / device information
- Outcome (success/failure)

**Audit guarantees:**
- Append-only (no updates, no deletes)
- Stored in a write-optimized, tamper-evident data store
- Retained for minimum 7 years
- Accessible for regulatory examination
- Independently verifiable (hash chain integrity)

### 7.8 Monitoring

**Approach:** Three pillars of observability — metrics, logs, and traces — unified through correlation IDs.

**Metrics:**
- **Business metrics:** Transaction volume, transfer success rate, user active rate, revenue per user
- **Technical metrics:** Request latency (p50, p95, p99), error rate, throughput, resource utilization
- **Infrastructure metrics:** CPU, memory, disk, network, database connections, cache hit rate
- **SLA metrics:** Availability, response time, error budget consumption

**Distributed tracing:**
- Every request generates a trace spanning all layers and modules
- Traces include timing for each span (layer, module, external call)
- Traces are sampled at 100% for errors, 10% for successes (configurable)
- Trace context propagated across module boundaries and external calls

**Alerting:**
- **Critical (P1):** System down, data loss risk, security breach → Immediate page
- **High (P2):** Degraded performance, elevated error rate, external service failure → Alert within 5 minutes
- **Medium (P3):** Unusual patterns, approaching thresholds → Alert within 1 hour
- **Low (P4):** Informational, trends → Daily digest

**Dashboards:**
- Real-time system health dashboard (all P1/P2 metrics)
- Business operations dashboard (transaction volumes, revenue, user growth)
- Module-level dashboards (per-module latency, error rates, throughput)
- On-call runbook linked to every alert

---

## 8. Scalability Strategy

### 8.1 Horizontal Scaling

**Stateless Application Tier:**
The application servers (monolith instances) are stateless. Any instance can handle any request. This enables horizontal scaling by simply adding more instances behind a load balancer.

**Scaling trigger:** CPU utilization > 70% sustained for 5 minutes, or response time p95 > 500ms.

**Scaling ceiling:** The modular monolith can scale horizontally to approximately 20-30 instances before operational complexity approaches that of microservices. At that point, module extraction is warranted.

**Load balancing:** Round-robin with health-check-based routing. Sticky sessions are NOT used (statelessness requirement).

### 8.2 Vertical Scaling

For the initial deployment, vertical scaling (larger instances) is simpler and more cost-effective than horizontal scaling. The database benefits most from vertical scaling (more CPU, more RAM for query caching).

**Vertical scaling limits:**
- Application: Up to 16 vCPU / 64 GB RAM per instance
- Database: Up to 64 vCPU / 256 GB RAM (primary), with read replicas for horizontal read scaling

### 8.3 Stateless Services

**Session state** is externalized to Redis. Application servers hold no session state. This is non-negotiable for horizontal scaling.

**Request context** (user identity, permissions, correlation ID) is carried in the JWT token and propagated through the request. No server-side session state is required for request processing.

**Feature flags** are fetched from a centralized store (Redis or feature flag service) and cached locally with a short TTL. Not stateful.

### 8.4 Session Strategy

```
┌──────────────────────────────────────────────────────┐
│                SESSION ARCHITECTURE                    │
│                                                        │
│  Client                                                │
│    │                                                   │
│    │ 1. Login → receives JWT (15 min TTL) +           │
│    │            Refresh Token (7 day TTL, rotate)      │
│    │                                                   │
│    │ 2. Subsequent requests include JWT in header      │
│    │                                                   │
│    │ 3. API Gateway validates JWT (stateless)          │
│    │                                                   │
│    │ 4. If JWT expired → use Refresh Token             │
│    │                                                   │
│    │ 5. Refresh Token rotation: old token invalidated   │
│    │                                                   │
│  Redis (Session Store)                                 │
│    │                                                   │
│    │  - Active sessions (for force-logout capability)  │
│    │  - Refresh token blacklist (revoked tokens)        │
│    │  - Rate limit counters                             │
│    │  - Feature flag cache                              │
│    │                                                   │
└──────────────────────────────────────────────────────┘
```

**Session lifecycle:**
- JWT access token: 15-minute TTL, contains user identity and permissions
- Refresh token: 7-day TTL, single-use with rotation (each use issues a new refresh token)
- Device binding: Refresh tokens are bound to device fingerprint
- Concurrent sessions: Maximum 2 active sessions per device type (mobile + web)
- Forced logout: All sessions invalidated by removing refresh tokens from Redis

### 8.5 Cache Strategy

**Cache hierarchy:**

```
Request → Client Cache (ETag) → CDN → API Gateway Cache → Redis Cache → Application Cache → Database
```

**Cache-aside pattern (primary):**
1. Application checks Redis for data
2. Cache hit → return cached data
3. Cache miss → query database, store in Redis, return data
4. On write → invalidate relevant cache entries

**Cache warming:**
- Proactive cache warming for high-traffic data (user profiles, account summaries) during off-peak hours
- Predictive pre-loading based on user access patterns (e.g., pre-load dashboard data when user opens app)

**Cache consistency:**
- Strong consistency not required for most cached data (eventual consistency with < 1 second delay acceptable)
- Financial balance data is NEVER served from cache alone (always verified against database)
- Cache invalidation is event-driven: domain events trigger invalidation of affected cache entries

### 8.6 Background Jobs

**Purpose:** Offload non-real-time work from the request path.

**Job categories:**

| Category | Examples | Schedule | Priority |
|---|---|---|---|
| **Real-time** | Fraud scoring, notification dispatch, cache invalidation | Event-driven, < 1 second | Critical |
| **Near-real-time** | Analytics aggregation, spending categorization | Every 1-5 minutes | High |
| **Batch** | Statement generation, interest accrual, report generation | Scheduled (daily, weekly) | Medium |
| **Maintenance** | Data archival, log rotation, cache cleanup | Off-peak hours | Low |
| **Compliance** | Sanctions screening refresh, adverse media checks | Daily | High |

**Job execution guarantees:**
- At-least-once delivery (jobs are retried on failure)
- Idempotent execution (jobs can safely run multiple times)
- Dead letter queue for permanently failed jobs
- Job monitoring: execution time, success rate, queue depth
- Rate limiting on external API calls from background jobs

**Job orchestration:**
- Simple scheduled jobs: cron-like scheduler within the monolith
- Complex workflows: Saga orchestration via event bus
- Future: dedicated job processing infrastructure (when extracted to services)

---

## 9. Reliability Strategy

### 9.1 Failure Handling Philosophy

**Principle:** Every failure has a defined recovery path. The system never enters an undefined state.

**Failure categories:**

| Category | Examples | Response |
|---|---|---|
| **Transient** | Network timeout, temporary DB overload | Retry with backoff |
| **Persistent** | External service down, configuration error | Circuit breaker, fallback |
| **Catastrophic** | Database corruption, data center failure | Failover, disaster recovery |
| **Business** | Insufficient balance, account frozen | Clear error to user, no system impact |

### 9.2 Retry Mechanisms

**Exponential backoff with jitter:**

For transient failures, retries use exponential backoff with randomized jitter to prevent thundering herd:

- Attempt 1: Immediate
- Attempt 2: 100ms + random(0-50ms)
- Attempt 3: 200ms + random(0-100ms)
- Attempt 4: 400ms + random(0-200ms)
- Attempt 5: 800ms + random(0-400ms)
- After 5 attempts: Circuit breaker opens

**Retry boundaries:**
- Retries apply ONLY to idempotent operations (GET, idempotent POST with idempotency key)
- Non-idempotent operations (e.g., money transfers) are NOT retried automatically — they require user confirmation or manual review
- Retry budgets: Maximum 3 concurrent retries per user to prevent amplification

### 9.3 Circuit Breakers

**Purpose:** Prevent cascading failures by failing fast when a dependency is known to be unavailable.

**States:**

```
CLOSED (normal) ──── failure threshold ────► OPEN (failing)
     ▲                                            │
     │                                     timeout period
     │                                            │
     │                                            ▼
     ◄────────── success threshold ──── HALF-OPEN (testing)
```

**Configuration per external dependency:**

| Dependency | Failure Threshold | Open Duration | Half-Open Probes |
|---|---|---|---|
| Partner Bank Gateway | 3 failures in 30s | 60 seconds | 3 requests |
| Payment Processor | 3 failures in 30s | 60 seconds | 3 requests |
| KYC Provider | 5 failures in 60s | 120 seconds | 5 requests |
| SMS Provider | 3 failures in 30s | 30 seconds | 3 requests |
| Redis Cache | 3 failures in 10s | 15 seconds | 5 requests |

**Circuit breaker behavior:**
- When OPEN: requests fail immediately with a defined fallback response
- When HALF-OPEN: limited requests are allowed through to test recovery
- When CLOSED: normal operation resumes

### 9.4 Graceful Degradation

**Priority 1 — Core banking must NEVER degrade:**
- Account balance inquiries
- Card authorization
- Internal transfers
- Authentication

**Priority 2 — Degrade gracefully when dependencies fail:**

| Failed Dependency | Degradation Strategy |
|---|---|
| Analytics/Reporting | Show cached data; "Analytics temporarily unavailable" message |
| SMS Provider | Fallback to email for OTP; push notification for alerts |
| Email Provider | Queue messages for retry; do not block user operations |
| Redis Cache | Direct database queries (slower but functional) |
| Partner Bank (ACH) | Queue ACH transfers for processing when gateway recovers |
| Fraud Detection (ML) | Fall back to rule-based scoring only |
| Search Engine | Disable search temporarily; core functions unaffected |
| Notification (non-critical) | Queue for later delivery; critical alerts use multiple channels |

**Degradation signals:** When degradation is active, operators are alerted and users see non-intrusive status indicators.

### 9.5 Health Checks

**Types:**

| Check | Purpose | Frequency | Timeout |
|---|---|---|---|
| Liveness | Is the application running? | Every 10 seconds | 5 seconds |
| Readiness | Can the application serve traffic? | Every 15 seconds | 10 seconds |
| Deep health | Are all dependencies available? | Every 60 seconds | 30 seconds |

**Readiness check verifies:**
- Database connectivity
- Redis connectivity
- Event bus connectivity
- At least one external payment gateway available

**Health check endpoints:**
- `/health/live` — Returns 200 if application is running (for load balancer liveness)
- `/health/ready` — Returns 200 if application can serve traffic (for load balancer routing)
- `/health/deep` — Returns detailed dependency status (for operations monitoring)

### 9.6 Recovery Planning

**Database recovery:**
- Continuous streaming replication to read replicas
- Point-in-time recovery (WAL archiving)
- Recovery Point Objective (RPO): < 1 minute
- Recovery Time Objective (RTO): < 30 minutes

**Application recovery:**
- Stateless applications recover by restarting (Kubernetes pod restart)
- No in-process state that cannot be reconstructed from database + cache
- Blue-green deployment enables instant rollback

**Disaster recovery:**
- Multi-AZ deployment (minimum) for hardware/availability zone failures
- Multi-region deployment (Phase 4) for region-level failures
- Automated failover for database primary
- Regular disaster recovery drills (quarterly)

**Incident response:**
- Automated alerting on all P1/P2 conditions
- Runbook for every alert type
- On-call rotation with 15-minute response SLA
- Post-incident review for every P1 incident (blameless)

---

## 10. Technology Decision Record

### ADR-001: Backend Language — Java 21+

**Decision:** Java 21 (LTS) as the primary backend language.

**Alternatives considered:**
- Kotlin — Modern syntax, null safety, coroutines. Strong contender. Decision: Java chosen for broader talent pool, mature ecosystem, and long-term support. Kotlin considered as future migration target for specific modules.
- Go — Excellent concurrency, fast startup, small binaries. Decision: Go lacks the mature financial services ecosystem and enterprise framework support that Java provides.
- Rust — Memory safety, performance. Decision: Learning curve too steep for startup velocity; talent pool too small.
- Node.js/TypeScript — Fast development, shared language with frontend. Decision: Not suitable for complex financial domain modeling; single-threaded model problematic for CPU-intensive fraud detection.
- C#/.NET — Enterprise-grade, strong ecosystem. Decision: Cross-platform story weaker than Java; Azure lock-in concern.

**Trade-offs accepted:**
- Java's verbosity (mitigated by modern Java features and Lombok/code generation)
- JVM memory overhead (acceptable given the reliability and performance benefits)
- Startup time (mitigated by GraalVM native image for future serverless needs)

**Why Java won:** At Stripe, Revolut, and PayPal, Java/Kotlin dominate backend financial systems for good reason: mature concurrency primitives, battle-tested ecosystem, excellent profiling and debugging tools, vast library ecosystem for financial operations, and a deep talent pool of engineers experienced in building reliable financial systems.

### ADR-002: Framework — Spring Boot 3.x

**Decision:** Spring Boot 3.x as the application framework.

**Alternatives considered:**
- Quarkus — Faster startup, lower memory, Kubernetes-native. Decision: Smaller ecosystem, fewer financial services examples, less mature security integrations.
- Micronaut — compile-time DI, fast startup. Decision: Smaller community, fewer production references in financial services.
- Vert.x — Reactive, high performance. Decision: Reactive programming model adds complexity; imperative model simpler for financial transaction clarity.
- Plain Java (no framework) — Full control. Decision: Reimplementing dependency injection, transaction management, security, and configuration is wasted effort.

**Trade-offs accepted:**
- Spring's runtime overhead (acceptable for server-based deployment)
- Framework magic (mitigated by explicit configuration over convention)
- Update cadence (Spring's major versions require periodic migration effort)

**Why Spring Boot won:** Dominant in enterprise financial services. Spring Security provides robust authentication/authorization. Spring Transaction Management handles ACID transactions cleanly. Massive ecosystem of production-tested integrations. Extensive documentation and community support.

### ADR-003: Frontend — React (Web), Native (Mobile)

**Decision:** React for web application, native Swift/Kotlin for mobile applications.

**Alternatives considered (Web):**
- Angular — Full framework, strong typing. Decision: Heavier bundle, steeper learning curve, Google's inconsistent framework strategy.
- Vue.js — Simpler, faster development. Decision: Smaller enterprise ecosystem, fewer banking references.
- Svelte — Compile-time, tiny bundles. Decision: Ecosystem too small for enterprise banking; limited component libraries.

**Alternatives considered (Mobile):**
- React Native — Cross-platform. Decision: Performance limitations for complex financial UIs; native feel critical for banking trust; bridge overhead for biometric/security features.
- Flutter — Cross-platform, good performance. Decision: Dart language limits talent pool; rendering engine overhead; limited platform-specific security API access.
- Xamarin/MAUI — .NET cross-platform. Decision: Smaller community than React Native; Microsoft's mobile strategy uncertainty.

**Trade-offs accepted:**
- Two separate codebases for mobile (iOS + Android) instead of one cross-platform
- Higher development cost for mobile (mitigated by shared design system and component library)
- React's ecosystem churn (mitigated by pinning dependencies and periodic migration)

**Why React + Native won:** React dominates frontend with the largest ecosystem. Native mobile provides best performance, security API access, and user trust. Banking users expect polished, performant experiences — cross-platform shortcuts are visible and erode trust.

### ADR-004: Primary Database — PostgreSQL 16

**Decision:** PostgreSQL 16 as the primary relational database.

**Alternatives considered:**
- MySQL 8 — Simpler, faster for reads. Decision: Weaker JSON support, less mature partitioning, no native full-text search comparable to PostgreSQL.
- Oracle — Enterprise-grade, strong support. Decision: Licensing cost prohibitive; vendor lock-in; complexity.
- SQL Server — Strong enterprise features. Decision: Microsoft ecosystem lock-in; licensing cost; weaker open-source community.
- MongoDB — Document model flexibility. Decision: Not suitable as primary store for financial data requiring ACID transactions and referential integrity.
- CockroachDB — Distributed SQL, horizontally scalable. Decision: premature for current scale; operational complexity; cost. Considered for future multi-region.

**Trade-offs accepted:**
- Vertical scaling limit (addressed by read replicas and future migration path)
- Replication lag during high write load (mitigated by careful replica routing)
- Connection pool management (addressed by PgBouncer)

**Why PostgreSQL won:** ACID compliance is non-negotiable for banking. JSONB provides schema flexibility for evolving data models without migrations. Native full-text search reduces dependency on external search for basic queries. Rich index types support diverse query patterns. Strong replication and point-in-time recovery. Zero licensing cost. Battle-tested at scale (Instagram, Spotify, Apple).

### ADR-005: Cache — Redis 7

**Decision:** Redis 7 as the primary caching and session store.

**Alternatives considered:**
- Memcached — Simpler, lighter. Decision: No persistence, no data structures, no pub/sub; insufficient for session management and rate limiting.
- Hazelcast — In-process distributed cache. Decision: Heavier; better suited for Java-specific clustering than general-purpose caching.
- Amazon ElastiCache — Managed Redis. Decision: Vendor lock-in; considered for production deployment on AWS.
- KeyDB — Redis fork with multithreading. Decision: Smaller community; Redis ecosystem compatibility preferred.

**Trade-offs accepted:**
- Single-threaded nature (mitigated by Redis Cluster for horizontal scaling)
- Memory cost (all cached data in RAM; carefully managed TTLs)
- Persistence guarantees (acceptable for cache use case; not used as primary data store)

**Why Redis won:** Industry standard for session management, caching, and rate limiting. Rich data structures support diverse use cases (sets for rate limiting, sorted sets for leaderboards, hashes for session data). Pub/Sub for real-time event distribution. Redis Cluster for horizontal scaling. Sub-millisecond latency. Massive ecosystem and operational tooling.

### ADR-006: Event Streaming — Apache Kafka

**Decision:** Apache Kafka as the event streaming platform.

**Alternatives considered:**
- RabbitMQ — Traditional message broker. Decision: Lower throughput; no event replay capability; weaker ecosystem for event sourcing patterns.
- Amazon SQS/SQS — Managed queue. Decision: No pub/sub capability; vendor lock-in; no event replay.
- Apache Pulsar — Next-gen streaming. Decision: Smaller ecosystem; fewer production references; operational maturity concerns.
- NATS — Lightweight, fast. Decision: Weaker persistence guarantees; smaller ecosystem for financial services.
- Redis Streams — Built on existing Redis. Decision: Good for low-volume events; not suitable for high-throughput event streaming with replay.

**Trade-offs accepted:**
- Operational complexity (mitigated by managed Kafka in early phases)
- Eventual consistency (by design; acceptable for our event-driven patterns)
- Storage cost (event retention requires significant storage; tiered storage strategy)

**Why Kafka won:** Industry standard for event streaming at scale. Exactly-once semantics for critical financial events. Event replay capability essential for regulatory audit and debugging. Kafka Streams for real-time processing. Connect ecosystem for integration with databases and external systems. Strong ecosystem for future event sourcing patterns.

**Note:** Kafka is NOT used in the initial modular monolith. In-process event bus is used first. Kafka is introduced in Stage 2 (see Section 2.4) when module extraction begins. This decision documents the target architecture, not the immediate implementation.

### ADR-007: Containerization — Docker + Kubernetes

**Decision:** Docker for containerization, Kubernetes for orchestration.

**Alternatives considered:**
- Docker Compose — Simpler orchestration. Decision: No auto-healing, no scaling, no service discovery; suitable only for development.
- AWS ECS — Managed container orchestration. Decision: Vendor lock-in; Kubernetes ecosystem is larger and more portable.
- HashiCorp Nomad — Lightweight orchestration. Decision: Smaller ecosystem; fewer production references; limited managed service offerings.
- Bare metal / VMs — Traditional deployment. Decision: No auto-scaling, no self-healing, slower deployment cycles.

**Trade-offs accepted:**
- Kubernetes operational complexity (mitigated by managed Kubernetes: EKS, GKE, AKS)
- Resource overhead (Kubernetes overhead ~10-15% of cluster resources)
- YAML configuration complexity (mitigated by Helm charts and GitOps)

**Why Kubernetes won:** Industry standard for container orchestration. Self-healing (automatic pod restart). Horizontal scaling (HPA). Service discovery and load balancing. Rolling deployments with zero downtime. Extensive ecosystem (Helm, ArgoCD, Prometheus, Grafana). Cloud-agnostic — deployable on any cloud provider.

### ADR-008: Search — Elasticsearch 8

**Decision:** Elasticsearch 8 for full-text search and operational log analysis.

**Alternatives considered:**
- PostgreSQL Full-Text Search — Built-in, no additional infrastructure. Decision: Adequate for basic search; insufficient for complex analytics queries and log analysis.
- Algolia — Managed search. Decision: Vendor lock-in; cost at scale; limited control over data.
- Meilisearch — Lightweight alternative. Decision: Lacks analytics capabilities; smaller ecosystem.
- Apache Solr — Mature search platform. Decision: Declining community; Elasticsearch ecosystem is larger.

**Trade-offs accepted:**
- Operational complexity (additional cluster to manage)
- Data synchronization (eventual consistency between PostgreSQL and Elasticsearch)
- Memory requirements (Elasticsearch is memory-hungry)

**Why Elasticsearch won:** Full-text search with relevance scoring. Aggregation framework for analytics. Kibana for operational dashboards. Log analysis capability (ELK stack). APM integration for distributed tracing. Mature and battle-tested.

### ADR-009: Object Storage — S3-Compatible (MinIO/AWS S3)

**Decision:** S3-compatible object storage for documents, reports, and static assets.

**Alternatives considered:**
- Database blob storage — Store files in PostgreSQL. Decision: Database bloat, poor performance for large files, expensive storage.
- Google Cloud Storage — Managed alternative. Decision: Vendor lock-in; S3 compatibility preferred for portability.
- Azure Blob Storage — Managed alternative. Decision: Vendor lock-in; S3 compatibility preferred.

**Why S3-compatible won:** Virtually unlimited storage. Built-in versioning. Lifecycle policies for cost management. Server-side encryption. CDN integration. Industry standard — any tool or library works with S3-compatible storage.

### ADR-010: Infrastructure as Code — Terraform

**Decision:** Terraform for infrastructure provisioning and management.

**Alternatives considered:**
- AWS CloudFormation — AWS-native. Decision: Vendor lock-in; less readable; slower iteration.
- Pulumi — Code-based IaC. Decision: Smaller community; less mature than Terraform.
- Ansible — Configuration management. Decision: Not purpose-built for infrastructure provisioning; push-based model less safe than Terraform's plan/apply.
- Manual provisioning — No. Inconsistent, error-prone, unrepeatable.

**Trade-offs accepted:**
- HCL learning curve (mitigated by team training)
- State management complexity (mitigated by remote state with locking)
- Terraform version upgrades (mitigated by version pinning and testing)

**Why Terraform won:** Cloud-agnostic (deploy to AWS, GCP, Azure). Declarative model. Plan/apply workflow prevents surprises. Massive provider ecosystem. State management provides infrastructure visibility. Industry standard.

### ADR-011: CI/CD — GitHub Actions

**Decision:** GitHub Actions for CI/CD pipelines.

**Alternatives considered:**
- Jenkins — Self-hosted, fully customizable. Decision: Maintenance burden, outdated UI, plugin management overhead.
- GitLab CI/CD — Integrated with GitLab. Decision: We use GitHub; GitLab migration not justified.
- CircleCI — Cloud-hosted, fast. Decision: Vendor lock-in; cost at scale.
- ArgoCD — GitOps for Kubernetes. Decision: Complementary to GitHub Actions, not a replacement; considered for deployment stage.

**Why GitHub Actions won:** Integrated with our code hosting platform. Free for open-source; reasonable pricing for private repos. Matrix builds for multi-platform testing. Marketplace for reusable workflows. Native container registry support.

---

## 11. Future Evolution

### 11.1 Event-Driven Architecture Evolution

**Current state:** In-process event bus within the monolith.

**Target state:** Kafka-based event streaming as the primary inter-module communication mechanism.

**Evolution steps:**

1. **Define event contracts** (current phase) — All inter-module events are defined with versioned schemas. This is the most critical step and must be done NOW, regardless of the transport mechanism.

2. **Introduce Kafka alongside in-process bus** (Stage 2) — Events are published to BOTH the in-process bus and Kafka. Consumers continue using in-process bus. This validates Kafka infrastructure without behavioral changes.

3. **Migrate consumers to Kafka** (Stage 2, after validation) — Consumers switch from in-process bus to Kafka. In-process bus becomes fallback only.

4. **Remove in-process bus** (Stage 3) — All inter-module communication via Kafka. The monolith now communicates internally the same way extracted services will communicate externally.

**Event schema governance:**
- Event schemas are defined in a shared schema registry
- Schema changes follow compatibility rules (backward-compatible additions only)
- Breaking changes require new event version
- Deprecated event versions supported for 90-day transition period

### 11.2 Microservices Evolution

**Evolution principles:**
- Extract services ONE AT A TIME, not in a big-bang rewrite
- Each extraction is validated in production before proceeding to the next
- The monolith continues to work throughout the extraction process
- No extraction unless there is a clear business or operational driver

**Extraction decision criteria:**

| Factor | Weight | Threshold for Extraction |
|---|---|---|
| Independent scaling need | High | Module handles > 30% of total system load |
| Team independence | High | Module owned by a team of 5+ engineers |
| Failure isolation need | Medium | Module failure should not affect core banking |
| Technology divergence | Low-Medium | Module needs a different runtime or language |
| Deployment independence | Medium | Module needs deployment frequency > 10x/day |

**Extraction process (per module):**

```
Phase 1: Preparation
├── Define module's public API (derived from existing interface)
├── Set up dedicated data store
├── Implement event-based communication (already in place from Kafka migration)
└── Set up dedicated CI/CD pipeline

Phase 2: Shadow Mode
├── Deploy extracted service alongside monolith
├── Route real traffic to both monolith and service
├── Compare responses for correctness (shadow traffic)
└── Monitor latency, error rates, resource usage

Phase 3: Traffic Migration
├── Gradually shift traffic from monolith to service (10% → 50% → 100%)
├── Monitor for regressions at each step
├── Implement rollback capability at each step
└── Validate data consistency

Phase 4: Monolith Cleanup
├── Remove extracted module's code from monolith
├── Remove extracted module's data from monolith database
├── Update event routing (monolith now publishes to service via Kafka)
└── Update monitoring and alerting
```

### 11.3 Multi-Region Deployment

**Target state:** Active-active multi-region deployment for global availability and disaster recovery.

**Evolution steps:**

1. **Single region, multi-AZ** (current) — All availability zones in a single region. Protects against AZ failures.

2. **Single region primary, second region standby** (Stage 3) — Warm standby in second region with database replication. Automated failover for disaster recovery.

3. **Active-active multi-region** (Stage 5) — Both regions serve traffic. Data consistency handled via conflict resolution or regional data ownership.

**Multi-region challenges:**
- Data consistency across regions (especially for financial operations)
- Latency for cross-region operations
- Regulatory requirements (data residency, sovereign data)
- Cost of running multiple full environments

**Regional data ownership model:**
- Users are assigned a home region at registration
- All financial operations for a user execute in their home region
- Read operations can be served from any region (with eventual consistency)
- Cross-region writes are not supported (users must be in the same region for transfers)

### 11.4 Cloud-Native Platform Evolution

**Current target:** Kubernetes on a single cloud provider with Terraform-managed infrastructure.

**Future evolution:**

1. **Managed Kubernetes** — Offload control plane management to cloud provider (EKS/GKE/AKS)
2. **Service mesh** — Introduce Istio or Linkerd for inter-service communication, observability, and security policies
3. **GitOps** — ArgoCD for declarative deployments from Git
4. **Chaos engineering** — Litmus or Gremlin for systematic failure injection and resilience testing
5. **Cost optimization** — Spot instances for non-critical workloads, reserved instances for core services
6. **Observability platform** — Centralized metrics (Prometheus), logs (Loki), traces (Tempo), dashboards (Grafana)
7. **Policy as code** — OPA/Gatekeeper for security and compliance policy enforcement

### 11.5 High Availability Architecture

**Target: 99.99% availability (52 minutes downtime per year)**

**Evolution:**

| Stage | Availability Target | Strategy |
|---|---|---|
| Stage 1 (MVP) | 99.9% | Single region, multi-AZ, automated failover |
| Stage 2 (Growth) | 99.95% | Add read replicas, improve health checks, reduce blast radius |
| Stage 3 (Scale) | 99.99% | Active-passive multi-region, automated DR failover |
| Stage 4 (Enterprise) | 99.99%+ | Active-active multi-region, chaos engineering, zero-downtime deployments |

**High availability patterns:**
- No single point of failure at any tier
- Database: streaming replication with automated failover
- Application: horizontal scaling with health-check-based routing
- Cache: Redis Cluster with automatic failover
- External dependencies: circuit breakers with graceful degradation
- Deployment: blue-green with instant rollback capability

### 11.6 Evolution Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FINFLOW ARCHITECTURE EVOLUTION                      │
│                                                                        │
│  NOW                    12 MO                  24 MO                  36 MO                 │
│   │                      │                      │                      │                     │
│   ▼                      ▼                      ▼                      ▼                     │
│                                                                        │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │ Modular   │    │ Modular +    │    │ Selective    │    │ Cloud-Native │    │
│  │ Monolith  │───►│ Kafka Events │───►│ Microservices│───►│ Platform     │    │
│  │           │    │              │    │              │    │              │    │
│  │ Single DB │    │ Single DB +  │    │ Service DBs  │    │ Multi-Region │    │
│  │ In-Process│    │ Kafka        │    │ per Service  │    │ Active-Active│    │
│  │ Events    │    │              │    │              │    │              │    │
│  └──────────┘    └──────────────┘    └──────────────┘    └──────────────┘    │
│                                                                        │
│  Key Enablers:                                                         │
│  ✓ Module boundaries    ✓ Event schemas    ✓ Contract tests           │
│  ✓ Dependency rules     ✓ Kafka topics     ✓ Service mesh              │
│  ✓ Layer separation     ✓ Shadow traffic   ✓ Chaos engineering        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Architecture Decision Principles

Every ADR follows this structure:
1. **Title** — Short, descriptive
2. **Status** — Proposed, Accepted, Deprecated, Superseded
3. **Context** — What is the situation requiring a decision?
4. **Decision** — What was decided?
5. **Alternatives Considered** — What else was evaluated?
6. **Trade-offs** — What did we accept by making this choice?
7. **Consequences** — What are the implications (positive and negative)?

## Appendix B: Architecture Fitness Functions

Automated checks that enforce architectural rules:

| Fitness Function | What It Checks | Enforcement |
|---|---|---|
| Dependency rule | No module depends on another module's internal packages | Build-time static analysis |
| Layer rule | Domain layer has no infrastructure imports | Build-time static analysis |
| API contract | Module public interfaces match documented contracts | Contract tests |
| Event schema | Published events match registered schemas | Schema validation tests |
| Performance budget | Core operations complete within defined latency thresholds | Load tests in CI |
| Security baseline | No secrets in code, no sensitive data in logs | Automated security scanning |
| Coverage threshold | Critical paths have > 90% test coverage | Coverage reports |

## Appendix C: Glossary

| Term | Definition |
|---|---|
| **BaaS** | Banking-as-a-Service — partner bank providing banking charter and regulatory coverage |
| **Bounded Context** | A logical boundary within which a particular domain model applies |
| **Circuit Breaker** | A pattern that prevents cascading failures by failing fast when a dependency is unavailable |
| **Saga** | A pattern for maintaining consistency across multiple services/steps with compensating actions |
| **Idempotency** | The property where performing an operation multiple times has the same effect as performing it once |
| **Eventual Consistency** | A consistency model where all nodes will eventually have the same data, but not immediately |
| **BLAST RADIUS** | The scope of impact when a component fails |
| **RPO/RTO** | Recovery Point Objective (how much data loss is acceptable) / Recovery Time Objective (how quickly must we recover) |

---

*This document is a living artifact. Architecture decisions should be reviewed quarterly and updated as the system evolves. All changes must be approved through the Architecture Review Board process.*
