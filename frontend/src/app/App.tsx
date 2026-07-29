import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import {
  AuthProvider,
  GuestRoute,
  ProtectedRoute,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  EmailVerificationPage,
  OtpVerificationPage,
} from "@/features/auth";
import { AccountsPage, AccountDetailPage } from "@/features/accounts";
import { TransactionsPage, TransactionDetailPage } from "@/features/transactions";
import { BeneficiariesPage } from "@/features/beneficiaries";
import { TransfersPage } from "@/features/transfers";
import { CardsPage } from "@/features/cards";
import { SavingsPage } from "@/features/savings";
import { NotificationsPage } from "@/features/notifications";
import { SettingsPage } from "@/features/settings";
import { ProfilePage } from "@/features/profile";
import { AdminDashboardPage, AdminAuditLogsPage, AdminUsersPage } from "@/features/admin";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";

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
          path={ROUTES.VERIFY_EMAIL}
          element={
            <AuthLayout>
              <EmailVerificationPage />
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
        <Route
          path={ROUTES.HOME}
          element={
            <DashboardLayout>
              <HomePage />
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
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthRoutes />
        <ProtectedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}