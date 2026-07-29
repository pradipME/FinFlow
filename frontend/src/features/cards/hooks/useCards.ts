import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { getCardsApi, getCardApi, createCardApi, freezeCardApi, unfreezeCardApi, blockCardApi, cancelCardApi } from "../api";
import type { CreateCardPayload } from "../types";

export function useCards(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CARDS, params],
    queryFn: () => getCardsApi(params),
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CARD_DETAIL(id),
    queryFn: () => getCardApi(id),
    enabled: !!id,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCardPayload) => createCardApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CARDS });
    },
  });
}

export function useFreezeCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => freezeCardApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CARDS });
    },
  });
}

export function useUnfreezeCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unfreezeCardApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CARDS });
    },
  });
}

export function useBlockCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blockCardApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CARDS });
    },
  });
}

export function useCancelCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelCardApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CARDS });
    },
  });
}
