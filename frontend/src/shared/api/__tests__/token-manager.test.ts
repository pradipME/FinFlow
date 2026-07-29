import { describe, it, expect, beforeEach } from "vitest";
import { tokenManager } from "@/shared/api/token-manager";

describe("tokenManager", () => {
  beforeEach(() => {
    tokenManager.clearTokens();
  });

  it("starts with no tokens", () => {
    expect(tokenManager.getAccessToken()).toBeNull();
    expect(tokenManager.getRefreshToken()).toBeNull();
    expect(tokenManager.hasRefreshToken()).toBe(false);
  });

  it("sets and gets access token", () => {
    tokenManager.setAccessToken("access-123");
    expect(tokenManager.getAccessToken()).toBe("access-123");
  });

  it("sets and gets refresh token (persisted in localStorage)", () => {
    tokenManager.setRefreshToken("refresh-456");
    expect(tokenManager.getRefreshToken()).toBe("refresh-456");
    expect(tokenManager.hasRefreshToken()).toBe(true);
  });

  it("sets both tokens atomically", () => {
    tokenManager.setTokens("access-789", "refresh-012");
    expect(tokenManager.getAccessToken()).toBe("access-789");
    expect(tokenManager.getRefreshToken()).toBe("refresh-012");
  });

  it("clears all tokens", () => {
    tokenManager.setTokens("access", "refresh");
    tokenManager.clearTokens();
    expect(tokenManager.getAccessToken()).toBeNull();
    expect(tokenManager.getRefreshToken()).toBeNull();
    expect(tokenManager.hasRefreshToken()).toBe(false);
  });

  it("clears access token without affecting refresh token", () => {
    tokenManager.setTokens("access", "refresh");
    tokenManager.setAccessToken("");
    expect(tokenManager.getRefreshToken()).toBe("refresh");
  });
});