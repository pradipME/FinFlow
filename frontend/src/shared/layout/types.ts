/**
 * Layout System — Type Definitions
 *
 * Central type vocabulary for sidebar, header, content, navigation,
 * and all layout compositions.
 */
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ── Breakpoints ──────────────────────────────────────────────────

/** Named breakpoints — matches DESIGN_SYSTEM.md §8.1 */
export type Breakpoint = "mobile" | "tablet" | "laptop" | "desktop" | "ultra";

/** Tailwind-style breakpoint prefixes */
export type BreakpointPrefix = "sm" | "md" | "lg" | "xl" | "2xl";

// ── Sidebar ──────────────────────────────────────────────────────

/** Sidebar display mode */
export type SidebarMode = "expanded" | "collapsed" | "overlay" | "offscreen";

/** Sidebar position */
export type SidebarPosition = "left" | "right";

/** Sidebar configuration */
export interface SidebarConfig {
  /** Current display mode */
  mode: SidebarMode;
  /** Sidebar position */
  position: SidebarPosition;
  /** Whether the sidebar is currently open (mobile overlay) */
  isOpen: boolean;
  /** Toggle sidebar mode */
  toggle: () => void;
  /** Set specific mode */
  setMode: (mode: SidebarMode) => void;
  /** Open sidebar (mobile overlay) */
  open: () => void;
  /** Close sidebar (mobile overlay) */
  close: () => void;
}

// ── Navigation Items ─────────────────────────────────────────────

/** A single navigation item in the sidebar */
export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Route path */
  href: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Badge (e.g., notification count) */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: "default" | "success" | "warning" | "danger";
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Child items (nested navigation) */
  children?: NavItem[];
}

/** A group of related nav items */
export interface NavGroup {
  /** Group label (section heading) */
  label: string;
  /** Unique identifier */
  id: string;
  /** Items in this group */
  items: NavItem[];
  /** Whether the group is collapsible */
  collapsible?: boolean;
  /** Whether the group starts collapsed */
  defaultCollapsed?: boolean;
}

// ── Breadcrumbs ──────────────────────────────────────────────────

/** A single breadcrumb item */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Route path (null for current page) */
  href?: string;
  /** Optional icon */
  icon?: LucideIcon;
}

// ── Search ───────────────────────────────────────────────────────

/** A search result item */
export interface SearchResult {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Description or secondary text */
  description?: string;
  /** Route path */
  href: string;
  /** Icon */
  icon?: LucideIcon;
  /** Category for grouping results */
  category?: string;
}

/** Command palette item */
export interface CommandItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Keyboard shortcut display */
  shortcut?: string;
  /** Icon */
  icon?: LucideIcon;
  /** Action to execute */
  action: () => void;
  /** Category for grouping */
  category?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

// ── Header ───────────────────────────────────────────────────────

/** Header configuration */
export interface HeaderConfig {
  /** Whether to show the sidebar toggle button */
  showSidebarToggle: boolean;
  /** Whether to show the search bar */
  showSearch: boolean;
  /** Whether to show notifications */
  showNotifications: boolean;
  /** Whether to show the user menu */
  showUserMenu: boolean;
  /** Custom content to render in the header */
  actions?: ReactNode;
}

// ── Content ──────────────────────────────────────────────────────

/** Content width preset */
export type ContentWidth = "full" | "contained" | "analytics" | "form" | "wizard";

/** Container configuration */
export interface ContainerConfig {
  /** Width preset */
  width: ContentWidth;
  /** Whether to center the container */
  centered: boolean;
  /** Custom max-width override (px) */
  maxWidth?: number;
}

// ── Layout Composition ───────────────────────────────────────────

/** Top-level layout variant */
export type LayoutVariant = "app" | "auth" | "empty" | "dashboard";

/** Full layout configuration */
export interface LayoutConfig {
  /** Layout variant */
  variant: LayoutVariant;
  /** Whether the sidebar is enabled */
  hasSidebar: boolean;
  /** Whether the header is enabled */
  hasHeader: boolean;
  /** Sidebar configuration */
  sidebar?: SidebarConfig;
  /** Header configuration */
  header?: HeaderConfig;
  /** Content width */
  contentWidth?: ContentWidth;
}
