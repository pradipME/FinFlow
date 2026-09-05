/**
 * UserMenu — User avatar + dropdown trigger.
 *
 * Rendered in the sidebar footer / header. The dropdown is portaled to
 * document.body and positioned relative to the trigger's bounding rect, so
 * it can never be clipped by the sidebar (`overflow`, stacking contexts) and
 * stays fully visible near the edges of the viewport. It opens upward when
 * there is more room above the trigger than below (default in the footer).
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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

const MENU_WIDTH = 224;
const VIEWPORT_PADDING = 8;
const MENU_GAP = 6;
const MENU_HEIGHT_ESTIMATE = 192;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface MenuPosition {
  top: number;
  left: number;
}

export function UserMenu({ name, email, role, avatarUrl, onLogout, onNavigate }: UserMenuProps): ReactNode {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef(MENU_HEIGHT_ESTIMATE);

  // Close on outside click / Escape. Checks both the trigger and the portaled
  // menu, since the menu lives outside the trigger's DOM subtree.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
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

  // Position the portaled menu relative to the trigger and keep it anchored on
  // scroll/resize. Opens upward when there is not enough room underneath.
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    function apply(menuHeight: number) {
      const trigger = rootRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < menuHeight + VIEWPORT_PADDING;

      const top = openUp
        ? rect.top - menuHeight - MENU_GAP
        : rect.bottom + MENU_GAP;

      const clampedTop = Math.max(
        VIEWPORT_PADDING,
        Math.min(top, window.innerHeight - menuHeight - VIEWPORT_PADDING),
      );

      let left = rect.right - MENU_WIDTH;
      left = Math.max(
        VIEWPORT_PADDING,
        Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING),
      );

      setPosition((prev) =>
        prev && prev.top === Math.round(clampedTop) && prev.left === Math.round(left)
          ? prev
          : { top: Math.round(clampedTop), left: Math.round(left) },
      );
    }

    // First pass uses an estimate; the mount pass below refines with the real height.
    apply(lastHeightRef.current);

    function onViewportChange() {
      apply(lastHeightRef.current);
    }
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open]);

  // Refine placement once the menu's real height is known.
  useLayoutEffect(() => {
    if (!open || !position) return;
    const menuEl = menuRef.current;
    if (!menuEl) return;
    const actualHeight = menuEl.getBoundingClientRect().height;
    if (Math.abs(actualHeight - lastHeightRef.current) < 1) return;
    lastHeightRef.current = actualHeight;

    const trigger = rootRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const openUp = window.innerHeight - rect.bottom < actualHeight + VIEWPORT_PADDING;
    const top = openUp
      ? Math.max(
          VIEWPORT_PADDING,
          Math.min(rect.top - actualHeight - MENU_GAP, window.innerHeight - actualHeight - VIEWPORT_PADDING),
        )
      : rect.bottom + MENU_GAP;
    let left = rect.right - MENU_WIDTH;
    left = Math.max(VIEWPORT_PADDING, Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING));
    setPosition((prev) =>
      prev && prev.top === Math.round(top) && prev.left === Math.round(left)
        ? prev
        : { top: Math.round(top), left: Math.round(left) },
    );
  }, [open, position]);

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
        <ChevronDown
          size={14}
          className={cn("hidden text-text-tertiary transition-transform md:block", open && "rotate-180")}
        />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed w-56 rounded-xl border border-border-default bg-bg-primary shadow-elevation-lg"
            style={{ top: position.top, left: position.left, zIndex: 1100 }}
          >
            <div className="border-b border-border-default px-3 py-2">
              <div className="text-sm font-medium text-text-primary">{name}</div>
              {role && <div className="mt-0.5 text-xs text-text-tertiary">{role}</div>}
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
          </div>,
          document.body,
        )}
    </div>
  );
}