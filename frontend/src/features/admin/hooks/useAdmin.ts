import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getAdminDashboardApi,
  getAdminAuditLogsApi,
  getAdminUsersApi,
  getAdminUserDetailsApi,
  getAdminUserCardsApi,
  createAdminCustomerApi,
  getAdminAccountsApi,
  createAdminAccountApi,
  fundAdminAccountApi,
  getAdminCardsApi,
  getAdminTransactionsApi,
  getAdminRequestsApi,
  reviewAdminRequestApi,
} from "../api";

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

export function useAdminUserDetails(userId: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_USERS, "detail", userId],
    queryFn: () => getAdminUserDetailsApi(userId!),
    enabled: !!userId,
  });
}

export function useAdminUserCards(userId: string | undefined, params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_USERS, userId, "cards", params],
    queryFn: () => getAdminUserCardsApi(userId!, params),
    enabled: !!userId,
  });
}

export function useCreateAdminCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminCustomerApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
    },
  });
}

export function useAdminAccounts(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_ACCOUNTS, params],
    queryFn: () => getAdminAccountsApi(params),
  });
}

export function useAdminCards(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_CARDS, params],
    queryFn: () => getAdminCardsApi(params),
  });
}

export function useAdminTransactions(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_TRANSACTIONS, params],
    queryFn: () => getAdminTransactionsApi(params),
  });
}

export function useAdminRequests(params?: { page?: number; size?: number; status?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_REQUESTS, params],
    queryFn: () => getAdminRequestsApi(params),
  });
}

export function useFakeAdminCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminAccountApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
    },
  });
}

export function useAdminFundAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, payload }: { accountId: string; payload: { amountCents: number; description?: string } }) =>
      fundAdminAccountApi(accountId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TRANSACTIONS });
    },
  });
}

export function useAdminReviewRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action, rejectionReason }: { requestId: string; action: "approve" | "reject"; rejectionReason?: string }) =>
      reviewAdminRequestApi(requestId, action, rejectionReason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_REQUESTS });
    },
  });
}