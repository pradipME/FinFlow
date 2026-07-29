# FinFlow — Frontend Engineering Architecture Document

**Document Classification:** Confidential — CTO & Frontend Architecture Review
**Version:** 1.0.0
**Status:** Draft for Review
**Last Updated:** July 2026
**Framework:** React 19+ (TypeScript)

---

## Table of Contents

1. [Frontend Philosophy](#1-frontend-philosophy)
2. [Folder Structure](#2-folder-structure)
3. [Feature-Based Architecture](#3-feature-based-architecture)
4. [Module Organization](#4-module-organization)
5. [Component Architecture](#5-component-architecture)
6. [State Management Strategy](#6-state-management-strategy)
7. [Routing Architecture](#7-routing-architecture)
8. [API Layer](#8-api-layer)
9. [Form Architecture](#9-form-architecture)
10. [Authentication Architecture](#10-authentication-architecture)
11. [Performance Strategy](#11-performance-strategy)
12. [Error Handling](#12-error-handling)
13. [Frontend Security](#13-frontend-security)
14. [Internationalization Strategy](#14-internationalization-strategy)
15. [Accessibility Strategy](#15-accessibility-strategy)
16. [Theming Architecture](#16-theming-architecture)
17. [Environment Management](#17-environment-management)
18. [Testing Strategy](#18-testing-strategy)
19. [Build Strategy](#19-build-strategy)
20. [Future Scalability](#20-future-scalability)

---

## 1. Frontend Philosophy

### 1.1 Guiding Principles

Every frontend engineering decision in FinFlow traces back to ten non-negotiable principles. These are enforced through architectural review, linting rules, code review, and automated checks.

#### Principle 1: Server State is the Source of Truth

**Statement:** The server is the single source of truth for all financial data. The frontend is a projection of that data, optimized for display and interaction. The frontend never invents, estimates, or caches financial numbers beyond their server-provided TTL.

**Rationale:** In a banking application, displaying a stale balance is worse than displaying no balance. Financial data accuracy is non-negotiable. The frontend's caching strategy must be aggressive for non-financial data (user preferences, UI state) but conservative for financial data (balances, transactions, limits). Server state management libraries (React Query / TanStack Query) handle this distinction natively through stale-while-revalidate patterns with configurable TTLs per query.

**Enforcement:** All financial data flows through the server state cache. No component directly stores financial numbers in local state. Cache invalidation policies are defined per query key, not globally.

#### Principle 2: Offline-First Read, Online-Only Write

**Statement:** Read operations degrade gracefully to cached data when offline. Write operations (transfers, payments, card operations) require network connectivity and never queue for later execution.

**Rationale:** Users should be able to check balances, view transaction history, and review account details even with intermittent connectivity. However, any operation that moves money, changes account state, or modifies security settings must have a confirmed server response. Queuing financial writes for later execution introduces unacceptable risk — the user's intent at queue time may differ from execution time (balance may have changed, fraud status may have changed).

**Enforcement:** Service worker caches GET responses with defined TTLs. All mutation hooks require network connectivity. Offline indicators are shown proactively when connectivity is lost.

#### Principle 3: Type Safety as a Safety Net

**Statement:** TypeScript is used exhaustively. No `any` types. No type assertions without documented justification. The type system is the first line of defense against runtime errors in a system where runtime errors have financial consequences.

**Rationale:** TypeScript catches entire categories of bugs at compile time: incorrect API response handling, missing required fields, invalid state transitions, mismatched prop types. In a banking application, a `null` reference on a balance display is not just a bug — it is a trust-destroying event. The type system is not optional documentation; it is a safety mechanism.

**Enforcement:** `@typescript-eslint/no-explicit-any` as error. Strict mode enabled. API response types auto-generated from OpenAPI spec. No component renders without full type coverage on its props and data.

#### Principle 4: Predictable State Transitions

**Statement:** Every piece of UI state has a single source of truth and a defined transition path. No state is derived from multiple conflicting sources. No state is mutated directly.

**Rationale:** Banking UIs have complex state: form inputs, server data, loading states, error states, optimistic updates, pending operations. When state sources conflict (e.g., local optimistic balance vs. server balance during a transfer), the UI must resolve conflicts predictably. The architecture defines exactly where each type of state lives and how conflicts are resolved.

**Enforcement:** State management boundaries are enforced at the architecture level. UI state lives in React state. Server state lives in the query cache. Form state lives in form libraries. No cross-boundary mutations.

#### Principle 5: Progressive Disclosure of Complexity

**Statement:** The default experience is simple. Complexity is revealed only when the user requests it or when the context demands it. Every screen has a clear primary action and secondary actions are visually de-emphasized.

**Rationale:** FinFlow serves users ranging from James Wright (67, low technical skills) to Sarah Chen (28, UX designer). The interface must be immediately usable for the least technical user while providing depth for power users. This is achieved through progressive disclosure: sensible defaults, expandable sections, advanced settings behind explicit actions, and contextual help.

**Enforcement:** Design review checklist includes "Is the primary action obvious?" and "Is secondary complexity hidden by default?" for every new screen.

#### Principle 6: Resilient Error Recovery

**Statement:** Every error state has a recovery path. No error is terminal for the user's session. Network failures, server errors, and validation errors all have defined UI behaviors and user-guided recovery.

**Rationale:** In a banking app, error states are high-anxiety moments. A failed transfer, a declined card, or a network timeout during a payment are stressful. The error handling architecture ensures that every error: (a) explains what happened in plain language, (b) tells the user what they can do about it, (c) preserves any input they have provided, and (d) provides a path back to the previous state.

**Enforcement:** Every mutation endpoint has a corresponding error handler with user-facing message, recovery action, and state preservation. Error boundaries catch rendering failures without crashing the entire application.

#### Principle 7: Performance is a Feature

**Statement:** Performance is not an optimization — it is a core product feature. Every millisecond of load time, every frame of animation, every interaction response time is an architectural concern, not an afterthought.

**Rationale:** The Product Vision specifies: dashboard load under 1 second, API response p95 under 200ms, app launch to interactive under 1.5 seconds. These are not aspirational — they are architectural constraints. The frontend architecture enforces performance budgets at the bundle level, route level, and component level.

**Enforcement:** Bundle size budgets per route. Lighthouse CI in the build pipeline. Performance budgets enforced as build gates. Core Web Vitals tracked in production.

#### Principle 8: Accessibility is Mandatory, Not Optional

**Statement:** WCAG 2.1 Level AA compliance is a non-negotiable requirement for every component, every route, and every interaction. Accessibility is not a layer added after the fact — it is a property of every component from its first implementation.

**Rationale:** FinFlow serves James Wright (low technical skills, may need screen reader) and must comply with ADA and WCAG requirements. Accessibility is also good engineering: semantic HTML, keyboard navigation, and proper ARIA attributes improve the experience for all users, not just those with disabilities.

**Enforcement:** Automated accessibility testing in CI (axe-core). Manual accessibility review for every new feature. Accessibility checklist in code review.

#### Principle 9: Security at the Boundary

**Statement:** The frontend enforces security at its boundary: input sanitization, token management, secure storage, and XSS prevention. The frontend never trusts user input and never exposes internal system details.

**Rationale:** The frontend is the user-facing surface of a financial system. It is the first target for XSS attacks, token theft, and input manipulation. The security architecture ensures that: tokens are stored securely, user input is sanitized before display, internal API details are never exposed, and error messages never leak system internals.

**Enforcement:** Security linting rules. CSP headers. Input sanitization utilities. Token storage audit. No sensitive data in localStorage.

#### Principle 10: Ship with Confidence

**Statement:** Every change ships with confidence through feature flags, incremental rollouts, automated testing, and monitoring. No change goes to 100% of users without validation.

**Rationale:** In a banking application, a bug in production can affect real money. The deployment architecture ensures that changes are validated through automated testing, gradually rolled out through feature flags, monitored through real-time metrics, and reversible within minutes through instant rollback.

**Enforcement:** Feature flags for every new feature. Canary deployments (5% → 25% → 50% → 100%). Real-time error rate monitoring. Instant rollback capability.

---

## 2. Folder Structure

### 2.1 Root Structure

```
finflow-web/
│
├── .github/                        # GitHub configuration
│   ├── workflows/                  # CI/CD pipelines
│   ├── PULL_REQUEST_TEMPLATE.md    # PR template
│   └── CODEOWNERS                  # Code ownership rules
│
├── .husky/                         # Git hooks
│   ├── pre-commit                  # Lint + type-check
│   └── commit-msg                  # Commit message validation
│
├── public/                         # Static assets (copied as-is)
│   ├── favicon.ico
│   ├── manifest.json               # PWA manifest
│   ├── robots.txt
│   └── locales/                    # i18n translation files
│       ├── en/
│       │   ├── common.json
│       │   ├── auth.json
│       │   ├── accounts.json
│       │   └── ...
│       └── es/
│
├── src/
│   ├── app/                        # Application shell
│   ├── features/                   # Feature modules
│   ├── shared/                     # Shared infrastructure
│   ├── assets/                     # Static assets (imported)
│   ├── types/                      # Global type definitions
│   └── main.tsx                    # Application entry point
│
├── tools/                          # Development tooling
│   ├── generate-api-types.ts       # OpenAPI → TypeScript generator
│   ├── generate-i18n-keys.ts       # Translation key extractor
│   └── bundle-analyzer.ts          # Bundle analysis script
│
├── .env.example                    # Environment variable template
├── .eslintrc.js                    # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Build tool configuration
├── tailwind.config.ts              # Design system configuration
├── index.html                      # HTML entry point
├── package.json
└── README.md
```

### 2.2 Application Shell (`src/app/`)

```
src/app/
├── App.tsx                         # Root component (providers, router)
├── routes.tsx                      # Route definitions (centralized)
│
├── providers/                      # Context providers
│   ├── QueryProvider.tsx            # TanStack Query provider
│   ├── AuthProvider.tsx             # Authentication context
│   ├── ThemeProvider.tsx            # Theming context
│   ├── I18nProvider.tsx             # Internationalization context
│   ├── ErrorProvider.tsx            # Global error handling
│   └── FeatureFlagProvider.tsx      # Feature flag context
│
├── layouts/                        # Layout components
│   ├── AuthLayout.tsx               # Unauthenticated layout (login, register)
│   ├── DashboardLayout.tsx          # Authenticated layout (sidebar + content)
│   ├── AdminLayout.tsx              # Admin panel layout
│   └── MinimalLayout.tsx            # Full-screen content (error pages, etc.)
│
├── hooks/                          # App-level hooks
│   ├── useAppNavigation.ts          # Typed navigation helper
│   ├── useBreakpoint.ts             # Responsive breakpoint detection
│   └── useOnlineStatus.ts           # Network connectivity detection
│
└── constants/                      # App-level constants
    ├── routes.ts                    # Route path constants
    └── config.ts                    # App configuration
```

### 2.3 Feature Modules (`src/features/`)

```
src/features/
├── auth/                           # Authentication & Identity
├── dashboard/                      # Dashboard & Overview
├── accounts/                       # Account Management
├── transactions/                   # Transaction History
├── cards/                          # Card Management
├── transfers/                      # Money Transfers
├── savings/                        # Savings Goals & Rules
├── notifications/                  # Notification Center
├── analytics/                      # Spending Analytics
├── admin/                          # Admin Panel
├── settings/                       # User Settings
├── reports/                        # Report Generation
└── beneficiaries/                  # Beneficiary Management
```

### 2.4 Shared Infrastructure (`src/shared/`)

```
src/shared/
├── api/                            # API client infrastructure
├── components/                     # Reusable UI components
├── hooks/                          # Reusable custom hooks
├── lib/                            # Utility functions
├── types/                          # Shared type definitions
├── constants/                      # Shared constants
├── validators/                     # Validation schemas
└── config/                         # Shared configuration
```

---

## 3. Feature-Based Architecture

### 3.1 Why Feature-Based

The project is organized by **features** (business domains), not by **file types** (components, hooks, utils). This is a deliberate architectural choice with specific rationale.

#### File-Type Organization (Rejected)

```
src/
├── components/
│   ├── AccountCard.tsx
│   ├── BalanceDisplay.tsx
│   ├── TransactionRow.tsx
│   ├── TransferForm.tsx
│   ├── CardTile.tsx
│   └── ... (hundreds of files)
├── hooks/
│   ├── useAccount.ts
│   ├── useTransaction.ts
│   ├── useTransfer.ts
│   └── ...
├── utils/
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   └── ...
```

**Why this fails at scale:**
- A developer working on the Transfer feature touches 5+ directories
- Related code is scattered across the codebase
- No clear ownership boundary — any developer can modify any component
- Difficult to delete a feature (code is everywhere)
- Difficult to understand feature scope without grepping

#### Feature-Based Organization (Adopted)

```
src/features/
├── transfers/
│   ├── index.ts                     # Public API (barrel exports)
│   ├── components/                  # Feature-specific components
│   ├── hooks/                       # Feature-specific hooks
│   ├── api/                         # Feature-specific API functions
│   ├── types/                       # Feature-specific types
│   ├── utils/                       # Feature-specific utilities
│   ├── constants/                   # Feature-specific constants
│   └── __tests__/                   # Feature-specific tests
│
├── cards/
│   ├── index.ts
│   ├── components/
│   ├── hooks/
│   ├── api/
│   └── ...
```

**Why this works:**
- A developer working on Transfers works in one directory
- Feature scope is immediately visible from the directory structure
- Features can be owned by individual developers or teams
- Features can be extracted into separate packages later
- Deletion is clean — delete one directory

### 3.2 Feature Module Public API

Every feature module exposes a controlled public API through its `index.ts` barrel file. Internal implementation details are not exported.

**Rules:**
- `index.ts` exports only what other features need
- Internal components, hooks, and utilities are not exported
- Other features import from `@/features/transfers`, never from `@/features/transfers/components/`
- Feature-internal imports use relative paths
- Cross-feature imports always go through the public API

### 3.3 Feature Dependency Rules

```
┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE DEPENDENCY GRAPH                       │
│                                                                   │
│  ┌──────────┐                                                    │
│  │  shared   │ ◄── (everything depends on shared)                │
│  └─────┬────┘                                                    │
│        │                                                          │
│  ┌─────▼────────────────────────────────────────────────────┐    │
│  │  auth                                                     │    │
│  │  (no feature dependencies — foundational)                 │    │
│  └─────┬────────────────────────────────────────────────────┘    │
│        │                                                          │
│  ┌─────▼────────────────────────────────────────────────────┐    │
│  │  accounts                                                 │    │
│  │  (depends on: auth)                                       │    │
│  └─────┬────────────────────────────────────────────────────┘    │
│        │                                                          │
│  ┌─────▼──────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐    │
│  │ transactions│  │  cards   │  │ savings  │  │beneficiaries│   │
│  │ (accounts)  │  │(accounts)│  │(accounts)│  │ (accounts) │    │
│  └─────┬──────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘    │
│        │              │             │               │            │
│  ┌─────▼──────────────▼─────────────▼───────────────▼──────┐    │
│  │  transfers                                               │    │
│  │  (accounts, beneficiaries, cards)                        │    │
│  └─────┬───────────────────────────────────────────────────┘    │
│        │                                                          │
│  ┌─────▼────────────────────────────────────────────────────┐    │
│  │  dashboard, analytics, notifications, reports             │    │
│  │  (consume data from multiple features)                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  admin, settings                                         │    │
│  │  (independent, depend on shared + auth)                   │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Rule:** Features may only depend on `shared` and features listed in the dependency graph above. No circular dependencies. No feature may import from another feature's internal files.

---

## 4. Module Organization

### 4.1 Authentication Module (`features/auth/`)

```
features/auth/
├── index.ts
├── components/
│   ├── LoginForm.tsx                 # Login form
│   ├── RegisterForm.tsx              # Registration form
│   ├── MfaVerification.tsx           # MFA code entry
│   ├── ForgotPasswordForm.tsx        # Password reset request
│   ├── ResetPasswordForm.tsx         # Password reset completion
│   ├── EmailVerification.tsx         # Email verification
│   ├── OtpInput.tsx                  # OTP code input (reusable)
│   └── PasskeyButton.tsx            # WebAuthn passkey login
├── hooks/
│   ├── useLogin.ts                   # Login mutation
│   ├── useRegister.ts                # Registration mutation
│   ├── useLogout.ts                  # Logout + session cleanup
│   ├── useRefreshToken.ts            # Token refresh logic
│   ├── useMfa.ts                     # MFA verification
│   ├── usePasswordReset.ts           # Password reset flow
│   └── useSession.ts                 # Session state access
├── api/
│   ├── auth.api.ts                   # Auth API endpoints
│   └── auth.types.ts                 # Auth request/response types
├── types/
│   └── auth.types.ts                 # Auth domain types
├── constants/
│   └── auth.constants.ts             # Lockout durations, limits
└── validators/
    └── auth.validators.ts            # Login, register, reset schemas
```

**Responsibilities:** User registration, login, logout, MFA, session management, token refresh, password reset, email verification, passkey support.

**Key architectural decisions:**
- JWT stored in memory (not localStorage) — see Section 10
- Refresh token rotation handled transparently by API layer
- Session state managed through AuthProvider context
- All auth mutations go through TanStack Query for cache consistency

### 4.2 Dashboard Module (`features/dashboard/`)

```
features/dashboard/
├── index.ts
├── components/
│   ├── BalanceOverview.tsx           # Total balance across accounts
│   ├── RecentTransactions.tsx        # Last 5-10 transactions
│   ├── SpendingSummary.tsx           # Weekly/monthly spending breakdown
│   ├── QuickActions.tsx              # Transfer, pay, deposit shortcuts
│   ├── SavingsProgress.tsx           # Goal progress cards
│   ├── UpcomingBills.tsx             # Scheduled payments
│   └── InsightCard.tsx               # Financial insight display
├── hooks/
│   ├── useDashboardSummary.ts        # Dashboard data aggregation
│   ├── useSpendingOverview.ts        # Spending data for dashboard
│   └── useRecentActivity.ts          # Recent transaction feed
├── api/
│   ├── dashboard.api.ts              # Dashboard API endpoints
│   └── dashboard.types.ts            # Dashboard response types
└── types/
    └── dashboard.types.ts            # Dashboard domain types
```

**Responsibilities:** Financial overview, quick actions, spending summary, savings progress, insights display.

**Key architectural decisions:**
- Dashboard data is pre-aggregated server-side (see `API_ARCHITECTURE.md` Section 5.12)
- All dashboard queries use short stale time (30 seconds) for real-time feel
- Composite view assembled client-side from multiple API responses
- Offline fallback shows last cached dashboard data

### 4.3 Accounts Module (`features/accounts/`)

```
features/accounts/
├── index.ts
├── components/
│   ├── AccountCard.tsx               # Account summary card
│   ├── AccountList.tsx               # List of user accounts
│   ├── AccountDetail.tsx             # Full account view
│   ├── BalanceDisplay.tsx            # Balance with holds breakdown
│   ├── AccountStatusBadge.tsx        # Status indicator
│   ├── AccountSettings.tsx           # Account configuration
│   ├── HoldList.tsx                  # Active holds display
│   ├── LimitDisplay.tsx              # Account limits
│   ├── StatementList.tsx             # Statement history
│   └── CloseAccountDialog.tsx        # Account closure confirmation
├── hooks/
│   ├── useAccounts.ts                # Account list query
│   ├── useAccount.ts                 # Single account query
│   ├── useAccountBalance.ts          # Balance query with real-time
│   ├── useAccountLimits.ts           # Limits query
│   ├── useStatement.ts               # Statement generation
│   └── useCloseAccount.ts            # Account closure mutation
├── api/
│   ├── accounts.api.ts               # Account API endpoints
│   └── accounts.types.ts             # Account request/response types
├── types/
│   └── accounts.types.ts             # Account domain types
└── validators/
    └── accounts.validators.ts        # Account settings schemas
```

**Responsibilities:** Account listing, detail view, balance inquiry, holds, limits, statements, account settings, account closure.

### 4.4 Transactions Module (`features/transactions/`)

```
features/transactions/
├── index.ts
├── components/
│   ├── TransactionFeed.tsx           # Infinite-scroll transaction list
│   ├── TransactionRow.tsx            # Single transaction display
│   ├── TransactionDetail.tsx         # Full transaction view
│   ├── TransactionSearch.tsx         # Search interface
│   ├── TransactionFilters.tsx        # Filter controls
│   ├── TransactionCategory.tsx       # Category badge/display
│   ├── TransactionMetadata.tsx       # Extended metadata display
│   └── BalanceSnapshotChart.tsx      # Historical balance chart
├── hooks/
│   ├── useTransactions.ts            # Transaction list (cursor-paginated)
│   ├── useTransaction.ts             # Single transaction
│   ├── useTransactionSearch.ts       # Advanced search
│   ├── useUpdateCategory.ts          # Category override mutation
│   └── useBalanceHistory.ts          # Balance snapshot queries
├── api/
│   ├── transactions.api.ts           # Transaction API endpoints
│   └── transactions.types.ts         # Transaction request/response types
├── types/
│   └── transactions.types.ts         # Transaction domain types
└── validators/
    └── transactions.validators.ts    # Search/filter schemas
```

**Responsibilities:** Transaction listing, search, filtering, categorization, detail view, balance history.

**Key architectural decisions:**
- Cursor-based pagination (infinite scroll, not page numbers)
- Virtualization for lists exceeding 100 items
- Search uses POST endpoint for complex queries
- Category updates are optimistic with server reconciliation

### 4.5 Cards Module (`features/cards/`)

```
features/cards/
├── index.ts
├── components/
│   ├── CardTile.tsx                  # Card summary display
│   ├── CardList.tsx                  # All cards listing
│   ├── CardDetail.tsx                # Full card view
│   ├── CardVisual.tsx                # Card number/brand display (masked)
│   ├── CardStatusBadge.tsx           # Status indicator
│   ├── CardControls.tsx              # Spending controls
│   ├── CardLimits.tsx                # Limit management
│   ├── FreezeCardDialog.tsx          # Freeze confirmation
│   ├── CardTransactions.tsx          # Card-specific transactions
│   └── IssueCardDialog.tsx           # New card issuance
├── hooks/
│   ├── useCards.ts                   # Card list query
│   ├── useCard.ts                    # Single card query
│   ├── useIssueCard.ts               # Card issuance mutation
│   ├── useFreezeCard.ts              # Freeze/unfreeze mutation
│   ├── useReplaceCard.ts             # Card replacement mutation
│   ├── useCardControls.ts            # Controls query/mutation
│   └── useCardLimits.ts              # Limits query/mutation
├── api/
│   ├── cards.api.ts                  # Card API endpoints
│   └── cards.types.ts                # Card request/response types
├── types/
│   └── cards.types.ts                # Card domain types
└── validators/
    └── cards.validators.ts           # Card settings schemas
```

**Responsibilities:** Card listing, issuance, freeze/unfreeze, replacement, controls, limits, authorization history.

### 4.6 Transfer Module (`features/transfers/`)

```
features/transfers/
├── index.ts
├── components/
│   ├── TransferForm.tsx              # Transfer initiation form
│   ├── TransferReview.tsx            # Confirmation screen
│   ├── TransferStatus.tsx            # Status tracking display
│   ├── TransferHistory.tsx           # Transfer list
│   ├── TransferDetail.tsx            # Single transfer view
│   ├── RecurringTransferList.tsx     # Recurring transfers
│   ├── RecurringTransferForm.tsx     # Recurring setup
│   ├── FxQuoteDisplay.tsx            # Exchange rate display
│   ├── LimitWarning.tsx              # Limit threshold alerts
│   └── BeneficiarySelector.tsx       # Recipient picker
├── hooks/
│   ├── useTransfer.ts                # Single transfer query
│   ├── useTransfers.ts               # Transfer list query
│   ├── useCreateTransfer.ts          # Transfer initiation mutation
│   ├── useCancelTransfer.ts          # Transfer cancellation mutation
│   ├── useFxQuote.ts                 # FX quote query (with TTL)
│   ├── useTransferLimits.ts          # Limits query
│   ├── useRecurringTransfers.ts      # Recurring list query
│   ├── useCreateRecurring.ts         # Recurring creation mutation
│   └── useTransferStatus.ts          # Real-time status polling
├── api/
│   ├── transfers.api.ts              # Transfer API endpoints
│   └── transfers.types.ts            # Transfer request/response types
├── types/
│   └── transfers.types.ts            # Transfer domain types
└── validators/
    └── transfers.validators.ts       # Transfer form schemas
```

**Responsibilities:** Transfer initiation, review, confirmation, status tracking, recurring transfers, FX quotes, limit management.

**Key architectural decisions:**
- Transfer form is multi-step (initiate → review → confirm)
- FX quotes have 60-second TTL with countdown display
- Transfer status uses polling (every 2 seconds during Processing)
- Idempotency key generated client-side and included in all transfer requests
- Beneficiary selection is a sub-component, not a separate feature

### 4.7 Savings Module (`features/savings/`)

```
features/savings/
├── index.ts
├── components/
│   ├── GoalCard.tsx                  # Savings goal summary
│   ├── GoalList.tsx                  # All goals listing
│   ├── GoalDetail.tsx                # Goal progress view
│   ├── GoalProgress.tsx              # Progress visualization
│   ├── CreateGoalDialog.tsx          # New goal creation
│   ├── SavingsRuleList.tsx           # Automated rules
│   ├── SavingsRuleForm.tsx           # Rule configuration
│   └── InterestRateDisplay.tsx       # Current rates
├── hooks/
│   ├── useGoals.ts                   # Goals list query
│   ├── useGoal.ts                    # Single goal query
│   ├── useCreateGoal.ts              # Goal creation mutation
│   ├── useUpdateGoal.ts              # Goal update mutation
│   ├── useRules.ts                   # Rules list query
│   ├── useCreateRule.ts              # Rule creation mutation
│   └── useInterestRates.ts           # Rates query
├── api/
│   ├── savings.api.ts                # Savings API endpoints
│   └── savings.types.ts              # Savings request/response types
├── types/
│   └── savings.types.ts              # Savings domain types
└── validators/
    └── savings.validators.ts         # Goal/rule schemas
```

**Responsibilities:** Savings goals, automated rules, progress tracking, interest rates.

### 4.8 Notifications Module (`features/notifications/`)

```
features/notifications/
├── index.ts
├── components/
│   ├── NotificationBell.tsx          # Header notification icon + count
│   ├── NotificationList.tsx          # Notification center panel
│   ├── NotificationItem.tsx          # Single notification
│   ├── NotificationPreferences.tsx   # Channel/frequency settings
│   └── EmptyNotifications.tsx        # Empty state
├── hooks/
│   ├── useNotifications.ts           # Notification list query
│   ├── useUnreadCount.ts             # Unread badge count
│   ├── useMarkAsRead.ts              # Mark read mutation
│   ├── useMarkAllRead.ts             # Mark all read mutation
│   └── useNotificationPreferences.ts # Preferences query/mutation
├── api/
│   ├── notifications.api.ts          # Notification API endpoints
│   └── notifications.types.ts        # Notification request/response types
├── types/
│   └── notifications.types.ts        # Notification domain types
└── validators/
    └── notifications.validators.ts   # Preference schemas
```

**Responsibilities:** Notification display, read tracking, preference management, real-time badge updates.

**Key architectural decisions:**
- Unread count polled every 60 seconds
- WebSocket or SSE for real-time notifications (future)
- Notification preferences use optimistic updates

### 4.9 Analytics Module (`features/analytics/`)

```
features/analytics/
├── index.ts
├── components/
│   ├── SpendingBreakdown.tsx         # Category-wise spending
│   ├── SpendingTrend.tsx             # Spending over time chart
│   ├── CategoryDetail.tsx            # Category deep-dive
│   ├── BudgetCard.tsx                # Budget overview
│   ├── BudgetForm.tsx                # Budget creation/editing
│   ├── CashFlowChart.tsx             # Income vs expenses
│   ├── CashFlowForecast.tsx          # Forecast display
│   ├── InsightList.tsx               # Personalized insights
│   └── MerchantIntelligence.tsx      # Merchant spending data
├── hooks/
│   ├── useSpendingBreakdown.ts       # Category breakdown query
│   ├── useSpendingTrend.ts           # Trend data query
│   ├── useBudgets.ts                 # Budget list query
│   ├── useCreateBudget.ts            # Budget creation mutation
│   ├── useCashFlow.ts                # Cash flow data query
│   ├── useForecast.ts                # Forecast query
│   └── useInsights.ts                # Insights query
├── api/
│   ├── analytics.api.ts              # Analytics API endpoints
│   └── analytics.types.ts            # Analytics request/response types
├── types/
│   └── analytics.types.ts            # Analytics domain types
└── validators/
    └── analytics.validators.ts       # Budget/filter schemas
```

**Responsibilities:** Spending analysis, budget tracking, cash flow forecasting, insights, merchant intelligence.

### 4.10 Admin Module (`features/admin/`)

```
features/admin/
├── index.ts
├── components/
│   ├── UserManagement.tsx            # User list and actions
│   ├── AccountManagement.tsx         # Account administration
│   ├── TransferOversight.tsx         # Transfer monitoring
│   ├── CardManagement.tsx            # Card administration
│   ├── KycReviewQueue.tsx            # KYC document review
│   ├── FraudDashboard.tsx            # Fraud alerts and cases
│   ├── AuditLogSearch.tsx            # Audit log querying
│   ├── ConfigManagement.tsx          # System configuration
│   └── FeatureFlagManager.tsx        # Feature flag management
├── hooks/
│   ├── useAdminUsers.ts              # User management queries
│   ├── useAdminAccounts.ts           # Account administration
│   ├── useAdminTransfers.ts          # Transfer oversight
│   ├── useAdminKyc.ts                # KYC review
│   ├── useAdminFraud.ts              # Fraud management
│   ├── useAdminAudit.ts              # Audit log search
│   └── useAdminConfig.ts             # Config management
├── api/
│   ├── admin.api.ts                  # Admin API endpoints
│   └── admin.types.ts                # Admin request/response types
├── types/
│   └── admin.types.ts                # Admin domain types
└── validators/
    └── admin.validators.ts           # Admin action schemas
```

**Responsibilities:** User management, account administration, transfer oversight, KYC review, fraud case management, audit log search, system configuration.

### 4.11 Settings Module (`features/settings/`)

```
features/settings/
├── index.ts
├── components/
│   ├── SettingsLayout.tsx            # Settings page layout
│   ├── ProfileSettings.tsx           # Profile editing
│   ├── SecuritySettings.tsx          # Password, MFA, sessions
│   ├── NotificationSettings.tsx      # Notification preferences
│   ├── DisplaySettings.tsx           # Language, timezone, currency
│   ├── PrivacySettings.tsx           # Data sharing preferences
│   ├── DeviceManagement.tsx          # Trusted devices
│   └── SessionManagement.tsx         # Active sessions
├── hooks/
│   ├── useProfile.ts                 # Profile query/mutation
│   ├── useSecuritySettings.ts        # Security settings
│   ├── useDevices.ts                 # Device list query
│   ├── useRevokeDevice.ts            # Device revocation mutation
│   ├── useSessions.ts                # Session list query
│   └── useRevokeSession.ts           # Session revocation mutation
├── api/
│   ├── settings.api.ts               # Settings API endpoints
│   └── settings.types.ts             # Settings request/response types
├── types/
│   └── settings.types.ts             # Settings domain types
└── validators/
    └── settings.validators.ts        # Settings schemas
```

**Responsibilities:** Profile management, security settings, notification preferences, display settings, device management, session management.

### 4.12 Shared Module (`shared/`)

```
shared/
├── api/
│   ├── client.ts                     # Axios instance configuration
│   ├── interceptors.ts               # Request/response interceptors
│   ├── token-refresh.ts              # Token refresh queue management
│   ├── error-handler.ts              # API error normalization
│   └── index.ts                      # Public API exports
│
├── components/
│   ├── ui/                           # Primitive UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Dialog/
│   │   ├── Dropdown/
│   │   ├── Toast/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Skeleton/
│   │   ├── Spinner/
│   │   └── ...
│   │
│   ├── data-display/                 # Data presentation components
│   │   ├── DataTable/
│   │   ├── Card/
│   │   ├── StatCard/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   └── ...
│   │
│   ├── feedback/                     # User feedback components
│   │   ├── Alert/
│   │   ├── Banner/
│   │   ├── ConfirmationDialog/
│   │   ├── Progress/
│   │   └── ...
│   │
│   ├── form/                         # Form infrastructure
│   │   ├── FormField/
│   │   ├── FormError/
│   │   ├── FormSection/
│   │   └── ...
│   │
│   ├── layout/                       # Layout primitives
│   │   ├── PageHeader/
│   │   ├── PageContainer/
│   │   ├── Sidebar/
│   │   ├── Breadcrumb/
│   │   └── ...
│   │
│   └── navigation/                   # Navigation components
│       ├── Link/
│       ├── Tabs/
│       ├── Pagination/
│       └── ...
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   ├── useLocalStorage.ts
│   ├── useClipboard.ts
│   ├── useClickOutside.ts
│   ├── useKeyPress.ts
│   ├── usePagination.ts
│   ├── useVirtualScroll.ts
│   └── index.ts
│
├── lib/
│   ├── format.ts                     # Currency, date, number formatting
│   ├── sanitize.ts                   # Input/output sanitization
│   ├── crypto.ts                     # Client-side hashing utilities
│   ├── storage.ts                    # Type-safe storage wrapper
│   ├── url.ts                        # URL construction utilities
│   └── index.ts
│
├── types/
│   ├── api.types.ts                  # API response envelope types
│   ├── common.types.ts               # Shared domain types
│   └── index.ts
│
├── constants/
│   ├── api.constants.ts              # API paths, timeouts
│   ├── ui.constants.ts               # Breakpoints, animations
│   └── index.ts
│
├── validators/
│   ├── common.validators.ts          # Shared validation rules
│   └── index.ts
│
└── config/
    ├── features.ts                   # Feature flag definitions
    └── index.ts
```

---

## 5. Component Architecture

### 5.1 Atomic Design vs Feature Components

FinFlow uses a **hybrid approach** that combines the clarity of atomic design for shared primitives with the locality of feature-based organization for business components.

**Shared components** follow atomic design principles:
- **Primitives** (`ui/`): Button, Input, Select, Dialog — no business logic
- **Composites** (`ui/`): FormField (Label + Input + Error), DataTable (Table + Pagination + Filters)
- **Patterns** (`components/`): PageHeader, EmptyState, ErrorState — recurring UI patterns

**Feature components** are organized by domain, not by atomic level:
- `features/transfers/components/TransferForm.tsx` — a complex form, not an "organism"
- `features/accounts/components/AccountCard.tsx` — a data display, not a "molecule"
- The atomic level is irrelevant for feature components; what matters is their feature boundary

### 5.2 Container vs Presentational

FinFlow does **not** enforce a strict Container/Presentational split. Instead, it follows a **hooks-based composition model**:

**Components own rendering logic.** They render what they receive. They do not fetch data.

**Hooks own data logic.** Custom hooks encapsulate API calls, data transformation, and business rules. Components consume hooks.

**Why this is preferred over Container/Presentational:**
- No artificial component explosion (one presentational + one container for every view)
- Hooks are composable and testable in isolation
- Components can be tested with mock data without needing the full container tree
- Clear separation: hooks handle data, components handle display

### 5.3 Reusable Component Principles

**Every shared component must satisfy:**

1. **Self-contained** — All rendering logic, styling, and behavior is within the component. No external DOM manipulation.

2. **Fully typed** — Props interface exported and documented. No `any`. No optional props without defaults.

3. **Accessible by default** — Semantic HTML. ARIA attributes where needed. Keyboard navigable. Screen reader tested.

4. **Themeable** — Respects the theming system. No hardcoded colors, spacing, or typography. Uses design tokens.

5. **Composable** — Accepts children, render props, or compound component composition. Does not force specific content.

6. **Tested** — Unit tests for rendering, interaction, and accessibility. Visual regression tests for complex components.

### 5.4 Composition Strategy

**Compound Components:** Components that work together as a family (e.g., `Select` + `SelectOption` + `SelectGroup`).

**Render Props:** When a component needs to delegate rendering to its consumer (e.g., `VirtualList` renders items via a render function).

**Children Composition:** Simple cases where a component wraps content (e.g., `Card`, `Dialog`, `FormField`).

**No HOCs:** Higher-order components are not used. They obscure data flow, break type inference, and create wrapper hell. Hooks replace all HOC use cases.

---

## 6. State Management Strategy

### 6.1 State Classification

| State Category | Where It Lives | Example |
|---|---|---|
| **Server State** | TanStack Query cache | Account balances, transaction lists, user profile |
| **Client State** | React state (useState/useReducer) | Modal open/close, selected tab, accordion expanded |
| **Form State** | React Hook Form | Form inputs, validation errors, dirty fields |
| **UI State** | React state | Loading spinners, optimistic updates, animation state |
| **Session State** | AuthProvider context + memory | Current user, JWT, permissions, session expiry |
| **Persistent State** | localStorage (type-safe wrapper) | Theme preference, sidebar collapsed, recent searches |
| **URL State** | React Router search params | Filters, pagination cursor, sort order, active tab |

### 6.2 Server State (TanStack Query)

**Default Query Configuration:**
- `staleTime`: 30 seconds (data is considered fresh for 30 seconds)
- `gcTime`: 5 minutes (unused data garbage collected after 5 minutes)
- `refetchOnWindowFocus`: true (revalidate when tab gains focus)
- `refetchOnReconnect`: true (revalidate when network recovers)
- `retry`: 1 with exponential backoff for GET, 0 for mutations

**Per-Query Overrides:**

| Data Type | staleTime | gcTime | Rationale |
|---|---|---|---|
| Financial data (balance, transactions) | 15 sec | 5 min | Must be near-real-time |
| User profile | 5 min | 30 min | Changes infrequently |
| Dashboard summary | 30 sec | 5 min | Balance of freshness and performance |
| Reference data (categories, limits) | 1 hour | 24 hours | Rarely changes |
| Notification preferences | 5 min | 30 min | User-initiated changes |

**Query Key Convention:**
Query keys follow a hierarchical array structure: `['domain', 'entity', { filters }]`. This enables precise cache invalidation — invalidating `['accounts']` invalidates all account queries, while invalidating `['accounts', { id: '123' }]` invalidates only that specific account.

### 6.3 Client State

UI state that is purely client-side (no server involvement) lives in React components:

- **Module-level state:** `useState` / `useReducer` within components
- **Shared UI state:** React Context (used sparingly, for genuinely cross-component concerns)
- **URL state:** React Router search params for state that should survive page refresh and be shareable (filters, pagination, sort)

**Rule:** If the state affects the URL (shareable, bookmarkable), it goes in URL params. If the state is needed across multiple components in a route, it goes in a context or URL. If it is local to one component, it stays in that component.

### 6.4 Form State (React Hook Form)

All forms use React Hook Form with the following architecture:

- **Validation schemas:** Zod schemas defined in the feature's `validators/` directory
- **Form state:** Managed by React Hook Form (uncontrolled by default, controlled only when necessary)
- **Submission:** Handled through TanStack Query mutations
- **Error mapping:** API errors mapped to form field errors through a shared utility
- **Optimistic updates:** Forms that modify list data apply optimistic updates with rollback on failure

### 6.5 Session State (AuthProvider)

The AuthProvider manages:

- **Current user:** User object from JWT payload (not a separate API call on every render)
- **JWT token:** Stored in memory only (not localStorage, not cookies)
- **Refresh token:** Managed by the API layer (not exposed to components)
- **Permissions:** Derived from JWT roles
- **Session expiry:** Timer that triggers proactive refresh before expiry

**No component directly accesses the JWT.** Components use `useAuth()` hook which provides user info, permissions, and auth actions (login, logout). The token is handled exclusively by the API layer.

### 6.6 Caching Strategy

**Server state caching** is handled entirely by TanStack Query (see 6.2).

**Client state persistence:**

| State | Storage | TTL | Encryption |
|---|---|---|---|
| Theme preference | localStorage | Session | No |
| Sidebar collapsed | localStorage | Session | No |
| Display currency | localStorage | Session | No |
| Language preference | localStorage | 30 days | No |
| Recent searches | localStorage | 7 days | No |
| Draft form data | sessionStorage | Session | No |
| Feature flags | In-memory | 5 minutes | No |

**Rule:** No financial data, tokens, or PII is stored in localStorage or sessionStorage. Storage is used exclusively for UI preferences.

### 6.7 Persistence Strategy

**URL persistence:** Filters, sort order, pagination cursor, active tab → React Router search params. Survives page refresh, shareable via URL.

**Local persistence:** UI preferences → localStorage via type-safe wrapper. Survives browser restart. Cleared on logout.

**Session persistence:** Draft form data → sessionStorage. Survives page refresh within tab. Cleared when tab closes.

**Server persistence:** All financial data, user data, and operational data → Server (via API). Cached in TanStack Query with defined TTLs.

---

## 7. Routing Architecture

### 7.1 Route Structure

```
/                               → Redirect to /dashboard (if authenticated) or /login
/login                          → AuthLayout → LoginForm
/register                       → AuthLayout → RegisterForm
/forgot-password                → AuthLayout → ForgotPasswordForm
/reset-password                 → AuthLayout → ResetPasswordForm
/verify-email                   → AuthLayout → EmailVerification

/dashboard                      → DashboardLayout → Dashboard (default route)
/accounts                       → DashboardLayout → AccountList
/accounts/:accountId            → DashboardLayout → AccountDetail
/accounts/:accountId/transactions → DashboardLayout → TransactionFeed
/transactions                   → DashboardLayout → TransactionFeed (all accounts)
/transactions/search            → DashboardLayout → TransactionSearch

/cards                          → DashboardLayout → CardList
/cards/:cardId                  → DashboardLayout → CardDetail

/transfers                      → DashboardLayout → TransferHistory
/transfers/new                  → DashboardLayout → TransferForm
/transfers/:transferId          → DashboardLayout → TransferDetail
/transfers/recurring            → DashboardLayout → RecurringTransferList
/transfers/recurring/new        → DashboardLayout → RecurringTransferForm

/savings                        → DashboardLayout → GoalList
/savings/goals/:goalId          → DashboardLayout → GoalDetail
/savings/rules                  → DashboardLayout → SavingsRuleList

/notifications                  → DashboardLayout → NotificationList

/analytics                      → DashboardLayout → SpendingBreakdown
/analytics/budgets              → DashboardLayout → BudgetList
/analytics/budgets/new          → DashboardLayout → BudgetForm
/analytics/cashflow             → DashboardLayout → CashFlowChart
/analytics/insights             → DashboardLayout → InsightList

/settings                       → DashboardLayout → SettingsLayout
/settings/profile               → SettingsLayout → ProfileSettings
/settings/security              → SettingsLayout → SecuritySettings
/settings/notifications         → SettingsLayout → NotificationSettings
/settings/display               → SettingsLayout → DisplaySettings
/settings/devices               → SettingsLayout → DeviceManagement
/settings/sessions              → SettingsLayout → SessionManagement

/admin                          → AdminLayout → AdminDashboard
/admin/users                    → AdminLayout → UserManagement
/admin/users/:userId            → AdminLayout → UserDetail
/admin/accounts                 → AdminLayout → AccountManagement
/admin/transfers                → AdminLayout → TransferOversight
/admin/cards                    → AdminLayout → CardManagement
/admin/kyc                      → AdminLayout → KycReviewQueue
/admin/fraud                    → AdminLayout → FraudDashboard
/admin/fraud/cases/:caseId      → AdminLayout → FraudCaseDetail
/admin/audit                    → AdminLayout → AuditLogSearch
/admin/config                   → AdminLayout → ConfigManagement
/admin/feature-flags            → AdminLayout → FeatureFlagManager

*                               → MinimalLayout → NotFound (404)
```

### 7.2 Route Definitions

Routes are defined in a single centralized file (`src/app/routes.tsx`) as a data structure, not as JSX. This enables:

- Programmatic route analysis (build-time validation)
- Type-safe navigation helpers
- Route metadata (title, required roles, animation)
- Centralized lazy loading configuration

### 7.3 Protected Routes

Three route protection layers:

1. **Authentication guard:** Redirects to `/login` if no valid session exists. Applied to all routes under `DashboardLayout` and `AdminLayout`.

2. **Authorization guard:** Checks user roles against route requirements. Applied to admin routes and any role-restricted routes. Returns 403 page if unauthorized.

3. **Feature flag guard:** Hides routes for features behind feature flags. If feature is disabled, route redirects to default dashboard.

### 7.4 Lazy Loading and Code Splitting

Every feature module is lazy-loaded. The route configuration specifies which component to lazy-load:

**Splitting strategy:**

| Chunk | Content | Estimated Size |
|---|---|---|
| `auth` | Login, register, password reset | ~30 KB |
| `dashboard` | Dashboard overview | ~40 KB |
| `accounts` | Account management | ~35 KB |
| `transactions` | Transaction history + search | ~45 KB |
| `cards` | Card management | ~40 KB |
| `transfers` | Transfer forms + history | ~50 KB |
| `savings` | Savings goals + rules | ~30 KB |
| `analytics` | Charts + analytics | ~60 KB |
| `notifications` | Notification center | ~20 KB |
| `admin` | Admin panel | ~70 KB |
| `settings` | User settings | ~25 KB |
| `shared` | Shared components + utils | ~80 KB |

**Total initial bundle target:** < 150 KB (gzipped)

### 7.5 Navigation Guards

Navigation guards are implemented as route-level wrappers:

- **Before each navigation:** Check authentication status, check role permissions, check feature flags
- **On route change:** Update document title, scroll to top, cancel pending requests from previous route
- **Unsaved changes warning:** Prompt user before navigating away from forms with unsaved changes

### 7.6 Deep Linking

All routes support direct deep linking. No client-side state is required to render a route — all necessary data is fetched based on URL parameters.

**Example:** `/accounts/123/transactions?cursor=abc&sort=-posted_at` loads account 123, fetches transactions starting from cursor `abc`, sorted by most recent first.

---

## 8. API Layer

### 8.1 Axios Architecture

A single Axios instance is configured with:

- **Base URL:** Environment-specific (`/api/v1` in production, proxied in development)
- **Timeout:** 30 seconds for standard requests, 60 seconds for file uploads
- **Content-Type:** `application/json` for all requests
- **Response type:** JSON (default)

### 8.2 Request Interceptors

**Authentication interceptor:** Attaches the current JWT to every request via `Authorization: Bearer {token}` header. If no token exists, the request proceeds without the header (public endpoints).

**Request ID interceptor:** Generates a unique `X-Request-Id` UUID for every request. Stores it for correlation with error responses.

**Device fingerprint interceptor:** Attaches the device fingerprint header (`X-Device-Fingerprint`) for fraud detection correlation.

**Idempotency interceptor:** For mutation requests (POST, PUT, PATCH, DELETE), automatically generates and attaches an `Idempotency-Key` UUID header if not already present.

### 8.3 Response Interceptors

**Success interceptor:** Unwraps the `{ data, meta }` response envelope. Components receive the `data` directly, not the wrapper. The `meta` information (rate limits, pagination) is stored in query metadata.

**Error interceptor:** Normalizes all error responses into a consistent error object structure. Maps HTTP status codes to error categories. Attaches the `request_id` for debugging.

### 8.4 Token Refresh Architecture

The token refresh mechanism is the most critical piece of the API layer:

**Problem:** When a JWT expires mid-request, multiple concurrent requests may all attempt to refresh simultaneously, causing race conditions and wasted refresh tokens.

**Solution: Request queuing with singleton refresh.**

1. When a request receives a 401 response, it is queued
2. A single token refresh request is initiated (only one, even if multiple requests got 401)
3. If the refresh succeeds, all queued requests are retried with the new token
4. If the refresh fails, all queued requests are rejected, the user is logged out
5. A mutex lock prevents concurrent refresh attempts

**Flow:**
```
Request A → 401 → Queue A, Initiate Refresh
Request B → 401 → Queue B (refresh already in progress)
Request C → 200 → No action (token still valid for this request)
Refresh succeeds → Retry A with new token, Retry B with new token
```

### 8.5 Error Handling

The API layer provides typed error responses that map to the error catalog defined in `API_ARCHITECTURE.md` Section 10.1:

**Error categories and frontend handling:**

| Category | HTTP Status | Frontend Behavior |
|---|---|---|
| Validation | 400 | Map errors to form fields, display inline |
| Authentication | 401 | Redirect to login (unless on login page) |
| Authorization | 403 | Display "insufficient permissions" page |
| Not Found | 404 | Display "resource not found" page |
| Conflict | 409 | Display conflict resolution UI |
| Rate Limited | 429 | Display retry-after countdown |
| Server Error | 500 | Display generic error, log for investigation |
| External Service | 502 | Display "service temporarily unavailable" |

### 8.6 Retry Strategy

| Request Type | Retry Count | Backoff | Retryable Errors |
|---|---|---|---|
| GET | 1 | Exponential (1s, 2s) | 500, 502, 503, Network Error |
| POST (idempotent) | 1 | Fixed (1s) | 500, 502, 503 |
| POST (non-idempotent) | 0 | N/A | N/A |
| Token refresh | 0 | N/A | N/A (handled by queue) |

**Rule:** Mutations that are not idempotent (login, non-idempotent transfers) are never retried automatically. The user must explicitly retry.

### 8.7 Request Cancellation

Every API request supports cancellation through AbortController:

- **Route change:** All pending requests from the previous route are cancelled
- **Component unmount:** All requests initiated by the unmounted component are cancelled
- **Manual cancel:** Search inputs cancel previous searches when a new keystroke arrives
- **Token refresh:** Previous in-flight requests are cancelled after token refresh (retried with new token)

---

## 9. Form Architecture

### 9.1 Form Infrastructure

All forms use React Hook Form with Zod validation:

- **Validation library:** Zod (type-safe schemas, runtime validation)
- **Form library:** React Hook Form (uncontrolled by default, performance-optimized)
- **Error display:** Inline field-level errors + form-level error banner
- **Submission:** Connected to TanStack Query mutations

### 9.2 Validation Strategy

**Three-layer validation:**

| Layer | Where | What |
|---|---|---|
| **Schema validation** | Zod schema (client-side) | Format, required fields, string length, patterns |
| **Business rule validation** | API response (server-side) | Balance sufficiency, limit compliance, status eligibility |
| **Cross-field validation** | Zod refine (client-side) | Date range consistency, password match, conditional requirements |

**Rules:**
- Client-side validation is instant (no network round-trip)
- Server-side validation errors are mapped back to form fields
- All validation errors are displayed simultaneously (not one at a time)
- Client-side validation mirrors server-side rules (never trust client validation alone)

### 9.3 Reusable Form Patterns

**Transfer Form Pattern:**
- Multi-step wizard (Initiate → Review → Confirm)
- Step state preserved across navigation
- Validation at each step boundary
- Final review step is read-only summary
- Confirmation requires biometric/2FA

**Settings Form Pattern:**
- Auto-save on blur (no explicit save button)
- Optimistic updates with server reconciliation
- Dirty indicator when changes are pending
- Reset to last saved state on cancel

**Search Form Pattern:**
- Debounced input (300ms)
- URL-synced filters (bookmarkable)
- Clear all filters action
- Active filter count badge

### 9.4 Error Handling

**Field-level errors:** Displayed below the invalid field with a red border and error message.

**Form-level errors:** Displayed in a banner at the top of the form with the error message and a link to the problematic field.

**Server-side errors:** Mapped to form fields when the field name is provided. Displayed as form-level error when the field cannot be determined.

**Network errors:** Displayed as a toast notification. Form state is preserved for retry.

### 9.5 Submission Flow

```
User submits form
    ↓
Client-side validation runs
    ↓ (passes)
Disable submit button, show loading state
    ↓
TanStack Query mutation fires
    ↓ (success)
Invalidate related queries
    ↓
Display success toast
    ↓
Navigate to success state / close form
    ↓ (failure)
Map error to form fields
    ↓
Re-enable submit button, show error state
```

---

## 10. Authentication Architecture

### 10.1 JWT Storage

**Access token:** Stored in memory (JavaScript variable, not accessible to XSS). Never in localStorage, sessionStorage, or cookies.

**Refresh token:** Managed exclusively by the API layer. Never exposed to components or accessible through any browser storage API. The refresh token is received and sent through HTTP-only cookies or request bodies only.

**Why not localStorage:** localStorage is accessible to any JavaScript running on the page, including injected XSS scripts. A compromised access token gives an attacker full API access for the token's lifetime.

**Why not cookies:** Cookies introduce CSRF concerns. While CSRF tokens can mitigate this, header-based auth (Bearer token) is inherently CSRF-safe and simpler.

### 10.2 Token Lifecycle

```
User logs in
    ↓
Server returns: { access_token (15min), refresh_token (7d) }
    ↓
access_token stored in memory (JavaScript variable)
refresh_token stored in HTTP-only cookie OR managed by API layer
    ↓
API requests use: Authorization: Bearer {access_token}
    ↓
Token expires (after 15 minutes)
    ↓
Next API request → 401 response
    ↓
API layer sends refresh request with refresh_token
    ↓
Server returns: new access_token + new refresh_token (old invalidated)
    ↓
Original request retried with new access_token
```

### 10.3 Refresh Token Rotation

Every refresh issues a new refresh token and invalidates the old one. This prevents stolen refresh tokens from being reused:

1. Refresh token A issued at login
2. First refresh: Token A → Token B (A invalidated)
3. Second refresh: Token B → Token C (B invalidated)
4. If Token A is reused (stolen): Security event triggered, all user sessions invalidated, user notified

### 10.4 Session Handling

**Session state** is managed by the AuthProvider:
- Current user object (from JWT payload, parsed on login)
- User permissions (derived from JWT roles)
- Session expiry timestamp (for proactive refresh)
- Device information

**Session timeout:**
- Proactive refresh initiated 2 minutes before JWT expiry
- If refresh fails, user is logged out with a message
- Sensitive operations (transfers > $500) require recent authentication (< 5 minutes)

### 10.5 Logout Flow

```
User clicks logout
    ↓
Clear access token from memory
    ↓
Send logout request to server (invalidate refresh token)
    ↓
Clear TanStack Query cache
    ↓
Clear any persisted local state
    ↓
Redirect to /login
```

**Logout all devices:** Same flow, but server invalidates ALL refresh tokens for the user.

### 10.6 Remember Me

"Remember me" controls refresh token lifetime:
- **Checked:** Refresh token valid for 30 days
- **Unchecked:** Refresh token valid for 24 hours

The choice is stored as a server-side preference, not a client-side flag. The refresh token's TTL is set by the server based on this preference.

---

## 11. Performance Strategy

### 11.1 Bundle Splitting

**Route-based splitting:** Every route lazy-loads its feature module. The initial bundle contains only the app shell, shared components, and the current route.

**Vendor splitting:** Third-party libraries are split into separate chunks:
- `vendor-react`: React, ReactDOM (~40 KB gzipped)
- `vendor-query`: TanStack Query (~15 KB gzipped)
- `vendor-forms`: React Hook Form, Zod (~20 KB gzipped)
- `vendor-charts`: Chart library (~30 KB gzipped, only loaded on analytics routes)
- `vendor-ui`: Component library dependencies (~25 KB gzipped)

### 11.2 Lazy Loading

| Resource | Loading Strategy |
|---|---|
| Feature modules | Lazy-loaded per route (React.lazy + Suspense) |
| Heavy components (charts, date pickers) | Lazy-loaded on demand |
| Images | Lazy-loaded with IntersectionObserver |
| Below-fold content | Lazy-loaded with IntersectionObserver |
| Modals | Lazy-loaded when first triggered |
| Fonts | Font-display: swap; subset for Latin characters |

### 11.3 Memoization

**When to memoize:**
- Components that receive object/array props and render expensive lists
- Callbacks passed to child components in lists (useCallback)
- Expensive computations that depend on large datasets (useMemo)

**When NOT to memoize:**
- Simple components with cheap renders
- Components that always re-render (parent re-renders, no optimization possible)
- Premature optimization without profiling evidence

**Rule:** Memoize when profiling shows a problem, not preemptively.

### 11.4 Virtualization

Lists exceeding 100 items must use virtualization (react-window or similar):
- Transaction lists
- Notification lists
- Admin user lists
- Audit log search results

**Virtualization threshold:** 100 items (below this, DOM rendering is faster than virtualization overhead).

### 11.5 Image Optimization

- All images served through a CDN with automatic format negotiation (WebP, AVIF)
- Responsive images with `srcset` for different viewport sizes
- Lazy loading for below-fold images
- Blur-up placeholder technique for progressive loading
- Maximum image dimensions enforced at upload

### 11.6 Prefetching

- **Route prefetching:** On hover/focus of navigation links, prefetch the target route's module
- **Data prefetching:** On hover/focus of links to detail pages, prefetch the detail query
- **Predictive prefetching:** On dashboard, prefetch likely next actions (recent account transactions)

### 11.7 Performance Budgets

| Metric | Budget |
|---|---|
| Initial bundle (gzipped) | < 150 KB |
| Route chunks (gzipped, max) | < 70 KB |
| First Contentful Paint | < 1.2 seconds |
| Largest Contentful Paint | < 2.5 seconds |
| Cumulative Layout Shift | < 0.1 |
| Total Blocking Time | < 200 ms |
| Time to Interactive | < 1.5 seconds |

---

## 12. Error Handling

### 12.1 Error Boundary Architecture

**Three levels of error boundaries:**

1. **App-level boundary:** Catches errors that crash the entire application. Displays a full-page error with "Reload application" action. Logs the error to the monitoring service.

2. **Route-level boundary:** Catches errors within a specific route. Displays a route-specific error with "Go to dashboard" action. Does not affect other routes.

3. **Component-level boundary:** Catches errors within a specific component tree (e.g., a chart, a data table). Displays an inline fallback within the component's container. Does not affect the rest of the page.

### 12.2 Error Page Strategy

| Page | When | User Action |
|---|---|---|
| **404 Not Found** | Route does not match any defined route | "Go to dashboard" button |
| **403 Forbidden** | Authenticated but insufficient permissions | "Go to dashboard" button |
| **500 Server Error** | Unhandled exception in the application | "Reload" button + error reporting |
| **Offline** | Network connectivity lost | "Retry when online" + cached data |

### 12.3 Offline Mode

When the user loses connectivity:

1. **Immediate indicator:** Banner displayed at top: "You are offline. Some features may be unavailable."
2. **Read operations:** Fall back to TanStack Query cache (last known data)
3. **Write operations:** Disabled with tooltip: "This action requires an internet connection"
4. **Recovery:** When connectivity returns, banner disappears, pending queries refetch automatically

### 12.4 Error Reporting

All unhandled errors are reported to the error monitoring service (Sentry or similar) with:

- **User ID** (anonymized for privacy)
- **Session ID** (for correlation)
- **Route** where the error occurred
- **Component stack** (for rendering errors)
- **User action** that triggered the error (if applicable)
- **Environment** (production, staging, development)
- **Browser and device information**

**Sensitive data excluded from error reports:** Passwords, tokens, account numbers, financial data, full names, email addresses.

### 12.5 Fallback UI Principles

- **Never show a blank page.** Every error state has visible content.
- **Never show raw error messages.** Internal details are logged, not displayed.
- **Always provide a recovery path.** Every error screen has at least one action button.
- **Preserve user input.** Form data is preserved across errors so the user does not lose progress.
- **Consistent styling.** Error pages use the same design system as the rest of the application.

---

## 13. Frontend Security

### 13.1 XSS Prevention

**Content Security Policy (CSP):**
- `default-src 'none'` — Deny everything by default
- `script-src 'self'` — Only self-hosted scripts (no CDN scripts)
- `style-src 'self' 'unsafe-inline'` — Self-hosted styles (inline required for dynamic theming)
- `img-src 'self' data: https:` — Self-hosted images, data URIs, HTTPS images
- `connect-src 'self'` — API calls only to same origin (proxied in production)
- `font-src 'self'` — Self-hosted fonts only

**Output encoding:**
- React's default JSX escaping handles most XSS vectors
- `dangerouslySetInnerHTML` is never used
- User-provided content is sanitized through a DOMPurify wrapper before any non-React rendering

**Input validation:**
- All user input is validated client-side (Zod schemas)
- All user input is validated server-side (API layer)
- No input is trusted — client validation is for UX, server validation is for security

### 13.2 CSRF Discussion

Cross-Site Request Forgery is not applicable to FinFlow because:

- Authentication uses the `Authorization` header (Bearer token), not cookies
- CSRF attacks require cookie-based authentication to work
- The `Authorization` header is not automatically included in cross-origin requests

**If cookies are ever introduced** (e.g., for web session management), CSRF tokens will be mandatory using the double-submit cookie pattern.

### 13.3 Input Sanitization

- **HTML sanitization:** DOMPurify for any user content that might contain HTML
- **SQL injection:** Not applicable (frontend does not directly query databases)
- **Command injection:** Not applicable (frontend does not execute system commands)
- **XSS via attributes:** React attribute escaping handles this by default
- **URL sanitization:** All user-provided URLs validated against an allowlist of protocols (https only)

### 13.4 Secure Storage

| Data | Storage | Encryption | Rationale |
|---|---|---|---|
| Access token | JavaScript memory | N/A | Not accessible to XSS via storage APIs |
| Refresh token | HTTP-only cookie or API-managed | N/A | Not accessible to JavaScript |
| User preferences | localStorage | No | Non-sensitive, UI only |
| Form drafts | sessionStorage | No | Non-sensitive, ephemeral |
| Sensitive data | Never client-side | N/A | Sensitive data stays server-side |

**Rules:**
- `localStorage` and `sessionStorage` are never used for financial data, tokens, or PII
- The storage wrapper (`shared/lib/storage.ts`) enforces this through type restrictions
- All storage access is logged in development mode for auditing

---

## 14. Internationalization Strategy

### 14.1 Architecture

**Library:** A lightweight i18n library (react-i18next or similar)

**Translation files:** JSON files organized by namespace (feature) and locale:

```
public/locales/
├── en/
│   ├── common.json          # Shared labels, buttons, messages
│   ├── auth.json            # Authentication strings
│   ├── accounts.json        # Account-related strings
│   ├── transactions.json    # Transaction strings
│   ├── transfers.json       # Transfer strings
│   ├── cards.json           # Card strings
│   ├── savings.json         # Savings strings
│   ├── analytics.json       # Analytics strings
│   ├── notifications.json   # Notification strings
│   └── admin.json           # Admin strings
├── es/
│   └── ... (same structure)
├── fr/
│   └── ... (same structure)
└── zh/
    └── ... (same structure)
```

### 14.2 Translation Key Convention

Keys follow a hierarchical structure: `{feature}.{component}.{element}`

Examples:
- `auth.login.title` → "Sign in to FinFlow"
- `auth.login.email_label` → "Email address"
- `transfers.form.insufficient_balance` → "Insufficient balance for this transfer"
- `common.buttons.cancel` → "Cancel"
- `common.buttons.confirm` → "Confirm"
- `common.errors.network` → "Network error. Please check your connection."

### 14.3 Number and Date Formatting

All formatting respects the user's locale:
- **Currency:** `Intl.NumberFormat` with user's display currency and locale
- **Dates:** `Intl.DateTimeFormat` with user's locale and timezone
- **Numbers:** `Intl.NumberFormat` with user's locale (decimal separator, grouping)
- **Relative time:** "2 hours ago", "hace 2 horas" — handled by i18n library

### 14.4 RTL Support

Right-to-left (RTL) support is built into the theming system:
- CSS logical properties used throughout (`margin-inline-start` instead of `margin-left`)
- Layout components flip automatically based on locale direction
- Icon directions are locale-aware (arrow icons flip in RTL)
- Tested with Arabic and Hebrew locales

---

## 15. Accessibility Strategy

### 15.1 Standards

**Target:** WCAG 2.1 Level AA compliance across all components and routes.

### 15.2 Automated Testing

**axe-core** integrated into the testing pipeline:
- Every component test includes an accessibility audit
- Every route has an automated accessibility test
- CI pipeline fails on any critical or serious violation

### 15.3 Manual Testing Protocol

Every new feature must pass:

1. **Keyboard navigation:** All interactive elements reachable and operable via keyboard only
2. **Screen reader:** VoiceOver (macOS) and NVDA (Windows) testing for core flows
3. **Color contrast:** Minimum 4.5:1 for text, 3:1 for large text and UI components
4. **Focus management:** Logical focus order, visible focus indicators, focus trapped in modals
5. **Motion:** Respect `prefers-reduced-motion` setting
6. **Zoom:** Functional at 200% browser zoom

### 15.4 Accessibility Checklist

| Check | Requirement |
|---|---|
| All images | Have `alt` text (decorative images: `alt=""`) |
| All forms | Labels associated with inputs via `htmlFor` |
| All buttons | Have accessible names (text content or `aria-label`) |
| All links | Have meaningful text (not "click here") |
| All modals | Focus trapped, ESC to close, return focus on close |
| All tables | Proper `th` headers, `caption` or `aria-label` |
| All errors | `aria-live="polite"` for dynamic error messages |
| All loading states | `aria-busy="true"` or loading announcements |
| All color usage | Color is never the sole indicator of meaning |

---

## 16. Theming Architecture

### 16.1 Design Token System

The theming system is built on design tokens — named values that represent the design system's decisions:

**Token layers:**

| Layer | Example | Purpose |
|---|---|---|
| **Primitive tokens** | `blue-500: #3B82F6` | Raw color values |
| **Semantic tokens** | `color-primary: {blue-500}` | Contextual meaning |
| **Component tokens** | `button-bg-primary: {color-primary}` | Component-specific usage |

**Token categories:**

| Category | Examples |
|---|---|
| **Color** | Primary, secondary, success, warning, error, neutral scales |
| **Typography** | Font family, sizes (xs → 4xl), weights, line heights |
| **Spacing** | Scale from 0 → 96 (4px increments) |
| **Border radius** | sm, md, lg, xl, full |
| **Shadows** | sm, md, lg, xl |
| **Transitions** | Duration, easing curves |
| **Breakpoints** | sm, md, lg, xl, 2xl |

### 16.2 Theme Variants

**Light theme** (default): Clean, high-contrast, suitable for daylight use.

**Dark theme**: Reduced brightness, muted backgrounds, suitable for low-light environments. All tokens have dark-theme overrides.

**High-contrast theme** (future): WCAG AAA compliant, maximized contrast for accessibility.

### 16.3 Theme Implementation

- Tokens are defined in `tailwind.config.ts` as CSS custom properties
- Components reference tokens, never raw values
- Theme switching is instant (CSS variable swap, no re-render)
- User preference stored in localStorage and respected on subsequent visits
- System preference (`prefers-color-scheme`) detected and offered as default

### 16.4 CSS Architecture

- **Utility-first:** Tailwind CSS for most styling
- **Component variants:** CVA (class-variance-authority) for component style variants
- **Global styles:** Minimal — CSS reset, font imports, CSS custom properties
- **Animations:** Tailwind animation utilities + custom keyframes for complex animations
- **Responsive:** Mobile-first breakpoints, consistent with the design system

---

## 17. Environment Management

### 17.1 Environment Variables

All configuration that differs between environments is managed through environment variables:

| Variable | Development | Staging | Production |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | `https://api-staging.finflow.com/api/v1` | `https://api.finflow.com/api/v1` |
| `VITE_APP_URL` | `http://localhost:5173` | `https://staging.finflow.com` | `https://app.finflow.com` |
| `VITE_SENTRY_DSN` | (disabled) | staging DSN | production DSN |
| `VITE_ENVIRONMENT` | `development` | `staging` | `production` |
| `VITE_ENABLE_MOCKS` | `true` | `false` | `false` |

### 17.2 Environment Files

```
.env.development        # Local development defaults
.env.staging            # Staging overrides
.env.production         # Production overrides
.env.local              # Local overrides (gitignored)
.env.example            # Template (committed, no secrets)
```

**Rules:**
- `.env.local` is gitignored — personal overrides stay local
- No secrets in any environment file (secrets are injected at build/deploy time)
- All variables prefixed with `VITE_` (Vite convention for client-side exposure)
- `env.d.ts` file provides TypeScript types for all environment variables

### 17.3 Feature Flags

Feature flags are managed through a dedicated system:

**Flag types:**

| Type | Purpose | Example |
|---|---|---|
| **Release flag** | Toggle new features during rollout | `ENABLE_NEW_TRANSFER_FLOW` |
| **Experiment flag** | A/B testing variants | `DASHBOARD_LAYOUT_V2` |
| **Ops flag** | Operational toggles | `MAINTENANCE_MODE` |
| **Permission flag** | Feature access by tier | `ENABLE_PREMIUM_ANALYTICS` |

**Flag delivery:** Flags are fetched from the API on app initialization and cached in memory. Flag evaluation is synchronous after initial load. Flag changes require app refresh to take effect.

---

## 18. Testing Strategy

### 18.1 Testing Pyramid

```
                    ┌───────────┐
                    │  E2E Tests │    (10% of tests)
                    │  Critical  │    Slow, high confidence
                    │  user flows│
                    ├───────────┤
                    │Integration │    (30% of tests)
                    │   Tests    │    Moderate speed, high confidence
                    │ Components │
                    │ + API mocks│
                    ├───────────┤
                    │   Unit     │    (60% of tests)
                    │   Tests    │    Fast, moderate confidence
                    │ Functions  │
                    │ Hooks      │
                    │ Validators │
                    └───────────┘
```

### 18.2 Unit Tests

**What to unit test:**
- Utility functions (formatting, calculation, validation)
- Custom hooks (mock API layer, test return values)
- Zod schemas (valid/invalid input validation)
- State machines (status transitions, form states)

**Framework:** Vitest (fast, Vite-native, Jest-compatible API)

### 18.3 Integration Tests

**What to integration test:**
- Component rendering with mocked API data
- User interactions (click, type, submit) with form validation
- Navigation flows (route transitions, guards)
- Error handling (API errors, validation errors)

**Framework:** Vitest + React Testing Library + MSW (Mock Service Worker)

**MSW (Mock Service Worker):**
- All API mocking through MSW handlers
- Handlers mirror the actual API contract (OpenAPI-generated)
- Same handlers used in development, testing, and storybook

### 18.4 End-to-End Tests

**What to E2E test:**
- Complete user flows: registration → KYC → account creation → first transfer
- Authentication flows: login, MFA, password reset, session expiry
- Critical financial flows: transfer initiation, card freeze, balance inquiry
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

**Framework:** Playwright (cross-browser, fast, reliable)

**E2E test environment:** Dedicated test environment with seeded data. Tests run against the staging environment in CI, against local environment in development.

### 18.5 Visual Regression Testing

**What to visual regression test:**
- Shared component library (every component in every state)
- Key page layouts (dashboard, account detail, transfer form)
- Error states (404, 500, offline)

**Framework:** Playwright screenshot comparison + Chromatic (for component library)

### 18.6 Accessibility Testing

**Automated:** axe-core in unit and integration tests (every component and page)

**Manual:** Accessibility checklist in code review. Quarterly manual audit with assistive technology.

### 18.7 Test File Organization

Tests are co-located with the code they test:
- `Button.tsx` → `Button.test.tsx` (same directory)
- `formatCurrency.ts` → `formatCurrency.test.ts` (same directory)
- `useAccounts.ts` → `useAccounts.test.ts` (same directory)

E2E tests are organized by feature:
```
e2e/
├── auth/
│   ├── login.spec.ts
│   ├── register.spec.ts
│   └── mfa.spec.ts
├── transfers/
│   ├── initiate-transfer.spec.ts
│   └── recurring-transfer.spec.ts
└── ...
```

---

## 19. Build Strategy

### 19.1 Build Tool

**Vite** is the build tool, chosen for:
- Sub-second dev server cold start
- Fast HMR (Hot Module Replacement)
- Native ES modules in development
- Optimized production builds via Rollup
- First-class TypeScript and React support

### 19.2 Build Optimization

| Optimization | Purpose |
|---|---|
| **Code splitting** | Route-based lazy loading |
| **Tree shaking** | Remove unused code from dependencies |
| **Minification** | Terser for JavaScript, cssnano for CSS |
| **Asset hashing** | Cache busting for static assets |
| **Compression** | Brotli (preferred) or gzip for served assets |
| **Image optimization** | Automatic WebP/AVIF conversion at build time |
| **Font subsetting** | Include only characters needed for supported languages |

### 19.3 Development Experience

| Feature | Implementation |
|---|---|
| **HMR** | Vite native — sub-second updates |
| **TypeScript** | `tsc --noEmit` as pre-commit check |
| **ESLint** | Flat config with strict rules |
| **Prettier** | Consistent formatting on save |
| **Path aliases** | `@/` → `src/` (import from anywhere in src) |
| **API mocking** | MSW handlers (same in dev and test) |
| **Bundle analysis** | `rollup-plugin-visualizer` for production builds |

### 19.4 CI/CD Pipeline

```
Pull Request Created
    ↓
┌─────────────────────────────────────────┐
│  1. Lint (ESLint)                       │
│  2. Type Check (tsc --noEmit)           │
│  3. Unit Tests (Vitest)                 │
│  4. Integration Tests (Vitest + MSW)    │
│  5. Accessibility Tests (axe-core)      │
│  6. Bundle Size Check (< 150KB budget)  │
│  7. Build Verification (production)     │
└─────────────────────────────────────────┘
    ↓ (all pass)
PR Approved → Merge to main
    ↓
┌─────────────────────────────────────────┐
│  1. Build (Vite production)             │
│  2. E2E Tests (Playwright)              │
│  3. Visual Regression (Chromatic)       │
│  4. Deploy to Staging                   │
│  5. Staging Smoke Tests                 │
└─────────────────────────────────────────┘
    ↓ (all pass)
Deploy to Production
    ↓
┌─────────────────────────────────────────┐
│  1. Canary (5% traffic)                 │
│  2. Monitor (error rate, performance)   │
│  3. Progressive rollout (25% → 50% → 100%)│
└─────────────────────────────────────────┘
```

### 19.5 Monitoring

**Production monitoring:**
- **Sentry:** Error tracking with source maps (uploaded at build time)
- **Lighthouse CI:** Performance budgets enforced in CI
- **Real User Monitoring (RUM):** Core Web Vitals tracked in production
- **Analytics:** Feature usage tracking (privacy-respecting, no PII)

---

## 20. Future Scalability

### 20.1 Monorepo Migration

When the frontend team grows beyond 10 engineers, the single repository can be migrated to a monorepo (Turborepo or Nx) with shared packages:

```
packages/
├── shared/               # Shared types, utilities, constants
├── ui/                   # Design system component library
├── api/                  # API client (generated from OpenAPI)
├── config/               # Shared configs (ESLint, TypeScript, Vite)
├── i18n/                 # Translation files and utilities
└── eslint-config/        # Shared ESLint rules

apps/
├── web/                  # Consumer web application
├── admin/                # Admin panel application
└── landing/              # Marketing website
```

### 20.2 Mobile Web / PWA

The architecture supports Progressive Web App (PWA) capabilities:

- Service worker for offline caching (implemented in Phase 2)
- Web app manifest for installability
- Push notifications via Web Push API
- Background sync for deferred actions

### 20.3 White-Label Support

The theming system supports white-label deployment:

- Design tokens overridable per deployment
- Logo, colors, typography configurable at build time
- Feature flags per white-label partner
- Custom domain and branding per deployment

### 20.4 Multi-Product Expansion

The feature-based architecture supports new products:

- **Consumer Banking** (current): The existing feature modules
- **Business Banking** (Phase 3): New `features/business/` module with invoicing, expense management, team accounts
- **Investment** (Phase 4): New `features/investments/` module with portfolio, trading, research
- **Lending** (Phase 4): New `features/lending/` module with loan applications, repayment tracking

### 20.5 Migration to Micro-Frontends (Future)

If the application grows beyond what a single SPA can handle efficiently, the feature-based architecture enables micro-frontend extraction:

- Each feature module can be developed and deployed independently
- Shared components become a published package
- Module Federation (Webpack 5+) or Import Maps for runtime composition
- Each micro-frontend owns its routing, state, and deployment

**When to consider micro-frontends:**
- Team size exceeds 20+ frontend engineers
- Deployment coordination becomes a bottleneck
- Feature modules have different release cadences
- Different modules require different technology choices

### 20.6 Component Library Extraction

The `shared/components/ui/` directory is designed for eventual extraction into a standalone design system package:

- All components are self-contained (no feature-specific dependencies)
- All components use design tokens (not hardcoded values)
- All components are fully typed and documented
- Storybook serves as the component library documentation

---

## Appendix A: Technology Stack Summary

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 19+ | Ecosystem maturity, hiring pool, performance improvements |
| **Language** | TypeScript (strict) | Type safety, DX, error prevention |
| **Build** | Vite | Fast HMR, optimized builds, native ES modules |
| **Styling** | Tailwind CSS + CVA | Utility-first, design tokens, variant composition |
| **Routing** | React Router v7 | Type-safe, data APIs, lazy loading |
| **Server State** | TanStack Query | Cache management, background refetching, optimistic updates |
| **Forms** | React Hook Form + Zod | Performance, type-safe validation, minimal re-renders |
| **Testing** | Vitest + RTL + Playwright | Fast unit tests, accessible component tests, cross-browser E2E |
| **Linting** | ESLint (flat config) | Code quality, consistency, accessibility rules |
| **Formatting** | Prettier | Consistent formatting |
| **Accessibility** | axe-core | Automated WCAG testing |
| **Error Tracking** | Sentry | Real-time error monitoring |
| **i18n** | react-i18next | Namespace-based translations, lazy loading |
| **Icons** | Lucide React | Tree-shakeable, consistent style |
| **Charts** | Recharts or Visx | React-native charting, accessible |
| **Storybook** | Storybook 8 | Component development, visual testing |

## Appendix B: Import Convention

All imports follow a consistent order:

```
1. React / third-party libraries
2. Shared modules (from @/shared/)
3. Feature modules (from @/features/)
4. Local modules (relative imports)
5. Types
6. Styles
```

Import aliases:
- `@/` → `src/`
- `@/features/` → `src/features/`
- `@/shared/` → `src/shared/`

## Appendix C: Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `AccountCard`, `TransferForm` |
| Hooks | camelCase, `use` prefix | `useAccounts`, `useCreateTransfer` |
| Utilities | camelCase | `formatCurrency`, `sanitizeInput` |
| Types/Interfaces | PascalCase | `Account`, `TransferStatus` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_TRANSFER_AMOUNT`, `API_TIMEOUT` |
| Files (components) | PascalCase | `AccountCard.tsx` |
| Files (hooks/utils) | camelCase | `useAccounts.ts` |
| Files (types) | camelCase | `account.types.ts` |
| Test files | `.test.ts` / `.test.tsx` | `AccountCard.test.tsx` |
| CSS classes | kebab-case (Tailwind) | `bg-primary-500`, `text-sm` |

---

*This document is a living artifact. Frontend architecture decisions must be reviewed by the Frontend Architecture Lead. All changes to shared components require design system review. Performance budgets are enforced as build gates.*
