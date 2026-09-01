/**
 * Toast — Styles
 *
 * Pure functions that compose className strings.
 * No React dependency — safe in tests and SSR.
 */
import { cn } from "@/shared/utils";
import type { ToastVariant, ToastPosition } from "./types";
import {
  VARIANT_CLASSES,
  ACCENT_CLASSES,
  ICON_COLOR_CLASSES,
  POSITION_CLASSES,
} from "./constants";

// ── Item Classes ─────────────────────────────────────────────────

/** Base classes for a single toast card. */
const ITEM_BASE =
  "relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] p-4 " +
  "rounded-card shadow-elevation-lg border " +
  "pointer-events-auto select-none " +
  "focus-within:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary " +
  "overflow-hidden";

/**
 * Compute the full className for a toast item card.
 */
export function getToastItemClasses(variant: ToastVariant): string {
  return cn(
    ITEM_BASE,
    VARIANT_CLASSES[variant],
    ACCENT_CLASSES[variant],
  );
}

// ── Icon Classes ─────────────────────────────────────────────────

/**
 * Compute className for the variant icon wrapper.
 */
export function getToastIconClasses(variant: ToastVariant): string {
  return cn(
    "flex-shrink-0 mt-0.5",
    ICON_COLOR_CLASSES[variant],
  );
}

// ── Container Classes ────────────────────────────────────────────

/**
 * Compute className for the fixed-position container.
 */
export function getToastContainerClasses(position: ToastPosition): string {
  return cn(
    "fixed z-[1080] flex flex-col pointer-events-none",
    POSITION_CLASSES[position],
  );
}

// ── Action Button Classes ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ACTION_BUTTON_CLASSES =
  "text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors duration-fast px-2 py-0.5 -ml-2 rounded hover:bg-brand-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

// ── Close Button Classes ─────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CLOSE_BUTTON_CLASSES =
  "absolute top-2 right-2 p-1 rounded text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";
