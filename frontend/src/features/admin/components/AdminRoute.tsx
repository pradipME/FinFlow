import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { useAuth } from "@/features/auth/hooks";
import { Spinner } from "@/shared/components";

function isAdminRole(roles: string[] | undefined): boolean {
  if (!roles) return false;
  return roles.some((r) => r === "ADMIN" || r === "SUPER_ADMIN" || r === "ROLE_ADMIN" || r === "ROLE_SUPER_ADMIN");
}

/**
 * Role guard for admin-only surfaces.
 *
 * <p>This is a navigation-level convenience only. The backend remains the source
 * of truth — every admin endpoint is additionally role-gated server-side
 * (URL rules + imperative checks). Redirecting here simply keeps non-admin
 * users out of admin routes in the UI.</p>
 */
export function AdminRoute() {
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

  return <Outlet />;
}