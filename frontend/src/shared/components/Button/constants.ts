/**
 * Button — Constants
 *
 * Class maps for every variant × size combination.
 * All values use Tailwind theme tokens — zero hardcoded colors.
 */

// ── Base Classes (shared across all variants) ────────────────────

export const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 font-medium rounded-button " +
  "transition-colors duration-fast outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50";

// ── Size Classes ─────────────────────────────────────────────────

export const SIZE_CLASSES = {
  xs: "h-7 px-2.5 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  xl: "h-12 px-8 text-base",
} as const;

/** Icon size (px) for each button size — used by leftIcon/rightIcon */
export const ICON_SIZE = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
} as const;

/** Spinner size for each button size */
export const SPINNER_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
} as const;

// ── Variant Classes ──────────────────────────────────────────────

export const VARIANT_CLASSES = {
  primary:
    "bg-brand-primary text-text-inverse shadow-elevation-xs " +
    "hover:bg-brand-primary-hover hover:shadow-elevation-sm " +
    "active:bg-brand-primary-active",

  secondary:
    "bg-bg-tertiary text-text-primary border border-border-default " +
    "hover:bg-surface-hover hover:border-border-strong " +
    "active:bg-surface-active",

  neutral: "bg-bg-tertiary text-text-primary border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active",
  outline: "bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-primary-subtle active:bg-brand-primary/10",


  ghost:
    "bg-transparent text-text-secondary " +
    "hover:bg-bg-tertiary hover:text-text-primary " +
    "active:bg-surface-active",

  danger:
    "bg-danger text-text-inverse shadow-elevation-xs " +
    "hover:bg-danger/90 hover:shadow-elevation-sm " +
    "active:bg-danger/80",

  success:
    "bg-success text-text-inverse shadow-elevation-xs " +
    "hover:bg-success/90 hover:shadow-elevation-sm " +
    "active:bg-success/80",

  glass:
    "bg-glass-bg text-text-primary border border-glass-border backdrop-blur-md " +
    "hover:bg-glass-bg/90 " +
    "active:bg-glass-bg/80",

  gradient:
    "bg-gradient-primary text-text-inverse shadow-elevation-sm " +
    "hover:shadow-elevation-md " +
    "active:shadow-elevation-xs",

  link:
    "bg-transparent text-brand-primary px-0 " +
    "hover:underline " +
    "active:text-brand-primary-active",
} as const;

// ── Full Width Override ──────────────────────────────────────────

export const FULL_WIDTH_CLASSES = "w-full";
