/**
 * Spinner — Constants
 *
 * Dimension maps, class maps, and animation config.
 * All values use Tailwind theme tokens — zero hardcoded colors.
 */
import type { SpinnerSize, SpinnerMode } from "./types";

// ── Base Classes ─────────────────────────────────────────────────

export const BASE_CLASSES = "inline-flex flex-col items-center justify-center gap-2";

// ── Mode Classes ─────────────────────────────────────────────────

export const MODE_CLASSES: Record<SpinnerMode, string> = {
  inline: "inline-flex",
  overlay:
    "absolute inset-0 z-10 flex items-center justify-center " + "bg-bg-primary/60 backdrop-blur-sm",
  fullscreen:
    "fixed inset-0 z-50 flex items-center justify-center " + "bg-bg-primary/60 backdrop-blur-sm",
};

// ── Size Classes (for the outer container) ───────────────────────

export const SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: "gap-1",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
  xl: "gap-3",
};

// ── Pixel Dimensions ─────────────────────────────────────────────

/** Diameter of the spinner graphic for each size */
export const SPINNER_DIMENSION: Record<SpinnerSize, number> = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 44,
};

/** SVG stroke width for the ring variant */
export const RING_STROKE_WIDTH: Record<SpinnerSize, number> = {
  xs: 2,
  sm: 2.5,
  md: 3,
  lg: 3.5,
  xl: 4,
};

/** Dot diameter for the dots variant */
export const DOT_DIMENSION: Record<SpinnerSize, number> = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
};

/** Bar width and height for the bars variant */
export const BAR_DIMENSIONS: Record<SpinnerSize, { width: number; height: number }> = {
  xs: { width: 2, height: 8 },
  sm: { width: 2.5, height: 10 },
  md: { width: 3, height: 14 },
  lg: { width: 4, height: 18 },
  xl: { width: 5, height: 24 },
};

/** Label text size class for each spinner size */
export const LABEL_SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};
