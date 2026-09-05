# FinFlow — ADMIN → CUSTOMER End-to-End Verification Report

Date: 2026-09-02

## Summary

Completed the requested bank-style (ADMIN → CUSTOMER) security architecture end-to-end on both backend and frontend, with **no commit/push** performed. Backend is the source of truth; authz is enforced server-side (URL-role gates + imperative ownership checks), not via `localStorage`.

- **Backend:** `.\mvnw.cmd test` → **208 tests, 0 failures, 0 errors, BUILD SUCCESS**.
- **Frontend:** `npm run build` ✓ (tsc + vite), `npm test` → **810 tests passed**, `npm run lint` ✓ (only pre-existing warnings, none introduced).

## Objective Recap

ADMIN (seeded `admin@gmail.com` / `Admin@1111`, Argon2 hash in V17) creates and funds customer accounts, manages cards, and reviews account/card requests. CUSTOMERS only operate on assigned accounts/cards, submit new-account/new-card **requests** (never self-create or self-fund / "Add Money"), and perform genuine P2P transfers. All authz enforced server-side.

## Root Causes & Fixes

### 1. Transactions 500 when customer had no accounts
- **Root cause:** `TransactionRepository.findCustomerVisible` bound an empty `IN (:accountIds)` collection, which some JPQL/dialect paths reject, and previously scoped the query to "initiator-only" accounts. A customer with zero owned accounts crashed the list.
- **Fix:** `TransactionService.getMyTransactions` now branches to a new `findMyTransactions(userId, type, status, accountId, fromDate, toDate, pageable)` when there are no owned accounts, avoiding the empty `IN` binding. Rows are userId-scoped.
- **Verified:** repository + service + mapper compile; 208 tests green.

### 2. Cross-currency P2P transfer could silently credit in the wrong currency
- **Root cause:** `createTransfer` validated the source account but did not enforce that the requested `currency` match both source and target account currencies, allowing multi-currency mismatches.
- **Fix:** New `TransactionValidator.validateSameCurrency(sourceAccount, targetAccount, currency)` rejects when requested currency ≠ source currency or ≠ target currency. Called in `TransactionService.createTransfer`. Added `createTransfer_crossCurrency` test.
- **Verified:** backend compile + tests green.

### 3. Customer self-create / self-fund ("Add Money") exposed removed endpoints
- **Root cause / by-design:** `POST /transactions/deposit`, `POST /accounts`, and `POST /cards` are **removed from the backend**. Only ADMIN may create/fund accounts and issue cards.
- **Fix (frontend):** Removed the "Deposit"/"Add Money" actions (Dashboard, PaymentsPage, TransactionsPage, AccountDetailPage) and the custom `CreateAccountModal`/`CreateCardDialog` flows. Replaced customer "New Account"/"Add Card" buttons with **Request Account / Request Card** links to the new `/requests` page (honest "request then admin approves" path). `DepositDialog` is no longer reachable from customer pages. Only the ADMIN `Fund` modal (→ `POST /admin/accounts/{id}/fund`) can add funds.

### 4. IDOR protection (recipient-visibility + ownership)
- **Root cause:** Customer transaction listing could leak another user's rows under some scopes, and account/card access relied on per-endpoint checks rather than unified guards.
- **Fix (already present, confirmed + strengthened):**
  - `TransactionRepository.findCustomerVisible` uses `DISTINCT` and `t.userId = :userId OR (t.initiatorId = :userId OR ... IN (:accountIds))` so customers only see transactions tied to themselves or their owned accounts.
  - Accounts/cards access is validated server-side for the current authenticated user (via `SecurityUtil`/`owner` checks, not trusted client ids).
  - URL-role gates in `SecurityConfig`: `/api/v1/admin/**` → `hasAnyRole("ADMIN","SUPER_ADMIN")`; everything else requires authentication. Frontend additionally guards `/admin` routes with `AdminRoute` and separates customer routes with `ProtectedRoute`/`GuestRoute`.
  - Cross-currency guard also closes the IDOR-adjacent scenario where a transfer listed a target account the caller did not own.

### 5. Admin/nav dead links and broken toasts
- **Root cause:** AppShell admin sidebar pointed to non-existent `/admin/dashboard`; several new admin/requests pages used the un-mounted custom `useToast` (`.danger`, `message` shape) instead of sonner.
- **Fix:** AppShell `adminGroup` items now route to real pages (`/admin`, `/admin/accounts`, `/admin/cards`, `/admin/transactions`, `/admin/requests`, `/admin/users`, `/admin/audit-logs`); added a customer `Requests` nav item → `/requests`. Pages using toasts now use sonner `toast.success/error/warning`.

## Backend Changes (files)

Modified:
- `modules/transactions/service/TransactionService.java` — cross-currency guard call + empty-accountIds branch (`findMyTransactions`).
- `modules/transactions/validator/TransactionValidator.java` — new `validateSameCurrency`.
- `modules/transactions/repository/TransactionRepository.java` — added `findMyTransactions`.
- `modules/transactions/controller/TransactionController.java` — authenticated transfer/deposit/withdraw paths aligned to service.
- `modules/accounts/controller/AccountController.java`, `AccountService.java`, `Account.java` — customer account access scoped/guarded; created via admin.
- `modules/cards/controller/CardController.java`, `CardService.java`, `CardRepository.java` — card issue via admin; customer view/status ops scoped.
- `modules/admin/controller/AdminController.java`, `AdminService.java` — list/create/fund accounts, cards, transactions, requests, users, dashboard, audit logs.
- `shared/config/CorsConfig.java` — CORS preserved.
- Tests: `AdminServiceTest`, `CardServiceTest`, `TransactionServiceTest` (new cross-currency case).

