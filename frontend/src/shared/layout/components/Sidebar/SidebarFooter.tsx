/**
 * SidebarFooter — Bottom section of the sidebar.
 *
 * Typically holds: user avatar, collapse toggle, and/or branding.
 * Accepts arbitrary children for flexibility.
 */
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

interface SidebarFooterProps {
  /** Footer content (e.g., user info, collapse button) */
  children: ReactNode;
  /** Whether sidebar is collapsed */
  isCollapsed?: boolean;
  /** Additional class names */
  className?: string;
}

export function SidebarFooter({
  children,
  isCollapsed = false,
  className,
}: SidebarFooterProps): ReactNode {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-t border-border-default",
        isCollapsed ? "justify-center px-2 py-3" : "px-3 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
