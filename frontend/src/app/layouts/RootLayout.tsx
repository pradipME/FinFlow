import { Outlet } from "react-router-dom";

/**
 * RootLayout — Minimal shell that just renders the matched route.
 *
 * Layout composition is handled by specific layouts (AppShell, AuthLayout, etc.)
 * placed on child routes. This keeps the root clean and avoids nesting issues.
 */
export function RootLayout() {
  return <Outlet />;
}
