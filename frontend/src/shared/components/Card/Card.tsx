import { cn } from "@/shared/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface treatment */
  variant?: "default" | "outlined" | "glass" | "elevated";
  /** Padding preset */
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

const VARIANTS = {
  default: "border border-border-default bg-surface-primary",
  outlined: "border border-border-subtle bg-bg-primary",
  glass: "glass-card",
  elevated: "border border-border-default bg-surface-primary shadow-elevation-md",
} as const;

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...rest
}: CardProps): ReactNode {
  return (
    <div className={cn("rounded-card", VARIANTS[variant], PADDING[padding], className)} {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, actions, className }: CardHeaderProps): ReactNode {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        {title && <h3 className="text-base font-semibold tracking-tight text-text-primary">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-sm text-text-tertiary">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={className} {...rest} />;
}