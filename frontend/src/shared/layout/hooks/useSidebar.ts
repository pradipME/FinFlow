/**
 * Layout Hook — useSidebar
 *
 * Manages sidebar state with localStorage persistence.
 * Auto-collapses on resize below breakpoint.
 * Exposes the SidebarConfig interface.
 *
 * Usage:
 *   const sidebar = useSidebar();
 *   <aside style={{ width: sidebar.mode === "expanded" ? 240 : 64 }}>
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SidebarMode } from "../types";
import { useBreakpoint } from "./useBreakpoint";
import { LAYOUT_STORAGE_KEYS, SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "../constants";

// ── Helpers ──────────────────────────────────────────────────────

function readPersistedMode(): SidebarMode {
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEYS.SIDEBAR_MODE);
    if (raw === "expanded" || raw === "collapsed") return raw;
  } catch {
    // localStorage unavailable
  }
  return "expanded";
}

// ── Hook ─────────────────────────────────────────────────────────

export interface UseSidebarReturn {
  /** Current sidebar mode */
  mode: SidebarMode;
  /** Whether the mobile overlay is open */
  isOpen: boolean;
  /** Computed pixel width of the sidebar */
  width: number;
  /** Toggle between expanded ↔ collapsed */
  toggle: () => void;
  /** Set a specific mode */
  setMode: (mode: SidebarMode) => void;
  /** Open mobile overlay */
  open: () => void;
  /** Close mobile overlay */
  close: () => void;
  /** Whether sidebar is in collapsed state */
  isCollapsed: boolean;
}

export function useSidebar(): UseSidebarReturn {
  const { shouldAutoCollapseSidebar, shouldHideSidebar } = useBreakpoint();

  // User preference (expanded/collapsed). Held in state so toggling re-renders.
  const [preferredMode, setPreferredMode] = useState<SidebarMode>(readPersistedMode());
  const [isOpen, setIsOpen] = useState(false);

  // Derive the effective mode: breakpoint constraints override user preference.
  const mode: SidebarMode = useMemo(() => {
    if (shouldHideSidebar) return "offscreen";
    if (shouldAutoCollapseSidebar) return "collapsed";
    return preferredMode;
  }, [shouldHideSidebar, shouldAutoCollapseSidebar, preferredMode]);

  // Persist user preference.
  useEffect(() => {
    if (preferredMode === "expanded" || preferredMode === "collapsed") {
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEYS.SIDEBAR_MODE, preferredMode);
      } catch {
        // silent
      }
    }
  }, [preferredMode]);

  // ── Actions ─────────────────────────────────────────────────
  const toggle = useCallback(() => {
    setPreferredMode((current) => (current === "expanded" ? "collapsed" : "expanded"));
  }, []);

  const setMode = useCallback((next: SidebarMode) => {
    setPreferredMode(next);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // ── Derived ─────────────────────────────────────────────────
  const width = useMemo(() => {
    if (mode === "offscreen" || (mode === "overlay" && !isOpen)) return 0;
    return mode === "expanded" ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;
  }, [mode, isOpen]);

  return useMemo(
    () => ({
      mode,
      isOpen,
      width,
      toggle,
      setMode,
      open,
      close,
      isCollapsed: mode === "collapsed",
    }),
    [mode, isOpen, width, toggle, setMode, open, close],
  );
}
