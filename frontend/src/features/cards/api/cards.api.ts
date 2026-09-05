import { apiGet, apiPut, apiDelete } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedResponse } from "@/shared/types";
import type { CardSummary, UpdateCardPayload } from "../types";

export async function getCardsApi(
  params?: Record<string, unknown>,
): Promise<PaginatedResponse<CardSummary>> {
  return apiGet<PaginatedResponse<CardSummary>>(API_ENDPOINTS.CARDS.BASE, params);
}

export async function getCardApi(id: string): Promise<CardSummary> {
  return apiGet<CardSummary>(API_ENDPOINTS.CARDS.BY_ID(id));
}

export async function updateCardApi(id: string, payload: UpdateCardPayload): Promise<CardSummary> {
  return apiPut<CardSummary>(API_ENDPOINTS.CARDS.BY_ID(id), payload);
}

export async function freezeCardApi(id: string): Promise<CardSummary> {
  return apiPut<CardSummary>(API_ENDPOINTS.CARDS.FREEZE(id), {});
}

export async function unfreezeCardApi(id: string): Promise<CardSummary> {
  return apiPut<CardSummary>(API_ENDPOINTS.CARDS.UNFREEZE(id), {});
}

export async function blockCardApi(id: string): Promise<CardSummary> {
  return apiPut<CardSummary>(API_ENDPOINTS.CARDS.BLOCK(id), {});
}

export async function cancelCardApi(id: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.CARDS.BY_ID(id));
}
