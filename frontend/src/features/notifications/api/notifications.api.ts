import { apiGet, apiPost, apiPatch, apiDelete } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type { Notification } from "../types";

export async function getNotificationsApi(params?: Record<string, unknown>): Promise<PaginatedResponse<Notification>> {
  return apiGet<PaginatedResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.BASE, params);
}

export async function getNotificationApi(id: string): Promise<Notification> {
  return apiGet<Notification>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
}

export async function getUnreadCountApi(): Promise<number> {
  return apiGet<number>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
}

export async function markNotificationReadApi(id: string, isRead: boolean): Promise<Notification> {
  return apiPatch<Notification>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id) + "/read", { isRead });
}

export async function markAllNotificationsReadApi(): Promise<void> {
  return apiPost<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
}

export async function deleteNotificationApi(id: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
}
