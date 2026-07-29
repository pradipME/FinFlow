/**
 * EmptyLayout — No chrome, no sidebar, no header.
 *
 * Full-bleed content for error pages, onboarding flows, or custom layouts.
 */
import type { ReactNode } from "react";

interface EmptyLayoutProps {
  /** Page content */
  children: ReactNode;
}

export function EmptyLayout({ children }: EmptyLayoutProps): ReactNode {
  return <div className="min-h-screen">{children}</div>;
}
