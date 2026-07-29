/**
 * IconButton — Constants
 *
 * Shape, variant, and size class maps.
 * All values use Tailwind theme tokens — zero hardcoded colors.
 */
import type { IconButtonShape, IconButtonVariant, IconButtonSize } from "./types";

// ── Base Classes (shared across all combinations) ────────────────

/**
 * IconButton always renders icon-only: aspect-square, centered content.
 * Inherits focus ring, disabled states, and transition from Button's
 * base classes when composed via <Button>.
 */
export const BASE_CLASSES =
  "inline-flex items-center justify-center " +
  "font-medium outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50";

// ── Shape Classes ────────────────────────────────────────────────

export const SHAPE_CLASSES: Record<IconButtonShape, string> = {
  circle: "rounded-full",
  square: "rounded-button",
};

// ── Size Classes ─────────────────────────────────────────────────

/**
 * Dimensions and icon size for each preset.
 * All sizes are square (aspect-square enforced via dimension classes).
 */
export const SIZE_CLASSES: Record<IconButtonSize, string> = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-11 w-11",
  xl: "h-12 w-12",
};

/** Icon pixel size for each preset — passed to the icon's `size` prop */
export const ICON_SIZE: Record<IconButtonSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
};

/** Spinner pixel size for each preset */
export const SPINNER_SIZE: Record<IconButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

// ── Variant Classes ──────────────────────────────────────────────

/**
 * Color/border treatment for each style variant.
 * Maps to a subset of Button's variant system.
 */
export const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  filled:
    "bg-brand-primary text-text-inverse shadow-elevation-xs " +
    "hover:bg-brand-primary-hover hover:shadow-elevation-sm " +
    "active:bg-brand-primary-active",

  ghost:
    "bg-transparent text-text-secondary " +
    "hover:bg-bg-tertiary hover:text-text-primary " +
    "active:bg-surface-active",

  outline:
    "bg-transparent text-brand-primary border border-brand-primary " +
    "hover:bg-brand-primary-subtle " +
    "active:bg-brand-primary/10",
};

// ── Motion Classes ───────────────────────────────────────────────

/**
 * Transition classes applied via Tailwind for non-motion fallback.
 * Framer Motion handles the actual animation; these are for the
 * brief moment before hydration or when reduced-motion is active.
 */
export const TRANSITION_CLASSES = "transition-all duration-fast ease-out";
