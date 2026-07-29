/**
 * Badge — Constants
 *
 * Class maps for variant × size × shape.
 * All values use Tailwind theme tokens — zero hardcoded colors.
 */
import type { BadgeVariant, BadgeSize, BadgeShape, FinancialStatus } from "./types";

// ── Base Classes ─────────────────────────────────────────────────

export const BASE_CLASSES =
  "inline-flex items-center justify-center gap-1.5 font-medium " +
  "transition-colors duration-fast outline-none " +
  "whitespace-nowrap select-none";

// ── Clickable Override ───────────────────────────────────────────

export const CLICKABLE_CLASSES =
  "cursor-pointer " +
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
  "active:scale-[0.97]";

// ── Shape Classes ────────────────────────────────────────────────

export const SHAPE_CLASSES: Record<BadgeShape, string> = {
  rounded: "rounded-md",
  pill: "rounded-full",
};

// ── Size Classes ─────────────────────────────────────────────────

export const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "h-5 px-1.5 text-[10px] leading-tight",
  sm: "h-6 px-2 text-xs leading-tight",
  md: "h-7 px-2.5 text-xs leading-tight",
  lg: "h-8 px-3 text-sm leading-tight",
};

/** Icon pixel size for each badge size */
export const ICON_SIZE: Record<BadgeSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
};

/** Dot pixel size for each badge size */
export const DOT_SIZE: Record<BadgeSize, number> = {
  xs: 5,
  sm: 6,
  md: 7,
  lg: 8,
};

// ── Variant Classes ──────────────────────────────────────────────

export const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-brand-primary-subtle text-brand-primary",

  success: "bg-success-subtle text-success",

  warning: "bg-warning-subtle text-warning",

  danger: "bg-danger-subtle text-danger",

  info: "bg-info-subtle text-info",

  neutral: "bg-bg-tertiary text-text-secondary",

  financial: "bg-bg-tertiary text-text-secondary",

  outline: "bg-transparent text-text-secondary border border-border-default",

  dot: "bg-bg-tertiary text-text-secondary",
};

// ── Financial Status → Color Class ───────────────────────────────

/**
 * Maps a FinancialStatus to the appropriate text color class.
 * The badge background stays neutral; the dot carries the status color.
 */
export const FINANCIAL_DOT_CLASSES: Record<FinancialStatus, string> = {
  credit: "bg-success",
  debit: "bg-danger",
  pending: "bg-warning",
  held: "bg-held",
  failed: "bg-danger",
  reversed: "bg-reversed",
  scheduled: "bg-scheduled",
  settled: "bg-success",
};

export const FINANCIAL_TEXT_CLASSES: Record<FinancialStatus, string> = {
  credit: "text-success",
  debit: "text-danger",
  pending: "text-warning",
  held: "text-held",
  failed: "text-danger",
  reversed: "text-reversed",
  scheduled: "text-scheduled",
  settled: "text-success",
};
