/**
 * NotificationButton — Header icon button for notifications.
 *
 * Shows a bell icon with an optional unread count badge.
 */
import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/shared/utils";

interface NotificationButtonProps {
  /** Unread notification count (0 = no badge) */
  count?: number;
  /** Click handler */
  onClick?: () => void;
}

export function NotificationButton({ count = 0, onClick }: NotificationButtonProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-lg p-2",
        "text-text-tertiary",
        "hover:bg-bg-tertiary hover:text-text-primary",
        "transition-colors duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
      )}
      title="Notifications"
    >
      <Bell size={20} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
