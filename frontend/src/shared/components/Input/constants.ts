/**
 * Input — Constants
 *
 * Class maps for every size × state combination.
 * All colors use Tailwind theme tokens — zero hardcoded values.
 */
import type { InputSize, InputState } from "./types";

// ── Base Classes ─────────────────────────────────────────────────

export const WRAPPER_CLASSES = "flex flex-col gap-1.5";

export const INPUT_WRAPPER_CLASSES =
  "relative flex items-center rounded-lg border bg-bg-primary transition-colors duration-fast";

// ── Size Classes ─────────────────────────────────────────────────

export const INPUT_SIZE_CLASSES: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

// ── State Classes ────────────────────────────────────────────────

export const INPUT_STATE_CLASSES: Record<InputState, string> = {
  default:
    "border-border-default hover:border-border-strong focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20",
  invalid: "border-danger focus-within:ring-2 focus-within:ring-danger/20",
  success: "border-success focus-within:ring-2 focus-within:ring-success/20",
};

// ── Disabled / Read-only ─────────────────────────────────────────

export const DISABLED_CLASSES = "cursor-not-allowed opacity-50 bg-surface-secondary";

export const READONLY_CLASSES = "cursor-default bg-surface-secondary";

// ── Input Element ────────────────────────────────────────────────

export const INPUT_ELEMENT_CLASSES =
  "w-full bg-transparent text-text-primary placeholder:text-text-tertiary outline-none disabled:cursor-not-allowed disabled:opacity-50";

// ── Label ────────────────────────────────────────────────────────

export const LABEL_CLASSES = "text-sm font-medium text-text-primary";

export const LABEL_REQUIRED_CLASSES = "text-danger ml-0.5";

export const LABEL_DISABLED_CLASSES = "opacity-50";

// ── Message Text ─────────────────────────────────────────────────

export const HELPER_TEXT_CLASSES = "text-xs text-text-tertiary";

export const ERROR_TEXT_CLASSES = "text-xs text-danger";

export const SUCCESS_TEXT_CLASSES = "text-xs text-success";

// ── Icon Slots ───────────────────────────────────────────────────

export const LEFT_ICON_CLASSES =
  "absolute left-3 flex items-center text-text-tertiary pointer-events-none";

export const RIGHT_ICON_CLASSES =
  "absolute right-3 flex items-center text-text-tertiary pointer-events-none";

// ── Prefix / Suffix ──────────────────────────────────────────────

export const PREFIX_CLASSES =
  "flex items-center text-text-secondary border-r border-border-default pr-2 select-none";

export const SUFFIX_CLASSES =
  "flex items-center text-text-secondary border-l border-border-default pl-2 select-none";

// ── Clear Button ─────────────────────────────────────────────────

export const CLEAR_BUTTON_CLASSES =
  "absolute right-2 flex items-center justify-center w-5 h-5 rounded-full " +
  "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary " +
  "transition-colors duration-fast cursor-pointer";

// ── Loading Spinner Size ─────────────────────────────────────────

export const LOADING_SPINNER_CLASSES = "absolute right-3 flex items-center text-text-tertiary";

// ── Padding Adjustments (for icons/prefix/suffix) ────────────────

export const PADDING_LEFT_WITH_ICON = "pl-10";
export const PADDING_LEFT_WITH_PREFIX = "pl-0";
export const PADDING_RIGHT_WITH_ICON = "pr-10";
export const PADDING_RIGHT_WITH_CLEAR = "pr-10";
export const PADDING_RIGHT_WITH_LOADING = "pr-10";
