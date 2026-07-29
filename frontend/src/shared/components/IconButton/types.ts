/**
 * IconButton — Type Definitions
 *
 * Two orthogonal axes:
 *   shape:  circle | square     — border-radius treatment
 *   variant: filled | ghost | outline — color/border treatment
 *
 * Composes Button primitives internally — never duplicates logic.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ── Shape ────────────────────────────────────────────────────────

/**
 * Border-radius treatment.
 * circle: fully round — for standalone icon actions (close, menu, nav)
 * square: matches the base button radius — for toolbar grid layouts
 */
export type IconButtonShape = "circle" | "square";

// ── Style Variant ────────────────────────────────────────────────

/**
 * Color and border treatment.
 * filled:  solid background — primary color by default
 * ghost:   transparent background — appears on hover
 * outline: border only — transparent background
 */
export type IconButtonVariant = "filled" | "ghost" | "outline";

// ── Size ─────────────────────────────────────────────────────────

export type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// ── Props ────────────────────────────────────────────────────────

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The icon element to render. Required — IconButton has no text label. */
  children: ReactNode;

  /** Border-radius treatment */
  shape?: IconButtonShape;

  /** Color/border treatment */
  variant?: IconButtonVariant;

  /** Size preset — controls dimensions and icon size */
  size?: IconButtonSize;

  /** Shows a spinner and disables interaction */
  isLoading?: boolean;

  /** Force disabled state */
  isDisabled?: boolean;

  /**
   * Accessible label for the button.
   * REQUIRED — IconButton has no visible text. Screen readers need this.
   */
  "aria-label": string;
}
