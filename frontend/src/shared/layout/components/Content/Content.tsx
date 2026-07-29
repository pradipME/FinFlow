/**
 * Content — Main scrollable content area.
 *
 * Wraps children with appropriate padding and max-width.
 * Sits beside the sidebar with proper offset.
 */
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";
import { HEADER_HEIGHT } from "../../constants";
import { getContentWidthClasses } from "../../utils";
import type { ContentWidth } from "../../types";

interface ContentProps {
  /** Page content */
  children: ReactNode;
  /** Content width preset */
  width?: ContentWidth;
  /** Sidebar offset in px (0 for overlay/offscreen) */
  sidebarOffset?: number;
  /** Additional class names */
  className?: string;
}

export function Content({
  children,
  width = "contained",
  sidebarOffset = 0,
  className,
}: ContentProps): ReactNode {
  return (
    <main
      className={cn("min-h-screen transition-all duration-300 ease-out", className)}
      style={{
        paddingTop: HEADER_HEIGHT,
        marginLeft: sidebarOffset,
      }}
    >
      <div className={cn("px-4 py-6 sm:px-6 lg:px-8", getContentWidthClasses(width))}>
        {children}
      </div>
    </main>
  );
}
