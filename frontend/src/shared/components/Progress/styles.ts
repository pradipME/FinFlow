import { cn } from "@/shared/utils";
import type { ProgressSize, ProgressVariant } from "./types";
import { BAR_CLASSES, TRACK_CLASSES, VALUE_TEXT_CLASSES, STRIPED_CLASSES } from "./constants";

interface GetTrackClassesInput {
  size: ProgressSize;
  className?: string;
}

export function getTrackClasses({ size, className }: GetTrackClassesInput): string {
  return cn(
    "w-full overflow-hidden rounded-full bg-bg-tertiary",
    TRACK_CLASSES[size],
    className,
  );
}

interface GetBarClassesInput {
  variant: ProgressVariant;
  striped: boolean;
  indeterminate: boolean;
}

export function getBarClasses({
  variant,
  striped,
  indeterminate,
}: GetBarClassesInput): string {
  return cn(
    "h-full rounded-full transition-all duration-normal",
    BAR_CLASSES[variant],
    striped && STRIPED_CLASSES,
    indeterminate && "w-full animate-[indeterminate_1.5s_ease-in-out_infinite]",
  );
}

export function getValueTextClasses(size: ProgressSize): string {
  return VALUE_TEXT_CLASSES[size];
}
