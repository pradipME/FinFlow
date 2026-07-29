import type { ProgressRingSize, ProgressRingVariant } from "./types";

export const DEFAULT_SIZE: ProgressRingSize = "md";
export const DEFAULT_VARIANT: ProgressRingVariant = "default";
export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;

export const SIZE_MAP: Record<ProgressRingSize, { dimension: number; strokeWidth: number }> = {
  sm: { dimension: 32, strokeWidth: 3 },
  md: { dimension: 48, strokeWidth: 4 },
  lg: { dimension: 64, strokeWidth: 5 },
};

export const TRACK_COLOR = "currentColor/10";

export const BAR_COLORS: Record<ProgressRingVariant, string> = {
  default: "text-brand-primary",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
};

export const VALUE_TEXT_CLASSES: Record<ProgressRingSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};
