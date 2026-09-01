import { cn } from "@/shared/utils";
import type { ReactNode } from "react";

export interface AvatarProps {
  /** Name used for initials + accessible label */
  name: string;
  /** Image URL (falls back to initials) */
  src?: string;
  /** Size in px */
  size?: number;
  /** Color treatment */
  variant?: "brand" | "surface" | "gradient";
  className?: string;
}

const VARIANTS = {
  brand: "bg-brand-primary-subtle text-brand-primary",
  surface: "bg-bg-tertiary text-text-secondary",
  gradient: "bg-gradient-primary text-bg-inverse",
} as const;

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Avatar — initials monogram or image with ring accent.
 */
export function Avatar({
  name,
  src,
  size = 32,
  variant = "brand",
  className,
}: AvatarProps): ReactNode {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-surface-primary",
        VARIANTS[variant],
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}