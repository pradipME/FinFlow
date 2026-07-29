/**
 * OTPInput — Type Definitions
 *
 * Enterprise one-time password input with separate digit cells,
 * auto-focus navigation, paste distribution, and keyboard shortcuts.
 *
 * Does NOT compose <Input> — fundamentally different architecture
 * (multiple <input> elements for individual digit capture).
 */

// ── Size ─────────────────────────────────────────────────────────

export type OTPSize = "sm" | "md" | "lg";

// ── Props ────────────────────────────────────────────────────────

export interface OTPInputProps {
  /**
   * Number of OTP digits.
   * @default 6
   */
  length?: 4 | 6;

  /**
   * Controlled OTP value.
   * Must be a string of digits with length <= length prop.
   */
  value?: string;

  /**
   * Default OTP value (uncontrolled).
   */
  defaultValue?: string;

  /**
   * Called on every digit change with the current OTP string.
   */
  onChange?: (value: string) => void;

  /**
   * Called when all digits are entered.
   * Fires after onChange.
   */
  onComplete?: (value: string) => void;

  /**
   * Auto-focus behavior:
   *   - true: focus first empty cell on mount
   *   - number: focus the cell at this index on mount
   *   - false: no auto-focus
   * @default true
   */
  autoFocus?: boolean | number;

  /**
   * Disable all cells.
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state — applies danger border styling.
   * @default false
   */
  error?: boolean;

  /**
   * Visual size preset.
   * @default "md"
   */
  size?: OTPSize;

  /**
   * Optional separator element between cells (e.g. for 6-digit: cell-cell-cell-SEP-cell-cell-cell).
   * Rendered after index 2 (middle) when length is 6.
   */
  separator?: React.ReactNode;

  /**
   * Label text rendered above the input cells.
   */
  label?: string;

  /**
   * Placeholder character shown in empty cells.
   * @default ""
   */
  placeholder?: string;

  /**
   * Additional CSS class for the outer wrapper.
   */
  className?: string;

  /**
   * Accessible label for the hidden input used for form submission.
   * @default "Verification code"
   */
  "aria-label"?: string;
}
