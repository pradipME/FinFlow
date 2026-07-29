import type { AlertVariant } from "./types";

export const DEFAULT_VARIANT: AlertVariant = "info";
export const DEFAULT_SIZE = "md" as const;

export const VARIANT_CLASSES: Record<AlertVariant, string> = {
  success: "bg-success-subtle text-success",
  info: "bg-info-subtle text-info",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
};

export const ACCENT_CLASSES: Record<AlertVariant, string> = {
  success: "border-l-4 border-l-success",
  info: "border-l-4 border-l-info",
  warning: "border-l-4 border-l-warning",
  danger: "border-l-4 border-l-danger",
};

export const ICON_COLOR_CLASSES: Record<AlertVariant, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
};

export const SIZE_CLASSES = {
  sm: "text-xs px-3 py-2 gap-2",
  md: "text-sm px-4 py-3 gap-3",
  lg: "text-base px-5 py-4 gap-3",
} as const;

export const ICON_SIZES = {
  sm: 14,
  md: 16,
  lg: 18,
} as const;

export const CLOSE_BUTTON_CLASSES =
  "absolute top-2 right-2 p-0.5 rounded text-current/50 hover:text-current hover:bg-current/10 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current";
