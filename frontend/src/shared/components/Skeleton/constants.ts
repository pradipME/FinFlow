/**
 * Skeleton — Constants
 *
 * Dimension presets, class maps, and shimmer gradient tokens.
 * All colors use Tailwind theme tokens — zero hardcoded values.
 */
import type { SkeletonVariant, SkeletonAnimation } from "./types";

// ── Base Classes ─────────────────────────────────────────────────

/** Core classes applied to every skeleton block */
export const BASE_CLASSES = "relative overflow-hidden bg-surface-secondary";

// ── Animation Classes ────────────────────────────────────────────

export const ANIMATION_CLASSES: Record<SkeletonAnimation, string> = {
  pulse: "animate-pulse",
  shimmer: "", // handled by motion.div + gradient style
  static: "",
};

// ── Shimmer Gradient ─────────────────────────────────────────────

/**
 * CSS background for the shimmer effect.
 * Linear gradient with a bright band that sweeps across.
 * Uses theme surface tokens for the gradient colors.
 */
export const SHIMMER_GRADIENT =
  "linear-gradient(90deg, transparent 0%, var(--ff-bg-tertiary, rgba(255,255,255,0.08)) 40%, var(--ff-bg-tertiary, rgba(255,255,255,0.08)) 60%, transparent 100%)";

export const SHIMMER_BACKGROUND_SIZE = "200% 100%";

// ── Variant-Specific Layouts ─────────────────────────────────────

/** Default dimensions for each variant when width/height not specified */
export const VARIANT_DEFAULTS: Record<
  SkeletonVariant,
  { width: string; height: string; rounded: string; lines?: number }
> = {
  text: {
    width: "100%",
    height: "12px",
    rounded: "4px",
    lines: 1,
  },
  avatar: {
    width: "40px",
    height: "40px",
    rounded: "50%",
  },
  card: {
    width: "100%",
    height: "auto",
    rounded: "8px",
    lines: 3,
  },
  tableRow: {
    width: "100%",
    height: "40px",
    rounded: "4px",
    lines: 4,
  },
  chart: {
    width: "100%",
    height: "200px",
    rounded: "8px",
  },
  listItem: {
    width: "100%",
    height: "auto",
    rounded: "8px",
  },
  dashboardWidget: {
    width: "100%",
    height: "auto",
    rounded: "12px",
  },
  custom: {
    width: "100%",
    height: "12px",
    rounded: "4px",
  },
};

// ── Text Line Widths (for multi-line variants) ───────────────────

/** Percentage widths for each line in card / listItem / dashboardWidget */
export const LINE_WIDTHS: Record<string, string[]> = {
  card: ["100%", "85%", "60%"],
  listItem: ["100%", "70%"],
  dashboardWidget: ["40%", "100%", "90%", "75%"],
  tableRow: ["15%", "30%", "25%", "20%"],
};

// ── Spacing ──────────────────────────────────────────────────────

/** Gap between inner elements per variant */
export const INNER_GAP: Record<string, string> = {
  card: "12px",
  listItem: "12px",
  dashboardWidget: "16px",
  tableRow: "16px",
};
