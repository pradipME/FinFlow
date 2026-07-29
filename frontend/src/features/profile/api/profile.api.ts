import { apiGet, apiPatch } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { UserProfile, UpdateProfilePayload } from "../types";

export async function getProfileApi(): Promise<UserProfile> {
  return apiGet<UserProfile>(API_ENDPOINTS.PROFILE.BASE);
}

export async function updateProfileApi(payload: UpdateProfilePayload): Promise<UserProfile> {
  return apiPatch<UserProfile>(API_ENDPOINTS.PROFILE.BASE, payload);
}
