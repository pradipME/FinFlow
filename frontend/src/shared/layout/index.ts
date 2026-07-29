/**
 * Layout System — Barrel Export
 *
 * Import from '@/shared/layout' to access layout components, hooks, types, and constants.
 */

// ── Types ────────────────────────────────────────────────────────
export type {
  Breakpoint,
  BreakpointPrefix,
  SidebarMode,
  SidebarPosition,
  SidebarConfig,
  NavItem,
  NavGroup,
  BreadcrumbItem,
  SearchResult,
  CommandItem,
  HeaderConfig,
  ContentWidth,
  ContainerConfig,
  LayoutVariant,
  LayoutConfig,
} from "./types";

// ── Constants ────────────────────────────────────────────────────
export {
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_HEADER_HEIGHT,
  SIDEBAR_FOOTER_HEIGHT,
  HEADER_HEIGHT,
  BREAKPOINTS,
  BREAKPOINT_QUERIES,
  SIDEBAR_COLLAPSE_BELOW,
  SIDEBAR_HIDE_BELOW,
  LAYOUT_STORAGE_KEYS,
  CONTENT_WIDTHS,
  Z_INDEX,
  SHORTCUTS,
} from "./constants";

// ── Utils ────────────────────────────────────────────────────────
export {
  getBreakpoint,
  shouldAutoCollapse,
  shouldHideSidebar,
  getContentOffset,
  getContentMaxWidth,
  getContentWidthClasses,
  getSidebarTransition,
} from "./utils";

// ── Hooks ────────────────────────────────────────────────────────
export { useBreakpoint, useSidebar } from "./hooks";
export type { BreakpointInfo, UseSidebarReturn } from "./hooks";

// ── Sidebar ──────────────────────────────────────────────────────
export {
  Sidebar,
  SidebarItem,
  SidebarGroup,
  SidebarFooter,
  SidebarToggle,
} from "./components/Sidebar";

// ── Header ───────────────────────────────────────────────────────
export {
  Header,
  SearchBar,
  NotificationButton,
  ThemeSwitcher,
  UserMenu,
} from "./components/Header";

// ── Content ──────────────────────────────────────────────────────
export { Content, Container, Section, PageHeader } from "./components/Content";

// ── Navigation ───────────────────────────────────────────────────
export { Breadcrumbs, MobileNavigation, CommandPalette } from "./components/Navigation";
