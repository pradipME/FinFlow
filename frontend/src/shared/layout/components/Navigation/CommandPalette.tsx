/**
 * CommandPalette — ⌘K global search overlay.
 *
 * Full-screen overlay with a search input and categorized routes.
 * Keyboard shortcut: Cmd+K (macOS) or Ctrl+K (Windows/Linux).
 */
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Command } from "lucide-react";
import { cn } from "@/shared/utils";
import { Z_INDEX, SHORTCUTS } from "../../constants";

interface CommandPaletteProps {
  /** Whether the palette is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
}

const PAGES: { label: string; href: string; category: string }[] = [
  { label: "Dashboard", href: "/dashboard", category: "Navigate" },
  { label: "Payments", href: "/payments", category: "Navigate" },
  { label: "Accounts", href: "/accounts", category: "Navigate" },
  { label: "Transactions", href: "/transactions", category: "Navigate" },
  { label: "Transfers", href: "/transfers", category: "Navigate" },
  { label: "Cards", href: "/cards", category: "Navigate" },
  { label: "Savings", href: "/savings", category: "Navigate" },
  { label: "Beneficiaries", href: "/beneficiaries", category: "Navigate" },
  { label: "Notifications", href: "/notifications", category: "Navigate" },
  { label: "Profile", href: "/profile", category: "Account" },
  { label: "Settings", href: "/settings", category: "Account" },
  { label: "Security Center", href: "/security", category: "Account" },
  { label: "Analytics", href: "/analytics", category: "Account" },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps): ReactNode {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

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

  const q = query.trim().toLowerCase();
  const results = PAGES.filter((p) => !q || p.label.toLowerCase().includes(q) || p.href.includes(q));
  const grouped = results.reduce<Record<string, typeof results>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const run = (href: string) => {
    setQuery("");
    onClose();
    navigate(href);
  };

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

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                {category}
              </p>
              {items.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => run(item.href)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary"
                >
                  <Command size={14} className="text-text-tertiary" />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
          {results.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-text-tertiary">
              No results for “{query}”.
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border-default px-4 py-2 text-xs text-text-tertiary">
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-bg-tertiary px-1 py-0.5">esc</kbd> close
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-bg-tertiary px-1 py-0.5">↵</kbd> select
          </span>
        </div>
      </div>
    </div>
  );
}