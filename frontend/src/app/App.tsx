import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { AuthProvider } from "@/features/auth/context";
import { GuestRoute, ProtectedRoute } from "@/features/auth/components";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";

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
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminAuditLogsPage = lazy(() =>
  import("@/features/admin/pages/AdminAuditLogsPage").then((m) => ({ default: m.AdminAuditLogsPage })),
);
const AdminUsersPage = lazy(() =>
  import("@/features/admin/pages/AdminUsersPage").then((m) => ({ default: m.AdminUsersPage })),
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

function AuthRoutes() {
  return (
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
    </Routes>
  );
}

function ProtectedRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<Navigate replace to={ROUTES.DASHBOARD} />} />
        <Route
          path={ROUTES.PAYMENTS}
          element={
            <DashboardLayout>
              <PaymentsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ANALYTICS}
          element={
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.SECURITY}
          element={
            <DashboardLayout>
              <SecurityPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ACCOUNTS}
          element={
            <DashboardLayout>
              <AccountsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={`${ROUTES.ACCOUNTS}/:id`}
          element={
            <DashboardLayout>
              <AccountDetailPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.TRANSACTIONS}
          element={
            <DashboardLayout>
              <TransactionsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={`${ROUTES.TRANSACTIONS}/:id`}
          element={
            <DashboardLayout>
              <TransactionDetailPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.BENEFICIARIES}
          element={
            <DashboardLayout>
              <BeneficiariesPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.TRANSFERS}
          element={
            <DashboardLayout>
              <TransfersPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.CARDS}
          element={
            <DashboardLayout>
              <CardsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.BUDGETS}
          element={<Navigate replace to={ROUTES.SAVINGS} />}
        />
        <Route
          path={ROUTES.SAVINGS}
          element={
            <DashboardLayout>
              <SavingsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <DashboardLayout>
              <NotificationsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN}
          element={
            <DashboardLayout>
              <AdminDashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path={`${ROUTES.ADMIN}/audit-logs`}
          element={
            <DashboardLayout>
              <AdminAuditLogsPage />
            </DashboardLayout>
          }
        />
        <Route
          path={`${ROUTES.ADMIN}/users`}
          element={
            <DashboardLayout>
              <AdminUsersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="*"
          element={
            <DashboardLayout>
              <NotFoundPage />
            </DashboardLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <AuthRoutes />
          <ProtectedRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}