import { Check, Trash2 } from "lucide-react";
import { Button } from "@/shared/components";
import { formatRelativeTime } from "@/shared/lib/format";
import type { Notification } from "../types";
import { NotificationTypeIcon } from "./NotificationTypeIcon";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-sm">
      <div className="mt-0.5 shrink-0">
        <NotificationTypeIcon type={notification.notificationType} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={`text-sm ${notification.isRead ? "font-normal text-gray-700" : "font-semibold text-gray-900"}`}>
          {notification.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{notification.message}</p>
        <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(notification.createdAt)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!notification.isRead && onMarkRead && (
          <Button
            variant="outline"
            size="xs"
            leftIcon={<Check size={14} />}
            onClick={() => onMarkRead(notification.id)}
          >
            Read
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="xs"
            leftIcon={<Trash2 size={14} />}
            onClick={() => onDelete(notification.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
