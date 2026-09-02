import { useState, useRef, type ReactNode } from "react";
import { cn } from "@/shared/utils";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const SIDE_POSITIONS = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
} as const;

/**
 * Tooltip — hover/focus-revealed label.
 * Pure CSS reveal on hover group; accessible via focus-visible too.
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps): ReactNode {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (): void => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 150);
  };
  const hide = (): void => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-tooltip whitespace-nowrap rounded-md",
            "bg-bg-inverse px-2 py-1 text-xs font-medium text-text-inverse",
            "shadow-elevation-sm",
            SIDE_POSITIONS[side],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}