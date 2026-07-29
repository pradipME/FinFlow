/**
 * Spinner — Type Definitions
 *
 * Four animation variants, five sizes, three display modes.
 * Purely presentational — no interactivity.
 */

// ── Variant ──────────────────────────────────────────────────────

/**
 * Animation style.
 * ring:   SVG circle with rotating stroke — standard loading indicator
 * dots:   Three bouncing dots — typing / message indicator
 * pulse:  Pulsing circle — content is loading
 * bars:   Vertical bars with wave animation — audio / processing
 */
export type SpinnerVariant = "ring" | "dots" | "pulse" | "bars";

// ── Size ─────────────────────────────────────────────────────────

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

// ── Display Mode ─────────────────────────────────────────────────

/**
 * How the spinner is positioned in the layout.
 * inline:    flows within content (default)
 * overlay:   absolute-centered on nearest relative ancestor
 * fullscreen: fixed-centered on the viewport
 */
export type SpinnerMode = "inline" | "overlay" | "fullscreen";

// ── Props ────────────────────────────────────────────────────────

export interface SpinnerProps {
  /** Animation variant */
  variant?: SpinnerVariant;

  /** Size preset */
  size?: SpinnerSize;

  /** Display mode */
  mode?: SpinnerMode;

  /**
   * Visible label text rendered below the spinner.
   * Also used as the accessible label for screen readers.
   */
  label?: string;

  /** Additional CSS class names */
  className?: string;
}
