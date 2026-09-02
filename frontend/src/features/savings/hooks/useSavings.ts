import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { getSavingsGoalsApi, getSavingsGoalApi, createSavingsGoalApi, depositToSavingsGoalApi, pauseSavingsGoalApi, resumeSavingsGoalApi, cancelSavingsGoalApi } from "../api";
import type { CreateSavingsGoalPayload, DepositPayload } from "../types";

export function useSavingsGoals(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.SAVINGS, params],
    queryFn: () => getSavingsGoalsApi(params),
  });
}

export function useSavingsGoal(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SAVINGS_DETAIL(id),
    queryFn: () => getSavingsGoalApi(id),
    enabled: !!id,
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSavingsGoalPayload) => createSavingsGoalApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS });
    },
  });
}

export function useDepositToSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DepositPayload }) =>
      depositToSavingsGoalApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS });
    },
  });
}

export function usePauseSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pauseSavingsGoalApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS });
    },
  });
}

export function useResumeSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeSavingsGoalApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS });
    },
  });
}

export function useCancelSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelSavingsGoalApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVINGS });
    },
  });
}
