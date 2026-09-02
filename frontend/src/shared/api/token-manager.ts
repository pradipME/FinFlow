/**
 * Token Manager — Single source of truth for auth tokens.
 *
 * Access token: in-memory only (never persisted).
 * Refresh token: localStorage when "remember me" is enabled (survives
 * browser restarts), sessionStorage otherwise (survives reloads in the
 * current tab only).
 *
 * Both the AuthContext and Axios interceptors read/write through
 * this module to maintain one coordinated token lifecycle.
 */
import { storage } from "@/shared/lib/storage";

const REFRESH_TOKEN_KEY = "refresh_token";
const PREFIX = "finflow:";

let accessToken: string | null = null;

function readSessionRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(PREFIX + REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export const tokenManager = {
  getAccessToken(): string | null {
    return accessToken;
  },

  setAccessToken(token: string): void {
    accessToken = token;
  },

  getRefreshToken(): string | null {
    const persistent = storage.get<string>(REFRESH_TOKEN_KEY);
    if (persistent != null) return persistent;
    return readSessionRefreshToken();
  },

  setRefreshToken(token: string, persistent = true): void {
    this.clearRefreshToken();
    if (persistent) {
      storage.set(REFRESH_TOKEN_KEY, token);
    } else {
      try {
        sessionStorage.setItem(PREFIX + REFRESH_TOKEN_KEY, token);
      } catch {
        storage.set(REFRESH_TOKEN_KEY, token);
      }
    }
  },

  setTokens(access: string, refresh: string, persistent = true): void {
    accessToken = access;
    this.setRefreshToken(refresh, persistent);
  },

  clearRefreshToken(): void {
    storage.remove(REFRESH_TOKEN_KEY);
    try {
      sessionStorage.removeItem(PREFIX + REFRESH_TOKEN_KEY);
    } catch {
      // sessionStorage unavailable
    }
  },

  clearTokens(): void {
    accessToken = null;
    this.clearRefreshToken();
  },

  hasRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  },
};