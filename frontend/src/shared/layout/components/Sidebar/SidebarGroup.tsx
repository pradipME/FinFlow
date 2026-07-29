/**
 * SidebarGroup — A labeled group of SidebarItems.
 *
 * Renders a section heading and optional collapse toggle.
 * When sidebar is collapsed, the group renders as a separator.
 */
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";
import type { NavGroup, SidebarMode } from "../../types";
import { SidebarItem } from "./SidebarItem";

interface SidebarGroupProps {
  /** Navigation group data */
  group: NavGroup;
  /** Whether sidebar is collapsed */
  isCollapsed: boolean;
  /** Sidebar mode */
  mode: SidebarMode;
}

export function SidebarGroup({ group, isCollapsed, mode }: SidebarGroupProps): ReactNode {
  const [isExpanded, setIsExpanded] = useState(group.defaultCollapsed !== true);

  // When collapsed, show a small separator dot
  if (isCollapsed) {
    return (
      <div className="my-2 flex justify-center">
        <div className="h-1 w-1 rounded-full bg-border-default" />
      </div>
    );
  }

  return (
    <div className="mb-2">
      {group.collapsible ? (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between px-3 py-1.5",
            "text-xs font-semibold uppercase tracking-wider",
            "text-text-tertiary",
            "hover:text-text-secondary",
            "transition-colors duration-150",
          )}
        >
          {group.label}
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", !isExpanded && "-rotate-90")}
          />
        </button>
      ) : (
        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {group.label}
        </div>
      )}
      {isExpanded && (
        <div className="mt-1 flex flex-col gap-0.5">
          {group.items.map((item) => (
            <SidebarItem
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              badgeVariant={item.badgeVariant}
              isCollapsed={isCollapsed}
              mode={mode}
              disabled={item.disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
