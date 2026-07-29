/**
 * Layout Hook — useBreakpoint
 *
 * Subscribes to viewport width changes via useSyncExternalStore.
 * Returns the current Breakpoint plus convenience booleans.
 *
 * Usage:
 *   const { breakpoint, isMobile, isTablet, isDesktop, width } = useBreakpoint();
 */
import { useSyncExternalStore } from "react";
import { getBreakpoint, shouldAutoCollapse, shouldHideSidebar } from "../utils";
import type { Breakpoint } from "../types";

function getSnapshot(): number {
  return window.innerWidth;
}

function subscribe(callback: () => void): () => void {
  // Use a resize observer for performance (avoids layout thrashing from matchMedia)
  let rafId = 0;
  const handler = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(callback);
  };
  window.addEventListener("resize", handler, { passive: true });
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handler);
  };
}

export interface BreakpointInfo {
  /** Current viewport width in pixels */
  width: number;
  /** Named breakpoint */
  breakpoint: Breakpoint;
  /** width < 768px */
  isMobile: boolean;
  /** width >= 768px && width < 1024px */
  isTablet: boolean;
  /** width >= 1024px && width < 1280px */
  isLaptop: boolean;
  /** width >= 1280px */
  isDesktop: boolean;
  /** width >= 1536px */
  isUltra: boolean;
  /** Whether sidebar should auto-collapse (< 1280px) */
  shouldAutoCollapseSidebar: boolean;
  /** Whether sidebar should be hidden completely (< 768px) */
  shouldHideSidebar: boolean;
}

export function useBreakpoint(): BreakpointInfo {
  const width = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const breakpoint = getBreakpoint(width);

  return {
    width,
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isLaptop: breakpoint === "laptop",
    isDesktop: breakpoint === "desktop" || breakpoint === "ultra",
    isUltra: breakpoint === "ultra",
    shouldAutoCollapseSidebar: shouldAutoCollapse(width),
    shouldHideSidebar: shouldHideSidebar(width),
  };
}
