import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getNotificationsApi,
  getNotificationApi,
  getUnreadCountApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from "../api";

export function useNotifications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => getNotificationsApi(params),
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => getNotificationApi(id),
    enabled: !!id,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATION_UNREAD_COUNT,
    queryFn: getUnreadCountApi,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      markNotificationReadApi(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_UNREAD_COUNT });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_UNREAD_COUNT });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_UNREAD_COUNT });
    },
  });
}
