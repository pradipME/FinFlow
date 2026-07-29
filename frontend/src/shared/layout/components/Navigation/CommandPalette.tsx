/**
 * CommandPalette — ⌘K global search overlay.
 *
 * Full-screen overlay with a search input and categorized results.
 * Keyboard shortcut: Cmd+K (macOS) or Ctrl+K (Windows/Linux).
 *
 * NOTE: This is the shell. Actual search logic and result data
 * will be wired in a future story. For now, it renders the UI structure.
 */
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { Search, X, Command } from "lucide-react";
import { cn } from "@/shared/utils";
import { Z_INDEX, SHORTCUTS } from "../../constants";

interface CommandPaletteProps {
  /** Whether the palette is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps): ReactNode {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Cmd+K / Ctrl+K shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === SHORTCUTS.COMMAND_PALETTE.key) {
        e.preventDefault();
        if (isOpen) handleClose();
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    },
    [isOpen, handleClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-[15vh]"
      style={{ zIndex: Z_INDEX.commandPalette }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative w-full max-w-lg mx-4",
          "rounded-2xl border border-border-default",
          "bg-bg-primary shadow-2xl",
        )}
        role="dialog"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-border-default px-4">
          <Search size={18} className="shrink-0 text-text-tertiary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, pages, actions..."
            className="flex-1 bg-transparent py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-text-tertiary hover:bg-bg-tertiary"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results placeholder */}
        <div className="max-h-80 overflow-y-auto p-2">
          <div className="px-3 py-8 text-center text-sm text-text-tertiary">
            <Command size={24} className="mx-auto mb-2 opacity-50" />
            <p>Type to search across the application...</p>
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border-default px-4 py-2 text-xs text-text-tertiary">
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-bg-tertiary px-1 py-0.5">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-bg-tertiary px-1 py-0.5">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-bg-tertiary px-1 py-0.5">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
