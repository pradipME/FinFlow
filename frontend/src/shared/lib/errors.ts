import { AxiosError } from "axios";
import type { ApiError } from "@/shared/types";

export type ErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "network"
  | "server"
  | "unknown";

interface ExtractedError {
  message: string;
  category: ErrorCategory;
}

function isApiError(value: unknown): value is ApiError {
  if (!value || typeof value !== "object") return false;
  const v = value as ApiError;
  return typeof v.code === "string" && typeof v.message === "string";
}

function categoryFromCode(code: string): ErrorCategory {
  const upper = code.toUpperCase();
  if (/FORBIDDEN|ACCESS_DENIED|ACCESS / .test(upper) || /FORBIDDEN|ROLE_DENIED|PERMISSION/.test(upper)) return "authorization";
  if (/UNAUTHENTICATED|INVALID_CREDENTIALS|UNAUTHORIZED|TOKEN_EXPIRED|INVALID_TOKEN|SESSION/.test(upper)) return "authentication";
  if (/VALIDATION|INVALID|MALFORMED|BAD_REQUEST|PARAM/.test(upper)) return "validation";
  return "server";
}

/**
 * Extract a user-friendly message + category from any error thrown by the API
 * layer. Preserves the backend-provided message when safe, and distinguishes
 * validation, authentication, authorization, network and server failures.
 */
export function extractError(error: unknown): ExtractedError {
  // Backend API error envelope ({ success:false, error:{ code, message } })
  if (isApiError(error) || (typeof error === "object" && error !== null && "error" in error)) {
    const apiErr = isApiError(error) ? error : (error as { error?: ApiError }).error;
    if (apiErr) {
      return {
        message: apiErr.message || "Something went wrong. Please try again.",
        category: categoryFromCode(apiErr.code),
      };
    }
  }

  // Axios / network errors
  if (error instanceof AxiosError) {
    if (!error.response) {
      return { message: "Network error — please check your connection and try again.", category: "network" };
    }
    const status = error.response.status;
    const data = error.response.data as { error?: ApiError; message?: string } | undefined;
    if (isApiError(data?.error)) {
      return {
        message: data.error.message || `Request failed (${status}).`,
        category: categoryFromCode(data.error.code),
      };
    }
    if (status >= 400 && status < 500) {
      return { message: data?.message ?? "Your request could not be completed. Please check the details and try again.", category: "validation" };
    }
    if (status >= 500) {
      return { message: "Something went wrong on our side. Please try again shortly.", category: "server" };
    }
  }

  // Plain Error (usually thrown by the api helpers with backend message)
  if (error instanceof Error && error.message) {
    return { message: error.message, category: "unknown" };
  }

  return { message: "Unexpected error occurred. Please try again.", category: "unknown" };
}

/** Convenience: convert any error into a safe, user-friendly message. */
export function toErrorMessage(error: unknown): string {
  return extractError(error).message;
}