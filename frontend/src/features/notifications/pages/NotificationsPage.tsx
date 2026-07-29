import { useState } from "react";
import { CheckCheck } from "lucide-react";
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

  const { data, isLoading, error } = useNotifications({ page, size });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Notifications" subtitle="Manage your notifications" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="Notifications" subtitle="Manage your notifications" />
        <ErrorState description="Failed to load notifications" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        subtitle="Manage your notifications"
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCheck size={16} />}
            isLoading={markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all read
          </Button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up!" />
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={(id) => markRead.mutate({ id, isRead: true })}
                onDelete={(id) => deleteNotification.mutate(id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                isDisabled={data?.first ?? true}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {(data?.number ?? 0) + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                isDisabled={data?.last ?? true}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
