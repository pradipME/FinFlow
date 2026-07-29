import type { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "success" | "info" | "warning" | "danger";

export type AlertSize = "sm" | "md" | "lg";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: AlertSize;
  title?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  action?: ReactNode;
  accent?: boolean;
}
