import { cn } from "@/shared/utils";
import type { LoadingOverlayMode } from "./types";
import { MODE_CLASSES, BACKDROP_CLASSES, CONTENT_CLASSES } from "./constants";

interface GetOverlayClassesInput {
  mode: LoadingOverlayMode;
  backdrop: boolean;
  className?: string;
}

export function getOverlayClasses({
  mode,
  backdrop,
  className,
}: GetOverlayClassesInput): string {
  return cn(
    "flex items-center justify-center z-toast",
    MODE_CLASSES[mode],
    backdrop && BACKDROP_CLASSES,
    className,
  );
}

export function getOverlayContentClasses(): string {
  return CONTENT_CLASSES;
}

export function getOverlayLabelClasses(): string {
  return "text-sm text-text-secondary font-medium";
}
