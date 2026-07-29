import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getMyAccountsApi,
  getAccountApi,
  createAccountApi,
  updateAccountApi,
  changeStatusApi,
  closeAccountApi,
  getStatusHistoryApi,
  placeHoldApi,
  releaseHoldApi,
  getActiveHoldsApi,
} from "../api";
import type {
  CreateAccountPayload,
  UpdateAccountPayload,
  ChangeStatusPayload,
  PlaceHoldPayload,
} from "../types";

export function useAccounts(
  params?: { page?: number; size?: number; accountType?: string; status?: string },
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNTS, params],
    queryFn: () => getMyAccountsApi(params),
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNT_DETAIL(id),
    queryFn: () => getAccountApi(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => createAccountApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

export function useUpdateAccount(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => updateAccountApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

export function useChangeStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangeStatusPayload) => changeStatusApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_HISTORY(id) });
    },
  });
}

export function useCloseAccount(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => closeAccountApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_HISTORY(id) });
    },
  });
}

export function useStatusHistory(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNT_HISTORY(id),
    queryFn: () => getStatusHistoryApi(id),
    enabled: !!id,
  });
}

export function usePlaceHold(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlaceHoldPayload) => placeHoldApi(accountId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_DETAIL(accountId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_HOLDS(accountId) });
    },
  });
}

export function useReleaseHold(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (holdId: string) => releaseHoldApi(accountId, holdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_DETAIL(accountId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT_HOLDS(accountId) });
    },
  });
}

export function useActiveHolds(accountId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNT_HOLDS(accountId),
    queryFn: () => getActiveHoldsApi(accountId),
    enabled: !!accountId,
  });
}
