/**
 * SearchBar — Global search input in the header.
 *
 * Opens the command palette on click or Cmd+K. Shows a fake input
 * that acts as a trigger (no actual inline search logic).
 */
import type { ReactNode } from "react";
import { Search, Command } from "lucide-react";
import { cn } from "@/shared/utils";

interface SearchBarProps {
  /** Click handler to open command palette */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
}

export function SearchBar({ onClick, className }: SearchBarProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl",
        "border border-border-default",
        "bg-bg-secondary px-3 py-1.5",
        "text-sm text-text-tertiary",
        "transition-colors duration-150",
        "hover:border-border-strong hover:bg-bg-tertiary",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        className,
      )}
    >
      <Search size={16} className="shrink-0 text-text-tertiary" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden items-center gap-0.5 rounded-md bg-bg-primary px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary sm:inline-flex">
        <Command size={10} />K
      </kbd>
    </button>
  );
}
