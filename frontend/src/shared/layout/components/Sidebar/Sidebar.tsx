/**
 * Sidebar — Main sidebar container.
 *
 * Renders nav groups, handles overlay mode on mobile, and animates
 * width transitions. Composed by AppShell.
 */
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils";
import { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH, Z_INDEX } from "../../constants";
import type { NavGroup, SidebarMode } from "../../types";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarToggle } from "./SidebarToggle";

interface SidebarProps {
  /** Navigation groups */
  groups: NavGroup[];
  /** Current sidebar mode */
  mode: SidebarMode;
  /** Whether the mobile overlay is open */
  isOpen: boolean;
  /** Toggle expanded ↔ collapsed */
  onToggle: () => void;
  /** Close mobile overlay */
  onClose: () => void;
  /** Logo / brand element (rendered at top) */
  logo?: ReactNode;
  /** Footer content (rendered at bottom) */
  footer?: ReactNode;
}

export function Sidebar({
  groups,
  mode,
  isOpen,
  onToggle,
  onClose,
  logo,
  footer,
}: SidebarProps): ReactNode {
  const isCollapsed = mode === "collapsed";
  const isOverlay = mode === "overlay" || mode === "offscreen";

  return (
    <>
      {/* Backdrop for overlay mode */}
      {isOverlay && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          style={{ zIndex: Z_INDEX.overlay }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 flex h-screen flex-col",
          "border-r border-border-default",
          "bg-bg-primary",
          "transition-all duration-300 ease-out",
          isOverlay && !isOpen && "-translate-x-full",
          mode === "offscreen" && !isOpen && "-translate-x-full",
        )}
        style={{
          width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
          zIndex: Z_INDEX.sidebar,
        }}
        aria-label="Sidebar navigation"
      >
        {/* Header area: logo + toggle + close */}
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-border-default",
            isCollapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-3",
          )}
        >
          {logo && !isCollapsed && <div className="min-w-0 flex-1 truncate">{logo}</div>}
          {isOverlay && isOpen && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "flex items-center justify-center rounded-lg p-1.5",
                "text-text-tertiary",
                "hover:bg-bg-tertiary hover:text-text-primary",
                "transition-colors duration-150",
              )}
              title="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
          {!isOverlay && <SidebarToggle isCollapsed={isCollapsed} onToggle={onToggle} />}
        </div>

        {/* Scrollable nav area */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {groups.map((group) => (
            <SidebarGroup key={group.id} group={group} isCollapsed={isCollapsed} mode={mode} />
          ))}
        </nav>

        {/* Footer */}
        {footer && <SidebarFooter isCollapsed={isCollapsed}>{footer}</SidebarFooter>}
      </aside>
    </>
  );
}
