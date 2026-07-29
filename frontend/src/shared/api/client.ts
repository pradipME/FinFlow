import axios from "axios";
import type { ApiResponse } from "@/shared/types";
import { setupInterceptors } from "./interceptors";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

setupInterceptors(apiClient);

export { apiClient };

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
  if (!data.success) throw new Error(data.error?.message ?? "Request failed");
  return data.data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  if (!data.success) throw new Error(data.error?.message ?? "Request failed");
  return data.data;
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.put<ApiResponse<T>>(url, body);
  if (!data.success) throw new Error(data.error?.message ?? "Request failed");
  return data.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  if (!data.success) throw new Error(data.error?.message ?? "Request failed");
  return data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<ApiResponse<T>>(url);
  if (!data.success) throw new Error(data.error?.message ?? "Request failed");
  return data.data;
}
