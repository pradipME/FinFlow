import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { getAdminDashboardApi, getAdminAuditLogsApi, getAdminUsersApi } from "../api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_DASHBOARD,
    queryFn: getAdminDashboardApi,
  });
}

export function useAdminAuditLogs(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_AUDIT_LOGS, params],
    queryFn: () => getAdminAuditLogsApi(params),
  });
}

export function useAdminUsers(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_USERS, params],
    queryFn: () => getAdminUsersApi(params),
  });
}
