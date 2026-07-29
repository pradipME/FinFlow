/**
 * DashboardLayout — Thin wrapper around AppShell with dashboard-specific defaults.
 *
 * In the future, this will inject dashboard nav groups, role-based visibility,
 * and analytics-specific header actions. For now, it's AppShell with defaults.
 */
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";

interface DashboardLayoutProps {
  /** Dashboard page content */
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): ReactNode {
  return <AppShell>{children}</AppShell>;
}
