import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { NotificationItem } from "../components";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "../hooks";

export function NotificationsPage() {
  const [page, setPage] = useState(0);
  const size = 20;

  const { data, isLoading, error, refetch } = useNotifications({ page, size });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleMarkAllRead() {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Notifications" subtitle="Manage your notifications" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Notifications" subtitle="Manage your notifications" />
        <ErrorState
          title="Failed to load notifications"
          description="We couldn't fetch your notifications right now."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay on top of account activity and alerts"
        actions={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck size={16} />}
              isLoading={markAllRead.isPending}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          description="No notifications yet. We'll let you know when something happens."
        />
      ) : (
        <div className="space-y-4">
          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-primary" />
              <p className="text-sm text-text-tertiary">
                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
          )}

          <div className="space-y-2.5">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={(id) => markRead.mutate({ id, isRead: true })}
                onDelete={(id) =>
                  deleteNotification.mutate(id, {
                    onSuccess: () => toast.success("Notification deleted"),
                  })
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
              <p className="text-sm text-text-tertiary">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ChevronLeft size={15} />}
                  isDisabled={data?.first ?? true}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ChevronRight size={15} />}
                  isDisabled={data?.last ?? true}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}