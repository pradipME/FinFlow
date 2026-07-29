import type { ProgressSize, ProgressVariant } from "./types";

export const DEFAULT_SIZE: ProgressSize = "md";
export const DEFAULT_VARIANT: ProgressVariant = "default";
export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;

export const TRACK_CLASSES: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export const BAR_CLASSES: Record<ProgressVariant, string> = {
  default: "bg-brand-primary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
};

export const VALUE_TEXT_CLASSES: Record<ProgressSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const STRIPED_CLASSES =
  "bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]";
