/**
 * Token Manager — Single source of truth for auth tokens.
 *
 * Access token: in-memory only (never persisted).
 * Refresh token: localStorage (survives page reloads).
 *
 * Both the AuthContext and Axios interceptors read/write through
 * this module to maintain one coordinated token lifecycle.
 */
import { storage } from "@/shared/lib/storage";

const REFRESH_TOKEN_KEY = "refresh_token";

let accessToken: string | null = null;

export const tokenManager = {
  getAccessToken(): string | null {
    return accessToken;
  },

  setAccessToken(token: string): void {
    accessToken = token;
  },

  getRefreshToken(): string | null {
    return storage.get<string>(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    storage.set(REFRESH_TOKEN_KEY, token);
  },

  setTokens(access: string, refresh: string): void {
    accessToken = access;
    storage.set(REFRESH_TOKEN_KEY, refresh);
  },

  clearTokens(): void {
    accessToken = null;
    storage.remove(REFRESH_TOKEN_KEY);
  },

  hasRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  },
};