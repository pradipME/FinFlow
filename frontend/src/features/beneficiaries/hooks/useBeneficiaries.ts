import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getMyBeneficiariesApi,
  getBeneficiaryApi,
  createBeneficiaryApi,
  updateBeneficiaryApi,
  deleteBeneficiaryApi,
  changeBeneficiaryStatusApi,
} from "../api";
import type { CreateBeneficiaryPayload, UpdateBeneficiaryPayload } from "../types";

export function useBeneficiaries(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BENEFICIARIES, params],
    queryFn: () => getMyBeneficiariesApi(params),
  });
}

export function useBeneficiary(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BENEFICIARY_DETAIL(id),
    queryFn: () => getBeneficiaryApi(id),
    enabled: !!id,
  });
}

export function useCreateBeneficiary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBeneficiaryPayload) => createBeneficiaryApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BENEFICIARIES });
    },
  });
}

export function useUpdateBeneficiary(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBeneficiaryPayload) => updateBeneficiaryApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BENEFICIARY_DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BENEFICIARIES });
    },
  });
}

export function useDeleteBeneficiary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBeneficiaryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BENEFICIARIES });
    },
  });
}

export function useChangeBeneficiaryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      changeBeneficiaryStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BENEFICIARIES });
    },
  });
}
