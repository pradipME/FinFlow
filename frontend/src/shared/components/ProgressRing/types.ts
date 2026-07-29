import type { SVGAttributes, ReactNode } from "react";

export type ProgressRingSize = "sm" | "md" | "lg";

export type ProgressRingVariant = "default" | "success" | "info" | "warning" | "danger";

export interface ProgressRingProps extends Omit<SVGAttributes<SVGSVGElement>, "width" | "height"> {
  value?: number;
  min?: number;
  max?: number;
  size?: ProgressRingSize;
  variant?: ProgressRingVariant;
  strokeWidth?: number;
  label?: ReactNode;
  showValue?: boolean;
  indeterminate?: boolean;
}
