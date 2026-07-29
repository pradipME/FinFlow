/**
 * SidebarToggle — Button that expands ↔ collapses the sidebar.
 *
 * Renders inside the sidebar header area. Shows left/right arrow
 * based on current state. Hidden when sidebar is offscreen.
 */
import type { ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/shared/utils";

interface SidebarToggleProps {
  /** Whether sidebar is currently collapsed */
  isCollapsed: boolean;
  /** Toggle callback */
  onToggle: () => void;
}

export function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center justify-center rounded-lg p-1.5",
        "text-text-tertiary",
        "hover:bg-bg-tertiary hover:text-text-primary",
        "transition-colors duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
      )}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
    </button>
  );
}
