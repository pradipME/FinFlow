/**
 * UserMenu — Header user avatar + dropdown trigger.
 *
 * Click/keyboard-accessible dropdown with Profile, Settings, and Sign out.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";

interface UserMenuProps {
  /** User's full name */
  name: string;
  /** User email (shown below name) */
  email?: string;
  /** User role */
  role?: string;
  /** Avatar URL (falls back to initials) */
  avatarUrl?: string;
  /** Logout callback */
  onLogout?: () => void;
  /** Navigation helper */
  onNavigate?: (to: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu({ name, email, role, avatarUrl, onLogout, onNavigate }: UserMenuProps): ReactNode {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function go(to: string) {
    setOpen(false);
    onNavigate?.(to);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-lg p-1.5",
          "hover:bg-bg-tertiary",
          "transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        )}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-subtle text-xs font-semibold text-brand-primary">
            {getInitials(name)}
          </div>
        )}
        <div className="hidden text-left md:block">
          <div className="text-sm font-medium text-text-primary">{name}</div>
          {role && <div className="text-xs text-text-tertiary">{role}</div>}
        </div>
        <ChevronDown size={14} className={cn("hidden text-text-tertiary transition-transform md:block", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-border-default bg-bg-primary shadow-elevation-lg"
        >
          <div className="border-b border-border-default px-3 py-2">
            <div className="text-sm font-medium text-text-primary">{name}</div>
            {email && <div className="truncate text-xs text-text-tertiary">{email}</div>}
          </div>
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => go("/profile")}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary"
            >
              <User size={16} /> Profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => go("/settings")}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary"
            >
              <Settings size={16} /> Settings
            </button>
            {onLogout && (
              <>
                <div className="my-1 border-t border-border-default" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-bg-tertiary"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}