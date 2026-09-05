import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { createRequestApi, getMyRequestsApi } from "../api";

export function useMyRequests(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REQUESTS, params],
    queryFn: () => getMyRequestsApi(params),
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRequestApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS });
    },
  });
}

export type { CreateCustomerRequestPayload } from "../types";