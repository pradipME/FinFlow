/**
 * Badge — Styles
 *
 * Pure function composing the final className.
 * No React dependency — safe in tests and SSR.
 */
import { cn } from "@/shared/utils";
import type { BadgeVariant, BadgeSize, BadgeShape, FinancialStatus } from "./types";
import {
  BASE_CLASSES,
  CLICKABLE_CLASSES,
  SHAPE_CLASSES,
  SIZE_CLASSES,
  VARIANT_CLASSES,
  FINANCIAL_DOT_CLASSES,
  FINANCIAL_TEXT_CLASSES,
} from "./constants";

interface BadgeStyleInput {
  variant: BadgeVariant;
  size: BadgeSize;
  shape: BadgeShape;
  isClickable: boolean;
  financialStatus?: FinancialStatus;
  hasDot: boolean;
}

/**
 * Compute the full className string for a Badge.
 */
export function getBadgeClasses({
  variant,
  size,
  shape,
  isClickable,
  financialStatus,
  hasDot,
}: BadgeStyleInput): string {
  // For the "dot" variant, use neutral bg + the dot carries the color
  const effectiveVariant = variant;

  // For financial variant, override text color with status-specific color
  const financialTextOverride =
    variant === "financial" && financialStatus ? FINANCIAL_TEXT_CLASSES[financialStatus] : "";

  return cn(
    BASE_CLASSES,
    SIZE_CLASSES[size],
    SHAPE_CLASSES[shape],
    VARIANT_CLASSES[effectiveVariant],
    financialTextOverride,
    isClickable && CLICKABLE_CLASSES,
    hasDot && "pl-1",
  );
}

/**
 * Get the dot color class for a given variant and financial status.
 */
export function getDotColorClass(variant: BadgeVariant, financialStatus?: FinancialStatus): string {
  if (variant === "financial" && financialStatus) {
    return FINANCIAL_DOT_CLASSES[financialStatus];
  }

  // Map variant to the appropriate dot color
  const dotColorMap: Record<string, string> = {
    primary: "bg-brand-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-info",
    neutral: "bg-text-tertiary",
    financial: "bg-text-tertiary",
    outline: "bg-text-tertiary",
    dot: "bg-brand-primary",
  };

  return dotColorMap[variant] ?? "bg-text-tertiary";
}
