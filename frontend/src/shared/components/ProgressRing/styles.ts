import { cn } from "@/shared/utils";
import type { ProgressRingSize, ProgressRingVariant } from "./types";
import { BAR_COLORS, VALUE_TEXT_CLASSES } from "./constants";

interface GetRingBarClassesInput {
  variant: ProgressRingVariant;
  indeterminate: boolean;
}

export function getRingBarClasses({ variant, indeterminate }: GetRingBarClassesInput): string {
  return cn(
    "transition-[stroke-dashoffset] duration-normal ease-out",
    BAR_COLORS[variant],
    indeterminate && "animate-[spin_1.4s_linear_infinite]",
  );
}

export function getRingValueClasses(size: ProgressRingSize): string {
  return cn("absolute inset-0 flex items-center justify-center", VALUE_TEXT_CLASSES[size]);
}
