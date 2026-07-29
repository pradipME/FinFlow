/**
 * Toast — Type Definitions
 *
 * Enterprise toast notification system with provider context,
 * promise support, action buttons, auto-close, and swipe-to-dismiss.
 *
 * Architecture:
 *   ToastProvider  — wraps the app, manages toast queue
 *   useToast()     — hook to add/update/remove toasts
 *   ToastContainer — renders the positioned stack
 *   ToastItem      — individual toast card
 */
import type { ReactNode } from "react";

// ── Variants ─────────────────────────────────────────────────────

/** Visual style of the toast — maps to icon, color, and border treatment. */
export type ToastVariant = "success" | "info" | "warning" | "danger" | "loading";

// ── Positions ────────────────────────────────────────────────────

/** Where the toast stack appears on screen. */
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

// ── Toast Item ───────────────────────────────────────────────────

/** A single toast instance managed by the provider. */
export interface Toast {
  /** Unique identifier — auto-generated if not provided. */
  id: string;
  /** Visual variant. */
  variant: ToastVariant;
  /** Primary message text. */
  message: string;
  /** Optional secondary description below the message. */
  description?: string;
  /** Auto-close delay in ms. `false` disables auto-close. Default: 5000. */
  autoClose?: number | false;
  /** Whether the toast can be dismissed by the user. Default: true. */
  closable?: boolean;
  /** Optional action button configuration. */
  action?: ToastAction;
  /** Whether the toast was created via promise. */
  isPromise?: boolean;
  /** Timestamp of creation — used for expiry checks. */
  createdAt: number;
}

/** Action button configuration for a toast. */
export interface ToastAction {
  /** Button label. */
  label: string;
  /** Click handler. */
  onClick: () => void;
}

// ── Promise Options ──────────────────────────────────────────────

/** Options for `toast.promise()`. */
export interface PromiseToastOptions {
  /** Message shown while the promise is pending. */
  loading: string;
  /** Message shown when the promise resolves. */
  success: string | ((data: unknown) => string);
  /** Message shown when the promise rejects. */
  error: string | ((error: unknown) => string);
  /** Auto-close delay for the final state (success/error) in ms. Default: 5000. */
  autoClose?: number | false;
  /** Description for the final state. */
  description?: string;
}

// ── Toast Method (exposed by useToast) ───────────────────────────

/** Shorthand methods on the toast object returned by useToast(). */
export interface ToastMethods {
  /** Create a success toast. */
  success(message: string, options?: Partial<ToastOptions>): string;
  /** Create an info toast. */
  info(message: string, options?: Partial<ToastOptions>): string;
  /** Create a warning toast. */
  warning(message: string, options?: Partial<ToastOptions>): string;
  /** Create a danger toast. */
  error(message: string, options?: Partial<ToastOptions>): string;
  /** Create a loading toast. */
  loading(message: string, options?: Partial<ToastOptions>): string;
  /** Create a toast from a promise. Returns the toast id. */
  promise<T>(promise: Promise<T>, options: PromiseToastOptions): string;
  /** Dismiss a toast by id. */
  dismiss(id: string): void;
  /** Dismiss all toasts. */
  dismissAll(): void;
  /** Update an existing toast by id. */
  update(id: string, update: Partial<ToastOptions>): void;
}

// ── Toast Options (internal) ─────────────────────────────────────

/** Full options for creating a toast via the internal add function. */
export interface ToastOptions {
  id?: string;
  variant: ToastVariant;
  message: string;
  description?: string;
  autoClose?: number | false;
  closable?: boolean;
  action?: ToastAction;
  isPromise?: boolean;
}

// ── Provider Props ───────────────────────────────────────────────

export interface ToastProviderProps {
  /** Child elements. */
  children: ReactNode;
  /** Default position for all toasts. Default: "bottom-right". */
  position?: ToastPosition;
  /** Maximum number of visible toasts. Default: 5. */
  maxVisible?: number;
  /** Default auto-close delay in ms. Default: 5000. Set false to disable. */
  defaultAutoClose?: number | false;
  /** Gap between stacked toasts in px. Default: 8. */
  gap?: number;
}

// ── Container Props ──────────────────────────────────────────────

export interface ToastContainerProps {
  /** Position of the toast stack. Default: "bottom-right". */
  position?: ToastPosition;
  /** Maximum visible toasts. Default: 5. */
  maxVisible?: number;
  /** Gap between stacked toasts in px. Default: 8. */
  gap?: number;
}

// ── Item Props ───────────────────────────────────────────────────

export interface ToastItemProps {
  /** The toast data. */
  toast: Toast;
  /** Position (determines animation direction). */
  position: ToastPosition;
  /** Gap for stack offset calculation. */
  gap: number;
  /** Index in the visible stack (for layout offset). */
  index: number;
}
