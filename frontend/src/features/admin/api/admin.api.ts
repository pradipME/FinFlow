import { apiGet } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type { AdminAuditLog, AdminDashboardStats, AdminUserSummary } from "../types";

export async function getAdminDashboardApi(): Promise<AdminDashboardStats> {
  return apiGet<AdminDashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD);
}

export async function getAdminAuditLogsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminAuditLog>> {
  return apiGet<PaginatedResponse<AdminAuditLog>>(API_ENDPOINTS.ADMIN.AUDIT_LOGS, params);
}

export async function getAdminUsersApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminUserSummary>> {
  return apiGet<PaginatedResponse<AdminUserSummary>>(API_ENDPOINTS.ADMIN.USERS, params);
}
