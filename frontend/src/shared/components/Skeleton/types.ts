/**
 * Skeleton — Type Definitions
 *
 * Eight layout variants, two animation modes, fully configurable
 * dimensions. Purely decorative — aria-hidden by default.
 */

// ── Variant ──────────────────────────────────────────────────────

/**
 * Pre-built layout shapes.
 * text:         single text line
 * avatar:       circle or rounded-square profile image placeholder
 * card:         header block + content lines
 * tableRow:     row of cells with varying widths
 * chart:        rectangular chart area placeholder
 * listItem:     avatar circle + text lines (list item)
 * dashboardWidget: title bar + large content block
 * custom:       user-controlled dimensions, no preset shape
 */
export type SkeletonVariant =
  "text" | "avatar" | "card" | "tableRow" | "chart" | "listItem" | "dashboardWidget" | "custom";

// ── Animation Mode ───────────────────────────────────────────────

/**
 * pulse:    opacity oscillation (default)
 * shimmer:  gradient sweep across the surface
 * static:   no animation, flat block
 */
export type SkeletonAnimation = "pulse" | "shimmer" | "static";

// ── Props ────────────────────────────────────────────────────────

export interface SkeletonProps {
  /** Pre-built layout variant */
  variant?: SkeletonVariant;

  /** Width — CSS value (e.g. "100%", "200px") or pixel number */
  width?: string | number;

  /** Height — CSS value (e.g. "20px", 100) or pixel number */
  height?: string | number;

  /** Border radius — CSS value (e.g. "8px", "50%") or pixel number.
   *  Ignored when variant is "avatar" (forced to circle). */
  rounded?: string | number;

  /** Force circle shape (sets border-radius: 50%) */
  circle?: boolean;

  /** Animation mode */
  animation?: SkeletonAnimation;

  /** Additional CSS class names */
  className?: string;
}
