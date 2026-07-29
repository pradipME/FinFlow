import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { useAuth } from "../hooks";
import { Spinner } from "@/shared/components";

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    const returnTo =
      (location.state as { returnTo?: string } | null)?.returnTo ??
      ROUTES.DASHBOARD;
    return <Navigate to={returnTo} replace />;
  }

  return <Outlet />;
}