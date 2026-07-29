/**
 * Container — Reusable width-constrained wrapper.
 *
 * Use inside Content when you need a specific max-width
 * without affecting the outer Content layout.
 */
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";
import { getContentWidthClasses } from "../../utils";
import type { ContentWidth } from "../../types";

interface ContainerProps {
  /** Content width preset */
  width?: ContentWidth;
  /** Additional class names */
  className?: string;
  /** Container children */
  children: ReactNode;
}

export function Container({ width = "contained", className, children }: ContainerProps): ReactNode {
  return <div className={cn(getContentWidthClasses(width), className)}>{children}</div>;
}
