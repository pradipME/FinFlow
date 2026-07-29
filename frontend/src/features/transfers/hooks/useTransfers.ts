import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {
  getTemplatesApi,
  getTemplateApi,
  createTemplateApi,
  updateTemplateApi,
  deleteTemplateApi,
  getScheduledTransfersApi,
  getScheduledTransferApi,
  createScheduledTransferApi,
  pauseScheduledTransferApi,
  resumeScheduledTransferApi,
  cancelScheduledTransferApi,
} from "../api";
import type {
  CreateTemplatePayload,
  UpdateTemplatePayload,
  CreateScheduledTransferPayload,
} from "../types";

export function useTemplates(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSFERS_TEMPLATES, params],
    queryFn: () => getTemplatesApi(params),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSFER_TEMPLATE_DETAIL(id),
    queryFn: () => getTemplateApi(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => createTemplateApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_TEMPLATES });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTemplatePayload }) =>
      updateTemplateApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_TEMPLATES });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTemplateApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_TEMPLATES });
    },
  });
}

export function useScheduledTransfers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSFERS_SCHEDULED, params],
    queryFn: () => getScheduledTransfersApi(params),
  });
}

export function useScheduledTransfer(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SCHEDULED_TRANSFER_DETAIL(id),
    queryFn: () => getScheduledTransferApi(id),
    enabled: !!id,
  });
}

export function useCreateScheduledTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateScheduledTransferPayload) => createScheduledTransferApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_SCHEDULED });
    },
  });
}

export function usePauseScheduledTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pauseScheduledTransferApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_SCHEDULED });
    },
  });
}

export function useResumeScheduledTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeScheduledTransferApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_SCHEDULED });
    },
  });
}

export function useCancelScheduledTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelScheduledTransferApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSFERS_SCHEDULED });
    },
  });
}
