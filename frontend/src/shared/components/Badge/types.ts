/**
 * Badge — Type Definitions
 *
 * Two independent axes: variant (color) and shape (radius).
 * Clickable badges render as <button>, non-clickable as <span>.
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ── Variant ──────────────────────────────────────────────────────

/**
 * Color palette variants.
 * financial: requires `financialStatus` to pick the right status color.
 */
export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "financial"
  | "outline"
  | "dot";

// ── Financial Status ─────────────────────────────────────────────

/**
 * Maps to the financial status tokens in the theme engine.
 * Only used when variant="financial".
 */
export type FinancialStatus =
  "credit" | "debit" | "pending" | "held" | "failed" | "reversed" | "scheduled" | "settled";

// ── Shape ────────────────────────────────────────────────────────

/**
 * Border-radius treatment.
 * rounded: default — small radius for inline use
 * pill: fully round — for standalone tags and status indicators
 */
export type BadgeShape = "rounded" | "pill";

// ── Size ─────────────────────────────────────────────────────────

export type BadgeSize = "xs" | "sm" | "md" | "lg";

// ── Props ────────────────────────────────────────────────────────

/** Shared props for both span and button rendering */
interface BadgeBaseProps {
  /** Badge content */
  children: ReactNode;

  /** Color palette variant */
  variant?: BadgeVariant;

  /** Border-radius treatment */
  shape?: BadgeShape;

  /** Size preset */
  size?: BadgeSize;

  /** Financial status — required when variant="financial" */
  financialStatus?: FinancialStatus;

  /** Icon element rendered before the label */
  leftIcon?: ReactNode;

  /** Icon element rendered after the label */
  rightIcon?: ReactNode;

  /** Show a colored dot indicator before the label */
  showDot?: boolean;

  /** Dot color — defaults to the variant's primary color */
  dotColor?: string;
}

/** Props when badge is NOT clickable (renders <span>) */
export interface BadgeSpanProps
  extends BadgeBaseProps, Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  onClick?: undefined;
  href?: undefined;
}

/** Props when badge IS clickable (renders <button>) */
export interface BadgeButtonProps
  extends BadgeBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color"> {
  onClick: () => void;
  href?: undefined;
}

/** Props when badge is a link (renders <a>) */
export interface BadgeLinkProps
  extends BadgeBaseProps, Omit<HTMLAttributes<HTMLAnchorElement>, "children" | "color"> {
  href: string;
  onClick?: undefined;
}

/** Discriminated union — element type is inferred from which props are present */
export type BadgeProps = BadgeSpanProps | BadgeButtonProps | BadgeLinkProps;
