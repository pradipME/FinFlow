import { apiPost } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/constants";
import type { LoginPayload, RegisterPayload, AuthTokens } from "../types";

interface LoginResponse extends AuthTokens {
  issuedAt: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  status: string;
  createdAt: string;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiPost<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  return apiPost<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    email: payload.email,
    username: payload.username,
    password: payload.password,
    phoneNumber: payload.phoneNumber || undefined,
    termsAccepted: payload.termsAccepted,
  });
}

export async function refreshApi(refreshToken: string): Promise<AuthTokens> {
  return apiPost<AuthTokens>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
}

export async function revokeApi(refreshToken: string): Promise<{ revoked: boolean }> {
  return apiPost<{ revoked: boolean }>(API_ENDPOINTS.AUTH.REVOKE, { refreshToken });
}