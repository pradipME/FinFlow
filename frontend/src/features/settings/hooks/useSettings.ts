import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getSettingsApi,
  updateSettingApi,
  bulkUpdateSettingsApi,
} from "../api";
import type { UpdateSettingPayload, BulkUpdateSettingsPayload } from "../types";

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS,
    queryFn: () => getSettingsApi(),
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      key,
      payload,
    }: {
      key: string;
      payload: UpdateSettingPayload;
    }) => updateSettingApi(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS });
    },
  });
}

export function useBulkUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkUpdateSettingsPayload) =>
      bulkUpdateSettingsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS });
    },
  });
}
