import { apiGet, apiPost } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type { CreateCustomerRequestPayload, CustomerRequest } from "../types";

export async function getMyRequestsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<CustomerRequest>> {
  return apiGet<PaginatedResponse<CustomerRequest>>(API_ENDPOINTS.REQUESTS.MY, params);
}

export async function createRequestApi(payload: CreateCustomerRequestPayload): Promise<CustomerRequest> {
  return apiPost<CustomerRequest>(API_ENDPOINTS.REQUESTS.BASE, payload);
}