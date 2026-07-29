import type { HTMLAttributes, ReactNode } from "react";

export type LoadingOverlayMode = "overlay" | "fullscreen";

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  mode?: LoadingOverlayMode;
  label?: string;
  spinner?: ReactNode;
  backdrop?: boolean;
  opacity?: number;
}
