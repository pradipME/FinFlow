/**
 * PasswordInput — Type Definitions
 *
 * Extends InputProps with password-specific concerns:
 * visibility toggle, Caps Lock detection, security restrictions,
 * autocomplete semantics, and a strength indicator slot.
 *
 * Reuses Input internally — never duplicates input logic.
 */
import type { ReactNode } from "react";
import type { InputProps } from "../Input/types";

// ── Props ────────────────────────────────────────────────────────

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /**
   * Autocomplete hint for password managers.
   * "current-password" — login forms
   * "new-password" — registration / change password forms
   * @default "current-password"
   */
  autoComplete?: "current-password" | "new-password";

  /**
   * Render a password strength indicator below the message area.
   * The component does NOT calculate strength — the consumer provides
   * the fully-rendered ReactNode (bar, text, icon, whatever).
   */
  strengthIndicator?: ReactNode;

  /**
   * Prevent paste into the password field.
   * @default false
   */
  disablePaste?: boolean;

  /**
   * Prevent copy from the password field.
   * @default false
   */
  disableCopy?: boolean;

  /**
   * Prevent cut from the password field.
   * @default false
   */
  disableCut?: boolean;

  /**
   * Disable the browser context menu on the password field.
   * @default false
   */
  disableContextMenu?: boolean;

  /**
   * Callback fired when Caps Lock state changes.
   * @param isOn — true when Caps Lock is active
   */
  onCapsLockChange?: (isOn: boolean) => void;
}
