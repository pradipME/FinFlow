/**
 * Layout System — Constants
 *
 * Sidebar widths, breakpoint thresholds, storage keys, CSS classes.
 * All values sourced from DESIGN_SYSTEM.md §8.5.
 */

// ── Sidebar Dimensions ───────────────────────────────────────────

/** Width when sidebar is fully expanded (px) — §8.5: 240px */
export const SIDEBAR_EXPANDED_WIDTH = 240 as const;

/** Width when sidebar is collapsed (px) — §8.5: 64px */
export const SIDEBAR_COLLAPSED_WIDTH = 64 as const;

/** Height of the sidebar header (px) — matches header height */
export const SIDEBAR_HEADER_HEIGHT = 56 as const;

/** Height of the sidebar footer (px) */
export const SIDEBAR_FOOTER_HEIGHT = 56 as const;

// ── Header Dimensions ────────────────────────────────────────────

/** Height of the top header bar (px) */
export const HEADER_HEIGHT = 56 as const;

// ── Breakpoint Thresholds (px) ──────────────────────────────────

/**
 * Breakpoint thresholds — matches DESIGN_SYSTEM.md §8.1.
 * Values are the MINIMUM width for each breakpoint.
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  ultra: 1536,
} as const;

/** Media query strings for each breakpoint */
export const BREAKPOINT_QUERIES = {
  mobile: "(min-width: 0px)",
  tablet: "(min-width: 768px)",
  laptop: "(min-width: 1024px)",
  desktop: "(min-width: 1280px)",
  ultra: "(min-width: 1536px)",
} as const;

// ── Collapse Behavior ────────────────────────────────────────────

/**
 * Sidebar auto-collapses below this breakpoint (px).
 * §8.5: "Collapsible on screens < 1280px"
 */
export const SIDEBAR_COLLAPSE_BELOW = 1280 as const;

/**
 * Sidebar is hidden completely below this breakpoint.
 * Mobile overlay mode takes over.
 */
export const SIDEBAR_HIDE_BELOW = 768 as const;

// ── Storage Keys ─────────────────────────────────────────────────

export const LAYOUT_STORAGE_KEYS = {
  SIDEBAR_MODE: "finflow-sidebar-mode",
  SIDEBAR_STATE: "finflow-sidebar-state",
} as const;

// ── Content Widths (max-width in px) ────────────────────────────

export const CONTENT_WIDTHS = {
  full: "100%",
  contained: "1440px",
  analytics: "1280px",
  form: "640px",
  wizard: "800px",
} as const;

// ── Z-Index Layers ───────────────────────────────────────────────

export const Z_INDEX = {
  sidebar: 30,
  header: 20,
  overlay: 40,
  commandPalette: 50,
  mobileNav: 30,
} as const;

// ── Keyboard Shortcuts ───────────────────────────────────────────

export const SHORTCUTS = {
  COMMAND_PALETTE: { key: "k", ctrl: true },
  SIDEBAR_TOGGLE: { key: "b", ctrl: true },
} as const;
