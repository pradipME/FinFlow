import { Check, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { formatRelativeTime } from "@/shared/lib/format";
import type { Notification } from "../types";
import { NotificationTypeIcon } from "./NotificationTypeIcon";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  hideActions?: boolean;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  hideActions,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 overflow-hidden rounded-xl border p-4 transition-colors duration-200",
        notification.isRead
          ? "border-border-default bg-surface-primary"
          : "border-brand-primary/30 bg-brand-primary-subtle",
      )}
    >
      {!notification.isRead && (
        <span className="absolute inset-y-0 left-0 w-0.5 bg-brand-primary" aria-hidden="true" />
      )}

      <NotificationTypeIcon type={notification.notificationType} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            className={cn(
              "text-sm",
              notification.isRead
                ? "font-medium text-text-secondary"
                : "font-semibold text-text-primary",
            )}
          >
            {notification.title}
          </h3>
          {!notification.isRead && (
            <span
              className="rounded-full bg-brand-primary-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-primary"
              aria-label="Unread"
            >
              New
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-text-tertiary">{notification.message}</p>
        <p className="mt-1.5 text-xs text-text-tertiary/70">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {!hideActions && (
        <div className="flex shrink-0 flex-col gap-1.5 opacity-60 transition-opacity duration-200 group-hover:opacity-100 sm:flex-row sm:items-center">
          {!notification.isRead && onMarkRead && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="flex items-center gap-1.5 rounded-lg border border-border-default px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-brand-primary/40 hover:bg-brand-primary-subtle hover:text-brand-primary"
            >
              <Check size={13} />
              Mark read
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="flex items-center gap-1.5 rounded-lg border border-border-default px-2.5 py-1.5 text-xs font-medium text-text-tertiary transition-colors hover:border-danger/40 hover:bg-danger-subtle hover:text-danger"
            >
              <Trash2 size={13} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}