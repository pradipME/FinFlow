import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { useAuth } from "../hooks";
import { Spinner } from "@/shared/components";

function isSafeReturnUrl(url: string): boolean {
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  if (url.includes("://")) return false;
  return true;
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-secondary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = location.pathname;
    const safeReturn = isSafeReturnUrl(returnTo) ? returnTo : ROUTES.HOME;
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ returnTo: safeReturn }}
        replace
      />
    );
  }

  return <Outlet />;
}