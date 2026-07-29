/**
 * MobileNavigation — Bottom tab bar for mobile.
 *
 * §8.5: 4–5 icons max, 48px target height.
 * Visible only on screens < tablet breakpoint.
 */
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

interface MobileTabItem {
  /** Route path */
  href: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: LucideIcon;
}

interface MobileNavigationProps {
  /** Tab items (4–5 max) */
  items: MobileTabItem[];
}

export function MobileNavigation({ items }: MobileNavigationProps): ReactNode {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0",
        "flex items-stretch border-t border-border-default",
        "bg-bg-primary/95 backdrop-blur-md",
        "sm:hidden",
      )}
      style={{ height: 48, zIndex: 30 }}
      aria-label="Mobile navigation"
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5",
              "text-[10px] font-medium transition-colors duration-150",
              isActive ? "text-brand-primary" : "text-text-tertiary",
            )
          }
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