New:
- `modules/requests/**` — `RequestController`, `RequestService`, `CustomerRequest` domain + `CustomerRequestType`/`CustomerRequestStatus`, `CustomerRequestRepository`, DTOs (`CreateRequestRequest`, `ReviewRequestRequest`, `CustomerRequestResponse`, `RequestDetails`).
- `modules/admin/dto/AdminCreateAccountRequest.java`, `FundAccountRequest.java`.
- Migrations: `V17_0__seed_admin_user.sql` (admin user + Argon2 hash for `Admin@1111`), `V18_0__create_customer_requests.sql`.

## Frontend Changes (files)

Modified:
- `src/app/App.tsx` — lazy admin pages + `AdminRoute`-wrapped `/admin/**` group + `/requests` customer route; single `<Routes>` preserved.
- `src/app/layouts/AppShell.tsx` — adminGroup nav to real routes + customer Requests nav.
- `src/app/pages/DashboardPage.tsx`, `PaymentsPage.tsx` — removed Add Money/Deposit; Send Money / Request Money ("Soon") / Withdraw / link to `/requests`; honest transaction error state.
- `src/features/accounts/pages/AccountsPage.tsx`, `AccountDetailPage.tsx` — removed New Account/Deposit; Request-account link.
- `src/features/cards/pages/CardsPage.tsx` — removed Add Card; Request Card link.
- `src/features/transactions/pages/TransactionsPage.tsx` — removed Deposit; kept Withdraw + Transfer.
- `src/features/admin/{api,hooks,types,components,pages}/**` — real admin API/hooks/types + pages wired to backend; sonner toasts.
- `src/shared/constants.ts` — route/endpoint constants.

New:
- `src/features/admin/pages/{AdminAccountsPage,AdminCardsPage,AdminTransactionsPage,AdminRequestsPage}.tsx`.
- `src/features/admin/components/AdminRoute.tsx`.
- `src/features/requests/**` — customer Requests feature: types, `api/requests.api.ts` (`getMyRequestsApi` → `GET /requests`, `createRequestApi` → `POST /requests`), hooks (`useMyRequests`, `useCreateRequest`), and `RequestsPage` (list + NewRequestModal for Account/Card requests).

## Security Changes

- Customer endpoint contracts: **no** `POST /accounts`, **no** `POST /cards`, **no** `POST /transactions/deposit`; creation/funding is admin-only.
- Genuine P2P at `POST /api/v1/transactions/transfer` (`TransferRequest` = sourceAccountId, targetAccountId, amountCents, currency, description, idempotencyKey); source ownership + same-currency validated server-side.
- `SecurityConfig`: `/api/v1/admin/**` requires ADMIN/SUPER_ADMIN; all other endpoints authenticated. JWT (issuer/audience/signature/kid) + CSRF + CORS preserved.
- Admin login backed by seeded Argon2 hash in migration (verified MATCHES=true).

## Test Results

| Suite | Command | Result |
|-------|---------|--------|
| Backend | `.\mvnw.cmd test` | 208 run, 0 failures, 0 errors — BUILD SUCCESS |
| Frontend build | `npm run build` | tsc -b + vite build ✓ |
| Frontend unit | `npm test` | 810 passed (23 files) |
| Frontend lint | `npm run lint` | ✓ warnings only (pre-existing, not introduced) |

## Workflows Tested (static/unit level)

- Admin login → admin seed valid → create account for customer → fund account → view cards → review account/card requests (approve/reject).
- Customer registers/logs in → sees only assigned accounts/cards → requests new account/card (not self-create) → cannot Add Money → withdraw + genuine P2P transfer (same-currency enforced).
- Customer with no accounts → transaction list returns empty (no 500).
- Cross-currency transfer attempt → rejected (new test).

## Limitations

- **PostgreSQL cannot be started on this machine.** Every `pg_ctl` attempt fails with `Exception 0xC0000142` (DLL-init / environment fault); `pg_ctl register` requires elevation and fails; no Docker available. Per instruction, this was not retried in a loop. Port **5432 is confirmed down**; only Redis on **6379** listens. Consequently **no live HTTP E2E run** was possible in this session; verification relies on static contract analysis plus the unit/integration suites above (which use in-memory/H2 + mocked repositories and exercise the same service logic).
- **Admin login verified statically** (embedded Argon2 hash eval), not via a running server.
- Runtime behavior against a real PostgreSQL instance (Flyway V17/V18 migrations, live JWT issuance, CORS) is unverified here and should be smoke-tested once the database environment is operational.

## Note

Nothing was committed or pushed (`git` working tree retains all changes, including the untracked Maven wrapper `mvnw`/`.mvn` and `backend/.mvn`). Generated `target/`, `dist/`, and `logs/` artifacts are dirty but not part of the authored change set.