/**
 * Layout System — Utilities
 *
 * Pure functions for breakpoint detection, container sizing, sidebar math.
 * Zero React dependency — safe in workers, tests, SSR.
 */
import type { Breakpoint, ContentWidth } from "./types";
import {
  BREAKPOINTS,
  CONTENT_WIDTHS,
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from "./constants";

/**
 * Determine the current breakpoint from a pixel width.
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.ultra) return "ultra";
  if (width >= BREAKPOINTS.desktop) return "desktop";
  if (width >= BREAKPOINTS.laptop) return "laptop";
  if (width >= BREAKPOINTS.tablet) return "tablet";
  return "mobile";
}

/**
 * Whether the sidebar should auto-collapse at the given width.
 * §8.5: Collapsible on screens < 1280px
 */
export function shouldAutoCollapse(width: number): boolean {
  return width < BREAKPOINTS.desktop;
}

/**
 * Whether the sidebar should be completely hidden (mobile overlay).
 */
export function shouldHideSidebar(width: number): boolean {
  return width < BREAKPOINTS.tablet;
}

/**
 * Calculate the content area width based on sidebar state.
 */
export function getContentOffset(
  sidebarMode: "expanded" | "collapsed" | "overlay" | "offscreen",
  viewportWidth: number,
): number {
  if (sidebarMode === "overlay" || sidebarMode === "offscreen") return 0;
  if (viewportWidth < BREAKPOINTS.tablet) return 0;
  return sidebarMode === "expanded" ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;
}

/**
 * Get the CSS max-width value for a content width preset.
 */
export function getContentMaxWidth(width: ContentWidth): string {
  return CONTENT_WIDTHS[width];
}

/**
 * Get Tailwind responsive classes for a content width preset.
 * Returns classes that apply max-width at appropriate breakpoints.
 */
export function getContentWidthClasses(width: ContentWidth): string {
  switch (width) {
    case "full":
      return "w-full";
    case "contained":
      return "mx-auto w-full max-w-[1440px]";
    case "analytics":
      return "mx-auto w-full max-w-[1280px]";
    case "form":
      return "mx-auto w-full max-w-[640px]";
    case "wizard":
      return "mx-auto w-full max-w-[800px]";
    default:
      return "mx-auto w-full max-w-[1440px]";
  }
}

/**
 * Get the sidebar transition CSS based on mode.
 * Returns Tailwind transition classes.
 */
export function getSidebarTransition(): string {
  return "transition-all duration-300 ease-out";
}
