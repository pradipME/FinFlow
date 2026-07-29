/**
 * PasswordInput — Constants
 *
 * Class maps for the visibility toggle, Caps Lock banner,
 * and strength indicator slot. All colors use theme tokens.
 */

// ── Toggle Button ────────────────────────────────────────────────

/**
 * Positioned outside Input's wrapper as a sibling.
 * Sits in the right padding zone of the input field.
 * Hidden when loading (input is disabled, spinner is showing).
 */
export const TOGGLE_BUTTON_CLASSES =
  "absolute right-2 top-1/2 -translate-y-1/2 z-10 " +
  "flex items-center justify-center w-8 h-8 rounded-md " +
  "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary " +
  "transition-colors duration-fast cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

// ── Caps Lock Banner ─────────────────────────────────────────────

export const CAPS_LOCK_BANNER_CLASSES =
  "flex items-center gap-1.5 text-xs text-warning font-medium";

// ── Strength Indicator ───────────────────────────────────────────

export const STRENGTH_INDICATOR_CLASSES = "mt-1.5";
