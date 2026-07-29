import { apiGet, apiPost, apiPatch, apiDelete } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type { Beneficiary, CreateBeneficiaryPayload, UpdateBeneficiaryPayload } from "../types";

export async function getMyBeneficiariesApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<Beneficiary>> {
  return apiGet<PaginatedResponse<Beneficiary>>(API_ENDPOINTS.BENEFICIARIES.BASE, params);
}

export async function getBeneficiaryApi(id: string): Promise<Beneficiary> {
  return apiGet<Beneficiary>(API_ENDPOINTS.BENEFICIARIES.BY_ID(id));
}

export async function createBeneficiaryApi(payload: CreateBeneficiaryPayload): Promise<Beneficiary> {
  return apiPost<Beneficiary>(API_ENDPOINTS.BENEFICIARIES.BASE, payload);
}

export async function updateBeneficiaryApi(
  id: string,
  payload: UpdateBeneficiaryPayload,
): Promise<Beneficiary> {
  return apiPatch<Beneficiary>(API_ENDPOINTS.BENEFICIARIES.BY_ID(id), payload);
}

export async function deleteBeneficiaryApi(id: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.BENEFICIARIES.BY_ID(id));
}

export async function changeBeneficiaryStatusApi(
  id: string,
  status: string,
): Promise<Beneficiary> {
  return apiPost<Beneficiary>(
    `${API_ENDPOINTS.BENEFICIARIES.BY_ID(id)}/status?status=${status}`,
  );
}
