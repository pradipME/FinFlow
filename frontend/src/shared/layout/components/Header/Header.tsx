/**
 * Header — Top navigation bar.
 *
 * Contains sidebar toggle, search, breadcrumbs, and action items.
 * Fixed position with blur backdrop.
 */
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";
import { HEADER_HEIGHT, Z_INDEX } from "../../constants";

interface HeaderProps {
  /** Left-side content (usually sidebar toggle + breadcrumbs) */
  left?: ReactNode;
  /** Center content (usually search) */
  center?: ReactNode;
  /** Right-side actions (notifications, theme, user) */
  right?: ReactNode;
  /** Additional class names */
  className?: string;
}

export function Header({ left, center, right, className }: HeaderProps): ReactNode {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 flex items-center",
        "border-b border-border-default",
        "bg-bg-primary/80 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        className,
      )}
      style={{
        height: HEADER_HEIGHT,
        zIndex: Z_INDEX.header,
      }}
    >
      {/* Left: toggle + breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-2 px-4">{left}</div>

      {/* Center: search */}
      {center && <div className="hidden w-full max-w-md px-4 md:block">{center}</div>}

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2 px-4">{right}</div>
    </header>
  );
}
