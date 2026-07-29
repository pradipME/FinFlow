/**
 * Toast — Constants
 *
 * Default values, variant class maps, and position class maps.
 * All colors use Tailwind theme tokens — zero hardcoded values.
 */
import type { ToastVariant, ToastPosition } from "./types";

// ── Defaults ─────────────────────────────────────────────────────

/** Default auto-close delay in milliseconds. */
export const DEFAULT_AUTO_CLOSE = 5000;

/** Default maximum visible toasts. */
export const DEFAULT_MAX_VISIBLE = 5;

/** Default gap between stacked toasts in px. */
export const DEFAULT_GAP = 8;

/** Default position. */
export const DEFAULT_POSITION: ToastPosition = "bottom-right";

// ── Variant Classes ──────────────────────────────────────────────

/** Background, text, border, and icon color classes per variant. */
export const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success:
    "bg-surface-primary border-success/20 text-text-primary",
  info:
    "bg-surface-primary border-info/20 text-text-primary",
  warning:
    "bg-surface-primary border-warning/20 text-text-primary",
  danger:
    "bg-surface-primary border-danger/20 text-text-primary",
  loading:
    "bg-surface-primary border-brand-primary/20 text-text-primary",
};

/** Left accent border color per variant. */
export const ACCENT_CLASSES: Record<ToastVariant, string> = {
  success: "border-l-4 border-l-success",
  info: "border-l-4 border-l-info",
  warning: "border-l-4 border-l-warning",
  danger: "border-l-4 border-l-danger",
  loading: "border-l-4 border-l-brand-primary",
};

/** Icon color classes per variant. */
export const ICON_COLOR_CLASSES: Record<ToastVariant, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
  loading: "text-brand-primary",
};

// ── Position Classes ─────────────────────────────────────────────

/** Tailwind utility classes for positioning the toast container. */
export const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

// ── Animation Direction ──────────────────────────────────────────

/** Whether a position is at the top of the screen (affects enter/exit direction). */
export const IS_TOP: Record<ToastPosition, boolean> = {
  "top-right": true,
  "top-left": true,
  "top-center": true,
  "bottom-right": false,
  "bottom-left": false,
  "bottom-center": false,
};

// ── Swipe Threshold ──────────────────────────────────────────────

/** Minimum swipe distance in px before the toast is dismissed. */
export const SWIPE_THRESHOLD = 100;

/** Velocity threshold for quick swipes. */
export const SWIPE_VELOCITY = 0.3;
