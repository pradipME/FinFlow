import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GuestRoute } from "../GuestRoute";
import { AuthProvider } from "../../context/AuthContext";
import { tokenManager } from "@/shared/api/token-manager";

vi.mock("../../api", () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  refreshApi: vi.fn(),
  revokeApi: vi.fn(),
}));

function renderGuestRoute(initialPath = "/login") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("GuestRoute", () => {
  beforeEach(() => {
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  it("renders children when not authenticated", async () => {
    renderGuestRoute();
    await vi.waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("redirects to dashboard when authenticated", async () => {
    tokenManager.setTokens(
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsImVtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTcwMDAwMDAwMH0.abc123",
      "test-refresh",
    );

    const { loginApi } = await import("../../api");
      vi.mocked(loginApi).mockResolvedValue({
        accessToken:
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsImVtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTcwMDAwMDAwMH0.abc123",
        refreshToken: "new-refresh",
        tokenType: "Bearer",
        expiresIn: 900,
        issuedAt: new Date().toISOString(),
      });

    const { refreshApi } = await import("../../api");
    vi.mocked(refreshApi).mockResolvedValue({
      accessToken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsImVtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTcwMDAwMDAwMH0.abc123",
      refreshToken: "refreshed-token",
      tokenType: "Bearer",
      expiresIn: 900,
    });

    renderGuestRoute("/login");
    await vi.waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });
});