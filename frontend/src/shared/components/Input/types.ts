/**
 * Input — Type Definitions
 *
 * Enterprise form input with icon slots, validation states,
 * prefix/suffix adornments, and full React Hook Form integration.
 * ForwardRef exposes the native <input> element for imperative access.
 */
import type { InputHTMLAttributes, ReactNode } from "react";

// ── Input Type ───────────────────────────────────────────────────

export type InputType = "text" | "email" | "password" | "number" | "tel" | "url";

// ── Size ─────────────────────────────────────────────────────────

export type InputSize = "sm" | "md" | "lg";

// ── Validation State ─────────────────────────────────────────────

export type InputState = "default" | "invalid" | "success";

// ── Props ────────────────────────────────────────────────────────

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** HTML input type */
  type?: InputType;

  /** Visual size preset */
  size?: InputSize;

  /** Validation state — drives border color + ARIA */
  state?: InputState;

  /** Label text rendered above the input */
  label?: string;

  /** Helper text rendered below the input (hidden when error is present) */
  helperText?: string;

  /** Error text rendered below the input (replaces helperText) */
  errorText?: string;

  /** Success text rendered below the input */
  successText?: string;

  /** Element or string rendered before the input (inside the border) */
  prefix?: ReactNode;

  /** Element or string rendered after the input (inside the border) */
  suffix?: ReactNode;

  /** Icon rendered at the start of the input (left side) */
  leftIcon?: ReactNode;

  /** Icon rendered at the end of the input (right side) */
  rightIcon?: ReactNode;

  /** Show a clear (×) button when the input has a value */
  clearable?: boolean;

  /** Show a loading spinner instead of the right icon */
  loading?: boolean;

  /** Mark the field as required (shows asterisk on label) */
  required?: boolean;

  /** Disable the entire input */
  disabled?: boolean;

  /** Make the input read-only */
  readOnly?: boolean;

  /** Callback when the clear button is clicked */
  onClear?: () => void;

  /** Additional CSS class for the wrapper div */
  className?: string;
}
