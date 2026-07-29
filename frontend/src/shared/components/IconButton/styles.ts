/**
 * IconButton — Styles
 *
 * Pure function composing the final className from shape, variant, size.
 * No React dependency — safe in tests and SSR.
 */
import { cn } from "@/shared/utils";
import type { IconButtonShape, IconButtonVariant, IconButtonSize } from "./types";
import {
  BASE_CLASSES,
  SHAPE_CLASSES,
  SIZE_CLASSES,
  VARIANT_CLASSES,
  TRANSITION_CLASSES,
} from "./constants";

interface IconButtonStyleInput {
  shape: IconButtonShape;
  variant: IconButtonVariant;
  size: IconButtonSize;
  isDisabled: boolean;
  isLoading: boolean;
}

/**
 * Compute the full className string for an IconButton.
 */
export function getIconButtonClasses({
  shape,
  variant,
  size,
  isDisabled,
  isLoading,
}: IconButtonStyleInput): string {
  const loadingClass = isLoading ? "cursor-wait" : "";

  return cn(
    BASE_CLASSES,
    SHAPE_CLASSES[shape],
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    TRANSITION_CLASSES,
    loadingClass,
    isDisabled && "pointer-events-none opacity-50",
  );
}
