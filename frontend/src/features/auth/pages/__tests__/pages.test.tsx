import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { LoginPage } from "../LoginPage";
import { RegisterPage } from "../RegisterPage";
import { ForgotPasswordPage } from "../ForgotPasswordPage";
import { OtpVerificationPage } from "../OtpVerificationPage";
import { tokenManager } from "@/shared/api/token-manager";

vi.mock("../../api", () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  refreshApi: vi.fn(),
  revokeApi: vi.fn(),
}));

function renderWithAuth(ui: React.ReactNode, initialPath = "/login") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

describe("Auth Pages", () => {
  beforeEach(() => {
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  describe("LoginPage", () => {
    it("renders login form", async () => {
      renderWithAuth(<LoginPage />, "/login");
      await vi.waitFor(() => {
        expect(screen.getByText("Sign in to FinFlow")).toBeInTheDocument();
      });
      expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("has link to register page", async () => {
      renderWithAuth(<LoginPage />, "/login");
      await vi.waitFor(() => {
        expect(screen.getByText("Create account")).toBeInTheDocument();
      });
    });

    it("has link to forgot password", async () => {
      renderWithAuth(<LoginPage />, "/login");
      await vi.waitFor(() => {
        expect(screen.getByText("Forgot password?")).toBeInTheDocument();
      });
    });
  });

  describe("RegisterPage", () => {
    it("renders registration form", async () => {
      renderWithAuth(<RegisterPage />, "/register");
      await vi.waitFor(() => {
        expect(screen.getByText("Create your account")).toBeInTheDocument();
      });
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    });

    it("has link to login page", async () => {
      renderWithAuth(<RegisterPage />, "/register");
      await vi.waitFor(() => {
        expect(screen.getByText("Sign in")).toBeInTheDocument();
      });
    });
  });

  describe("ForgotPasswordPage", () => {
    it("renders with unsupported warning", () => {
      renderWithAuth(<ForgotPasswordPage />, "/forgot-password");
      expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
      expect(screen.getByText("Feature Unavailable")).toBeInTheDocument();
    });

    it("has link back to login", () => {
      renderWithAuth(<ForgotPasswordPage />, "/forgot-password");
      expect(screen.getByText("Back to sign in")).toBeInTheDocument();
    });
  });

  describe("OtpVerificationPage", () => {
    it("renders with unsupported warning", () => {
      renderWithAuth(<OtpVerificationPage />, "/verify-otp");
      expect(screen.getByText("Enter verification code")).toBeInTheDocument();
      expect(screen.getByText("Feature Unavailable")).toBeInTheDocument();
    });
  });
});