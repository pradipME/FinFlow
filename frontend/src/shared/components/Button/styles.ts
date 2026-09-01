/**
 * Button — Styles
 *
 * Pure function that composes the final className from variant, size,
 * and prop flags. No React dependency — safe in tests and SSR.
 */
import { cn } from "@/shared/utils";
import type { ButtonVariant, ButtonSize } from "./types";
import { BASE_CLASSES, SIZE_CLASSES, VARIANT_CLASSES, FULL_WIDTH_CLASSES } from "./constants";

interface ButtonStyleInput {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  isIconOnly: boolean;
}

/**
 * Compute the full className string for a Button.
 */
export function getButtonClasses({
  variant,
  size,
  fullWidth,
  isDisabled,
  isLoading,
  isIconOnly,
}: ButtonStyleInput): string {
  const iconOnlyPadding = isIconOnly ? "px-0 aspect-square" : "";
  const loadingClass = isLoading ? "cursor-wait" : "";

  return cn(
    BASE_CLASSES,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant as keyof typeof VARIANT_CLASSES],
    fullWidth && FULL_WIDTH_CLASSES,
    iconOnlyPadding,
    loadingClass,
    isDisabled && "pointer-events-none opacity-50",
  );
}
