import { apiGet, apiPost, apiPatch } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type {
  AccountSummary,
  AccountDetail,
  StatusHistoryEntry,
  Hold,
  UpdateAccountPayload,
  ChangeStatusPayload,
  PlaceHoldPayload,
} from "../types";

export async function getMyAccountsApi(
  params?: Record<string, unknown> & { accountType?: string; status?: string },
): Promise<PaginatedResponse<AccountSummary>> {
  return apiGet<PaginatedResponse<AccountSummary>>(API_ENDPOINTS.ACCOUNTS.BASE, params as Record<string, unknown>);
}

export async function getAccountApi(id: string): Promise<AccountDetail> {
  return apiGet<AccountDetail>(API_ENDPOINTS.ACCOUNTS.BY_ID(id));
}

export async function updateAccountApi(
  id: string,
  payload: UpdateAccountPayload,
): Promise<AccountDetail> {
  return apiPatch<AccountDetail>(API_ENDPOINTS.ACCOUNTS.BY_ID(id), payload);
}

export async function changeStatusApi(
  id: string,
  payload: ChangeStatusPayload,
): Promise<AccountDetail> {
  return apiPost<AccountDetail>(API_ENDPOINTS.ACCOUNTS.STATUS(id), payload);
}

export async function closeAccountApi(id: string): Promise<AccountDetail> {
  return apiPost<AccountDetail>(API_ENDPOINTS.ACCOUNTS.CLOSE(id));
}

export async function getStatusHistoryApi(
  id: string,
): Promise<StatusHistoryEntry[]> {
  return apiGet<StatusHistoryEntry[]>(API_ENDPOINTS.ACCOUNTS.HISTORY(id));
}

export async function placeHoldApi(
  accountId: string,
  payload: PlaceHoldPayload,
): Promise<Hold> {
  return apiPost<Hold>(API_ENDPOINTS.ACCOUNTS.HOLDS(accountId), payload);
}

export async function releaseHoldApi(
  accountId: string,
  holdId: string,
): Promise<Hold> {
  return apiPost<Hold>(API_ENDPOINTS.ACCOUNTS.RELEASE_HOLD(accountId, holdId));
}

export async function getActiveHoldsApi(accountId: string): Promise<Hold[]> {
  return apiGet<Hold[]>(API_ENDPOINTS.ACCOUNTS.HOLDS(accountId));
}
