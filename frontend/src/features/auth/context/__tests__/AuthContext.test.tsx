import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { tokenManager } from "@/shared/api/token-manager";

vi.mock("../../api", () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  refreshApi: vi.fn(),
  revokeApi: vi.fn(),
}));

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

describe("AuthProvider", () => {
  beforeEach(() => {
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  it("completes loading as not authenticated when no refresh token exists", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("throws when used outside AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
    consoleSpy.mockRestore();
  });

  it("login sets user and tokens", async () => {
    const { loginApi } = await import("../../api");
    vi.mocked(loginApi).mockResolvedValue({
      accessToken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsImVtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTcwMDAwMDAwMH0.abc123",
      refreshToken: "test-refresh-token",
      tokenType: "Bearer",
      expiresIn: 900,
      // added issuedAt for LoginResponse compatibility
      issuedAt: new Date().toISOString(),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login({
        identifier: "test@example.com",
        password: "password",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("test@example.com");
    expect(result.current.user?.username).toBe("testuser");
  });

  it("logout clears user and tokens", async () => {
    const { revokeApi } = await import("../../api");
    vi.mocked(revokeApi).mockResolvedValue({ revoked: true });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("restores a session from a persisted refresh token on mount (refresh must not log out)", async () => {
    const { refreshApi } = await import("../../api");
    vi.mocked(refreshApi).mockResolvedValue({
      accessToken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsInJvbGVzIjpbIkNVU1RPTUVSIl0sImlhdCI6MTcwMDAwMDAwMH0.abc123",
      refreshToken: "persisted-refresh-token",
      tokenType: "Bearer",
      expiresIn: 900,
    });

    tokenManager.setTokens(
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsInJvbGVzIjpbIkNVU1RPTUVSIl0sImlhdCI6MTcwMDAwMDAwMH0.abc123",
      "persisted-refresh-token",
    );

    expect(tokenManager.hasRefreshToken()).toBe(true);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("test@example.com");
    expect(result.current.user?.roles).toContain("CUSTOMER");
  });

  it("falls back to a logged-out state when the persisted refresh token is invalid", async () => {
    const { refreshApi } = await import("../../api");
    vi.mocked(refreshApi).mockRejectedValue(new Error("invalid refresh token"));

    tokenManager.setTokens("access-token", "expired-refresh-token");

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});