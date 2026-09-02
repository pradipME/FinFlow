import { apiGet, apiPost, apiPut, apiDelete } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type { SavingsGoal, CreateSavingsGoalPayload, UpdateSavingsGoalPayload, DepositPayload } from "../types";

export async function getSavingsGoalsApi(params?: Record<string, unknown>): Promise<PaginatedResponse<SavingsGoal>> {
  return apiGet<PaginatedResponse<SavingsGoal>>(API_ENDPOINTS.SAVINGS.BASE, params);
}

export async function getSavingsGoalApi(id: string): Promise<SavingsGoal> {
  return apiGet<SavingsGoal>(API_ENDPOINTS.SAVINGS.BY_ID(id));
}

export async function createSavingsGoalApi(payload: CreateSavingsGoalPayload): Promise<SavingsGoal> {
  return apiPost<SavingsGoal>(API_ENDPOINTS.SAVINGS.BASE, payload);
}

export async function updateSavingsGoalApi(id: string, payload: UpdateSavingsGoalPayload): Promise<SavingsGoal> {
  return apiPut<SavingsGoal>(API_ENDPOINTS.SAVINGS.BY_ID(id), payload);
}

export async function depositToSavingsGoalApi(id: string, payload: DepositPayload): Promise<SavingsGoal> {
  return apiPost<SavingsGoal>(API_ENDPOINTS.SAVINGS.DEPOSIT(id), payload);
}

export async function pauseSavingsGoalApi(id: string): Promise<SavingsGoal> {
  return apiPut<SavingsGoal>(API_ENDPOINTS.SAVINGS.PAUSE(id), {});
}

export async function resumeSavingsGoalApi(id: string): Promise<SavingsGoal> {
  return apiPut<SavingsGoal>(API_ENDPOINTS.SAVINGS.RESUME(id), {});
}

export async function cancelSavingsGoalApi(id: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.SAVINGS.BY_ID(id));
}
