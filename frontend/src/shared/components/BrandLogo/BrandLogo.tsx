import { cn } from "@/shared/utils";
import type { ReactNode } from "react";

export interface BrandLogoProps {
  /** Height sizing; width stays auto so the logo keeps its exact aspect ratio. */
  className?: string;
  /** Accessible label. */
  alt?: string;
}

/**
 * BrandLogo — the FinFlow logo lockup rendered from the provided brand asset
 * (transparent PNG, no painted background/box).
 */
export function BrandLogo({ className, alt = "FinFlow" }: BrandLogoProps): ReactNode {
  return (
    <img
      src="/finflow-logo.png"
      alt={alt}
      width={806}
      height={599}
      draggable={false}
      className={cn("h-7 w-auto select-none object-contain", className)}
    />
  );
}