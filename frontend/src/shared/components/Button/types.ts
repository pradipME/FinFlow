/**
 * Button — Type Definitions
 *
 * Extends native HTML button attributes with FinFlow design-system props.
 * Every prop is optional with sensible defaults.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ── Variants ─────────────────────────────────────────────────────

/**
 * Visual style variants.
 * Each maps to a distinct color palette and border treatment.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "glass"
  | "gradient"
  | "link";

// ── Sizes ────────────────────────────────────────────────────────

/**
 * Size presets — controls padding, font-size, height, and icon size.
 * xs: Compact for tight spaces (tables, inline actions)
 * sm: Small for secondary actions
 * md: Default — most common
 * lg: Prominent for primary CTAs
 * xl: Hero / marketing sections
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// ── Icon Position ────────────────────────────────────────────────

export type IconPosition = "left" | "right";

// ── Props ────────────────────────────────────────────────────────

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Button content */
  children: ReactNode;

  /** Visual style variant */
  variant?: ButtonVariant;

  /** Size preset */
  size?: ButtonSize;

  /** Icon element rendered before the label */
  leftIcon?: ReactNode;

  /** Icon element rendered after the label */
  rightIcon?: ReactNode;

  /** Shows a spinner and disables interaction */
  isLoading?: boolean;

  /** Renders at full container width */
  fullWidth?: boolean;

  /** Force disabled state (also set when isLoading) */
  isDisabled?: boolean;

  /** Render as icon-only (no children required) */
  isIconOnly?: boolean;
}
