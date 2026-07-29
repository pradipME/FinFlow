import { apiGet, apiPatch, apiDelete, apiPut } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  UserSetting,
  UpdateSettingPayload,
  BulkUpdateSettingsPayload,
} from "../types";

export async function getSettingsApi(): Promise<UserSetting[]> {
  return apiGet<UserSetting[]>(API_ENDPOINTS.SETTINGS.BASE);
}

export async function getSettingApi(key: string): Promise<UserSetting> {
  return apiGet<UserSetting>(API_ENDPOINTS.SETTINGS.BY_KEY(key));
}

export async function updateSettingApi(
  key: string,
  payload: UpdateSettingPayload,
): Promise<UserSetting> {
  return apiPatch<UserSetting>(API_ENDPOINTS.SETTINGS.BY_KEY(key), payload);
}

export async function bulkUpdateSettingsApi(
  payload: BulkUpdateSettingsPayload,
): Promise<UserSetting[]> {
  return apiPut<UserSetting[]>(API_ENDPOINTS.SETTINGS.BULK, payload);
}

export async function deleteSettingApi(key: string): Promise<void> {
  return apiDelete<void>(API_ENDPOINTS.SETTINGS.BY_KEY(key));
}
