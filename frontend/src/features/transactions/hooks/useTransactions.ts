import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getMyTransactionsApi,
  getTransactionApi,
  createDepositApi,
  createWithdrawalApi,
  createTransferApi,
  cancelTransactionApi,
} from "../api";
import type {
  DepositPayload,
  WithdrawalPayload,
  TransferPayload,
} from "../types";

export function useTransactions(
  params?: Record<string, unknown>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS, params],
    queryFn: () => getMyTransactionsApi(params),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTION_DETAIL(id),
    queryFn: () => getTransactionApi(id),
    enabled: !!id,
  });
}

export function useCreateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepositPayload) => createDepositApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WithdrawalPayload) => createWithdrawalApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransferPayload) => createTransferApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
    },
  });
}

export function useCancelTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelTransactionApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTION_DETAIL(id) });
    },
  });
}
