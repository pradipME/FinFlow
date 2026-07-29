/**
 * OTPInput — Constants
 *
 * Shared Tailwind class strings.
 */

// ── Layout ───────────────────────────────────────────────────────

export const WRAPPER_CLASSES = "flex flex-col gap-1.5";

export const CELLS_CONTAINER_CLASSES = "flex items-center gap-2";

// ── Cell Sizes ───────────────────────────────────────────────────

export const CELL_SIZE_CLASSES = {
  sm: "w-8 h-10 text-base",
  md: "w-10 h-12 text-lg",
  lg: "w-12 h-14 text-xl",
} as const;

// ── Cell Base ────────────────────────────────────────────────────

export const CELL_BASE_CLASSES =
  "text-center font-mono font-semibold bg-bg-primary border border-border-default rounded-lg outline-none transition-all duration-fast disabled:cursor-not-allowed disabled:opacity-50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

// ── Cell States ──────────────────────────────────────────────────

export const CELL_ERROR_CLASSES = "border-danger focus:border-danger focus:ring-danger/20";

export const CELL_FILLED_CLASSES = "border-brand-primary bg-bg-secondary";

// ── Hidden Input (for form submission) ───────────────────────────

export const HIDDEN_INPUT_CLASSES = "sr-only";

// ── Label ────────────────────────────────────────────────────────

export const LABEL_CLASSES = "text-sm font-medium text-text-primary";
