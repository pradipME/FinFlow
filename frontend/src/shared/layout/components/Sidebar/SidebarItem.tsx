/**
 * SidebarItem — A single navigation link in the sidebar.
 *
 * Handles active state, badge, tooltip (when collapsed), and sub-item indentation.
 * Uses NavLink for automatic active class detection.
 */
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";
import type { SidebarMode } from "../../types";

interface SidebarItemProps {
  /** Route path */
  href: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Badge (count or text) */
  badge?: string | number;
  /** Badge color variant */
  badgeVariant?: "default" | "success" | "warning" | "danger";
  /** Whether sidebar is collapsed */
  isCollapsed: boolean;
  /** Sidebar mode */
  mode: SidebarMode;
  /** Nesting depth (0 = top-level) */
  depth?: number;
  /** Whether this item is disabled */
  disabled?: boolean;
}

const badgeVariants = {
  default: "bg-bg-tertiary text-text-secondary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export function SidebarItem({
  href,
  label,
  icon: Icon,
  badge,
  badgeVariant = "default",
  isCollapsed,
  mode,
  depth = 0,
  disabled = false,
}: SidebarItemProps): ReactNode {
  const indent = depth > 0 ? depth * 16 : 0;
  const showTooltip = isCollapsed && mode === "collapsed";

  return (
    <NavLink
      to={href}
      title={showTooltip ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
          "transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
          isActive
            ? "bg-brand-primary-subtle text-brand-primary"
            : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
          disabled && "pointer-events-none opacity-50",
          isCollapsed && "justify-center px-2",
        )
      }
      style={depth > 0 ? { paddingLeft: `${12 + indent}px` } : undefined}
    >
      {Icon && (
        <Icon
          size={20}
          className={cn(
            "shrink-0 transition-colors duration-150",
            "text-text-tertiary group-hover:text-text-primary",
            "[[aria-current=page]>&]:text-brand-primary",
          )}
        />
      )}
      {!isCollapsed && (
        <>
          <span className="truncate">{label}</span>
          {badge !== undefined && (
            <span
              className={cn(
                "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                badgeVariants[badgeVariant],
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
