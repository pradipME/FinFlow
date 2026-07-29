import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { AuthProvider } from "../../context/AuthContext";
import { tokenManager } from "@/shared/api/token-manager";

vi.mock("../../api", () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  refreshApi: vi.fn(),
  revokeApi: vi.fn(),
}));

function renderProtectedRoute(initialPath = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  it("redirects to login when not authenticated", async () => {
    renderProtectedRoute();
    await vi.waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("renders children when authenticated", async () => {
    const { refreshApi } = await import("../../api");
    vi.mocked(refreshApi).mockResolvedValue({
      accessToken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInN0YXR1cyI6IkFDVElERSIsImVtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTcwMDAwMDAwMH0.abc123",
      refreshToken: "refreshed-token",
      tokenType: "Bearer",
      expiresIn: 900,
    });

    tokenManager.setTokens("access-token", "refresh-token");

    renderProtectedRoute();
    await vi.waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });
});