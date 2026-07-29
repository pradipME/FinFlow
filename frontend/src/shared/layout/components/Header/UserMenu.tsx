/**
 * UserMenu — Header user avatar + dropdown trigger.
 *
 * Shows the user's initials, full name, and role.
 * Clicking could open a dropdown menu (future: account, logout).
 */
import type { ReactNode } from "react";
import { LogOut, Settings, User } from "lucide-react";
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
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu({ name, email, role, onLogout }: UserMenuProps): ReactNode {
  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-lg p-1.5",
          "hover:bg-bg-tertiary",
          "transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-subtle text-xs font-semibold text-brand-primary">
          {getInitials(name)}
        </div>
        <div className="hidden text-left md:block">
          <div className="text-sm font-medium text-text-primary">{name}</div>
          {role && <div className="text-xs text-text-tertiary">{role}</div>}
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "invisible absolute right-0 top-full mt-1 w-56",
          "rounded-xl border border-border-default",
          "bg-bg-primary shadow-lg",
          "opacity-0 transition-all duration-150",
          "group-hover:visible group-hover:opacity-100",
        )}
      >
        <div className="border-b border-border-default px-3 py-2">
          <div className="text-sm font-medium text-text-primary">{name}</div>
          {email && <div className="text-xs text-text-tertiary">{email}</div>}
        </div>
        <div className="py-1">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary"
          >
            <User size={16} /> Profile
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary"
          >
            <Settings size={16} /> Settings
          </button>
          {onLogout && (
            <>
              <div className="my-1 border-t border-border-default" />
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-bg-tertiary"
              >
                <LogOut size={16} /> Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
