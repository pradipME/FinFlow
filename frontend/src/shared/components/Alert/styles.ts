import { cn } from "@/shared/utils";
import type { AlertSize, AlertVariant } from "./types";
import {
  ACCENT_CLASSES,
  CLOSE_BUTTON_CLASSES,
  ICON_COLOR_CLASSES,
  SIZE_CLASSES,
  VARIANT_CLASSES,
} from "./constants";

interface GetAlertClassesInput {
  variant: AlertVariant;
  size: AlertSize;
  accent: boolean;
  className?: string;
}

export function getAlertClasses({
  variant,
  size,
  accent,
  className,
}: GetAlertClassesInput): string {
  return cn(
    "relative flex items-start rounded-card border border-current/10 bg-surface-primary",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    accent && ACCENT_CLASSES[variant],
    className,
  );
}

export function getAlertIconClasses(variant: AlertVariant): string {
  return cn("flex-shrink-0 mt-0.5", ICON_COLOR_CLASSES[variant]);
}

export function getAlertCloseButtonClasses(): string {
  return CLOSE_BUTTON_CLASSES;
}

export function getAlertActionClasses(): string {
  return cn(
    "flex-shrink-0 font-medium underline underline-offset-2 hover:no-underline transition-colors",
  );
}
