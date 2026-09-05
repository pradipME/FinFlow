import { apiGet, apiPost } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type {
  TransactionSummary,
  TransactionDetail,
  WithdrawalPayload,
  TransferPayload,
  MobilePaymentPayload,
} from "../types";

export async function getMyTransactionsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<TransactionSummary>> {
  return apiGet<PaginatedResponse<TransactionSummary>>(API_ENDPOINTS.TRANSACTIONS.BASE, params);
}

export async function getTransactionApi(id: string): Promise<TransactionDetail> {
  return apiGet<TransactionDetail>(API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
}

export async function createWithdrawalApi(payload: WithdrawalPayload): Promise<TransactionDetail> {
  return apiPost<TransactionDetail>(API_ENDPOINTS.TRANSACTIONS.WITHDRAWAL, payload);
}

export async function createTransferApi(payload: TransferPayload): Promise<TransactionDetail> {
  return apiPost<TransactionDetail>(API_ENDPOINTS.TRANSACTIONS.TRANSFER, payload);
}

export async function createPaymentApi(payload: MobilePaymentPayload): Promise<TransactionDetail> {
  return apiPost<TransactionDetail>(API_ENDPOINTS.TRANSACTIONS.PAY, payload);
}

export async function cancelTransactionApi(id: string): Promise<TransactionDetail> {
  return apiPost<TransactionDetail>(API_ENDPOINTS.TRANSACTIONS.CANCEL(id));
}
