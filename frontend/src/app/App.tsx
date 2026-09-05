import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { AuthProvider } from "@/features/auth/context";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { GuestRoute } from "@/features/auth/components";
import { Spinner } from "@/shared/components";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AdminLayout } from "./layouts/AdminLayout";

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })),
);
const OtpVerificationPage = lazy(() =>
  import("@/features/auth/pages/OtpVerificationPage").then((m) => ({ default: m.OtpVerificationPage })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const PaymentsPage = lazy(() =>
  import("./pages/PaymentsPage").then((m) => ({ default: m.PaymentsPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);
const SecurityPage = lazy(() =>
  import("./pages/SecurityPage").then((m) => ({ default: m.SecurityPage })),
);
const AccountsPage = lazy(() =>
  import("@/features/accounts/pages/AccountsPage").then((m) => ({ default: m.AccountsPage })),
);
const AccountDetailPage = lazy(() =>
  import("@/features/accounts/pages/AccountDetailPage").then((m) => ({ default: m.AccountDetailPage })),
);
const TransactionsPage = lazy(() =>
  import("@/features/transactions/pages/TransactionsPage").then((m) => ({ default: m.TransactionsPage })),
);
const TransactionDetailPage = lazy(() =>
  import("@/features/transactions/pages/TransactionDetailPage").then((m) => ({ default: m.TransactionDetailPage })),
);
const BeneficiariesPage = lazy(() =>
  import("@/features/beneficiaries/pages/BeneficiariesPage").then((m) => ({ default: m.BeneficiariesPage })),
);
const TransfersPage = lazy(() =>
  import("@/features/transfers/pages/TransfersPage").then((m) => ({ default: m.TransfersPage })),
);
const CardsPage = lazy(() =>
  import("@/features/cards/pages/CardsPage").then((m) => ({ default: m.CardsPage })),
);
const SavingsPage = lazy(() =>
  import("@/features/savings/pages/SavingsPage").then((m) => ({ default: m.SavingsPage })),
);
const NotificationsPage = lazy(() =>
  import("@/features/notifications/pages/NotificationsPage").then((m) => ({ default: m.NotificationsPage })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const RequestsPage = lazy(() =>
  import("@/features/requests/pages/RequestsPage").then((m) => ({ default: m.RequestsPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminAuditLogsPage = lazy(() =>
  import("@/features/admin/pages/AdminAuditLogsPage").then((m) => ({ default: m.AdminAuditLogsPage })),
);
const AdminUsersPage = lazy(() =>
  import("@/features/admin/pages/AdminUsersPage").then((m) => ({ default: m.AdminUsersPage })),
);
const AdminCustomerDetailPage = lazy(() =>
  import("@/features/admin/pages/AdminCustomerDetailPage").then((m) => ({ default: m.AdminCustomerDetailPage })),
);
const AdminAccountsPage = lazy(() =>
  import("@/features/admin/pages/AdminAccountsPage").then((m) => ({ default: m.AdminAccountsPage })),
);
const AdminCardsPage = lazy(() =>
  import("@/features/admin/pages/AdminCardsPage").then((m) => ({ default: m.AdminCardsPage })),
);
const AdminTransactionsPage = lazy(() =>
  import("@/features/admin/pages/AdminTransactionsPage").then((m) => ({ default: m.AdminTransactionsPage })),
);
const AdminRequestsPage = lazy(() =>
  import("@/features/admin/pages/AdminRequestsPage").then((m) => ({ default: m.AdminRequestsPage })),
);
const AdminSecurityPage = lazy(() =>
  import("@/features/admin/pages/AdminSecurityPage").then((m) => ({ default: m.AdminSecurityPage })),
);
const AdminSettingsPage = lazy(() =>
  import("@/features/admin/pages/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
        <p className="text-sm text-text-tertiary">Loading FinFlow…</p>
      </div>
    </div>
  );
}

function isAdminRole(roles: string[] | undefined): boolean {
  if (!roles) return false;
  return roles.some((r) => r === "ADMIN" || r === "SUPER_ADMIN" || r === "ROLE_ADMIN" || r === "ROLE_SUPER_ADMIN");
}

function AdminRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-secondary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdminRole(user?.roles)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
        <Route path={`${ROUTES.ADMIN}/dashboard`} element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN_ACCOUNTS} element={<AdminAccountsPage />} />
        <Route path={`${ROUTES.ADMIN_ACCOUNTS}/:id`} element={<AdminAccountsPage />} />
        <Route path={ROUTES.ADMIN_CARDS} element={<AdminCardsPage />} />
        <Route path={`${ROUTES.ADMIN_CARDS}/:id`} element={<AdminCardsPage />} />
        <Route path={ROUTES.ADMIN_TRANSACTIONS} element={<AdminTransactionsPage />} />
        <Route path={`${ROUTES.ADMIN_TRANSACTIONS}/:id`} element={<AdminTransactionsPage />} />
        <Route path={ROUTES.ADMIN_REQUESTS} element={<AdminRequestsPage />} />
        <Route path={`${ROUTES.ADMIN_REQUESTS}/:id`} element={<AdminRequestsPage />} />
        <Route path={`${ROUTES.ADMIN}/audit-logs`} element={<AdminAuditLogsPage />} />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
        <Route path={`${ROUTES.ADMIN_USERS}/:id`} element={<AdminCustomerDetailPage />} />
        <Route path={`${ROUTES.ADMIN}/security`} element={<AdminSecurityPage />} />
        <Route path={`${ROUTES.ADMIN}/settings`} element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to={ROUTES.ADMIN} replace />} />
      </Routes>
    </AdminLayout>
  );
}

function CustomerRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isAdminRole(user?.roles)) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate replace to={ROUTES.DASHBOARD} />} />
        <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.SECURITY} element={<SecurityPage />} />
        <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
        <Route path={`${ROUTES.ACCOUNTS}/:id`} element={<AccountDetailPage />} />
        <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
        <Route path={`${ROUTES.TRANSACTIONS}/:id`} element={<TransactionDetailPage />} />
        <Route path={ROUTES.BENEFICIARIES} element={<BeneficiariesPage />} />
        <Route path={ROUTES.TRANSFERS} element={<TransfersPage />} />
        <Route path={ROUTES.CARDS} element={<CardsPage />} />
        <Route path={ROUTES.BUDGETS} element={<Navigate replace to={ROUTES.SAVINGS} />} />
        <Route path={ROUTES.SAVINGS} element={<SavingsPage />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.REQUESTS} element={<RequestsPage />} />
        <Route
          path="*"
          element={
            <DashboardLayout>
              <NotFoundPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </DashboardLayout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route
                path={ROUTES.LOGIN}
                element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                }
              />
              <Route
                path={ROUTES.REGISTER}
                element={
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                }
              />
              <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={
                  <AuthLayout>
                    <ForgotPasswordPage />
                  </AuthLayout>
                }
              />
              <Route
                path={ROUTES.RESET_PASSWORD}
                element={
                  <AuthLayout>
                    <ResetPasswordPage />
                  </AuthLayout>
                }
              />
              <Route
                path={ROUTES.VERIFY_OTP}
                element={
                  <AuthLayout>
                    <OtpVerificationPage />
                  </AuthLayout>
                }
              />
            </Route>

            <Route path="/*" element={<CustomerOrAdminRouter />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

function CustomerOrAdminRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isAdminRole(user?.roles)) {
    return <AdminRouter />;
  }

  return <CustomerRouter />;
}