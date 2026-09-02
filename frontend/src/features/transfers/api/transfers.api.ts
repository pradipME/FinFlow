import { apiGet, apiPost, apiPut, apiDelete } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type {
  TransferTemplate,
  ScheduledTransfer,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  CreateScheduledTransferPayload,
} from "../types";

export async function getTemplatesApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<TransferTemplate>> {
  return apiGet<PaginatedResponse<TransferTemplate>>(API_ENDPOINTS.TRANSFERS.TEMPLATES, params);
}

export async function getTemplateApi(id: string): Promise<TransferTemplate> {
  return apiGet<TransferTemplate>(API_ENDPOINTS.TRANSFERS.TEMPLATE_BY_ID(id));
}

export async function createTemplateApi(payload: CreateTemplatePayload): Promise<TransferTemplate> {
  return apiPost<TransferTemplate>(API_ENDPOINTS.TRANSFERS.TEMPLATES, payload);
}

export async function updateTemplateApi(
  id: string,
  payload: UpdateTemplatePayload,
): Promise<TransferTemplate> {
  return apiPut<TransferTemplate>(API_ENDPOINTS.TRANSFERS.TEMPLATE_BY_ID(id), payload);
}

export async function deleteTemplateApi(id: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.TRANSFERS.TEMPLATE_BY_ID(id));
}

export async function getScheduledTransfersApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<ScheduledTransfer>> {
  return apiGet<PaginatedResponse<ScheduledTransfer>>(API_ENDPOINTS.TRANSFERS.SCHEDULED, params);
}

export async function getScheduledTransferApi(id: string): Promise<ScheduledTransfer> {
  return apiGet<ScheduledTransfer>(API_ENDPOINTS.TRANSFERS.SCHEDULED_BY_ID(id));
}

export async function createScheduledTransferApi(
  payload: CreateScheduledTransferPayload,
): Promise<ScheduledTransfer> {
  return apiPost<ScheduledTransfer>(API_ENDPOINTS.TRANSFERS.SCHEDULED, payload);
}

export async function pauseScheduledTransferApi(id: string): Promise<ScheduledTransfer> {
  return apiPut<ScheduledTransfer>(API_ENDPOINTS.TRANSFERS.PAUSE(id), {});
}

export async function resumeScheduledTransferApi(id: string): Promise<ScheduledTransfer> {
  return apiPut<ScheduledTransfer>(API_ENDPOINTS.TRANSFERS.RESUME(id), {});
}

export async function cancelScheduledTransferApi(id: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.TRANSFERS.SCHEDULED_BY_ID(id));
}
