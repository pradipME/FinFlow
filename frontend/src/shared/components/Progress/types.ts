import type { HTMLAttributes, ReactNode } from "react";

export type ProgressSize = "sm" | "md" | "lg";

export type ProgressVariant = "default" | "success" | "info" | "warning" | "danger";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  label?: ReactNode;
  showValue?: boolean;
  indeterminate?: boolean;
  striped?: boolean;
}
