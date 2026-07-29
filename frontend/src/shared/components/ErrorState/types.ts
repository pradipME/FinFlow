import type { HTMLAttributes, ReactNode } from "react";

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title?: string;
  description?: ReactNode;
  errorCode?: string | number;
  retryLabel?: string;
  onRetry?: () => void;
  secondaryAction?: ReactNode;
}
