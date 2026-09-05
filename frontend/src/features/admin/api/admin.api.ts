import { apiGet, apiPost } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type {
  AccountType,
  AdminAccountSummary,
  AdminAuditLog,
  AdminCardSummary,
  AdminDashboardStats,
  AdminRequest,
  AdminTransactionSummary,
  AdminUserDetails,
  AdminUserSummary,
  CreateCustomerPayload,
  FundAccountPayload,
} from "../types";

const adminBase = (path: string) => `/admin${path}`;

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

// ---------------- Customers ----------------

export async function getAdminUserDetailsApi(userId: string): Promise<AdminUserDetails> {
  return apiGet<AdminUserDetails>(adminBase(`/users/${userId}`));
}

export async function getAdminUserCardsApi(
  userId: string,
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminCardSummary>> {
  return apiGet<PaginatedResponse<AdminCardSummary>>(adminBase(`/users/${userId}/cards`), params);
}

export async function createAdminCustomerApi(payload: CreateCustomerPayload): Promise<AdminUserSummary> {
  return apiPost<AdminUserSummary>(adminBase("/customers"), payload);
}

// ---------------- Accounts ----------------

export async function getAdminAccountsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminAccountSummary>> {
  return apiGet<PaginatedResponse<AdminAccountSummary>>(adminBase("/accounts"), params);
}

export async function createAdminAccountApi(payload: {
  customerId: string;
  accountType: AccountType;
  currency?: string;
  nickname?: string;
}): Promise<AdminAccountSummary> {
  return apiPost<AdminAccountSummary>(adminBase("/accounts"), payload);
}

export async function fundAdminAccountApi(
  accountId: string,
  payload: FundAccountPayload,
): Promise<Record<string, unknown>> {
  return apiPost<Record<string, unknown>>(adminBase(`/accounts/${accountId}/fund`), payload);
}

// ---------------- Cards ----------------

export async function getAdminCardsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminCardSummary>> {
  return apiGet<PaginatedResponse<AdminCardSummary>>(adminBase("/cards"), params);
}

// ---------------- Transactions ----------------

export async function getAdminTransactionsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminTransactionSummary>> {
  return apiGet<PaginatedResponse<AdminTransactionSummary>>(adminBase("/transactions"), params);
}

// ---------------- Requests ----------------

export async function getAdminRequestsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<AdminRequest>> {
  return apiGet<PaginatedResponse<AdminRequest>>(adminBase("/requests"), params);
}

export async function reviewAdminRequestApi(
  requestId: string,
  action: "approve" | "reject",
  rejectionReason?: string,
): Promise<AdminRequest> {
  return apiPost<AdminRequest>(
    adminBase(`/requests/${requestId}/${action}`),
    action === "reject" ? { rejectionReason } : undefined,
  );
}