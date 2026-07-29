/**
 * CurrencyInput — Type Definitions
 *
 * Enterprise currency field that composes <Input> and adds:
 *   - Locale-aware number formatting (thousands, decimals)
 *   - Currency symbol display (via prefix or Intl)
 *   - Configurable decimal places with fixedDecimalScale
 *   - Negative value toggle
 *   - Leading zeros control
 *   - Min/max validation
 *   - Raw + formatted value callbacks
 *   - Caret-aware formatting (no jumpy typing)
 *   - Paste handling with numeric extraction
 *
 * Zero duplicated input logic — all delegated to Input.
 */
import type { InputProps } from "../Input/types";

// ── Props ────────────────────────────────────────────────────────

export interface CurrencyInputProps
  extends Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> {
  /**
   * Controlled numeric value.
   * Pass raw number — component handles formatting internally.
   */
  value?: number;

  /**
   * Default numeric value (uncontrolled).
   */
  defaultValue?: number;

  /**
   * Called when the numeric value changes.
   * Always passes a raw number. NaN when input is empty/unparseable.
   */
  onValueChange?: (value: number) => void;

  /**
   * Called with the formatted display string on every change.
   */
  onFormattedValueChange?: (formatted: string) => void;

  /**
   * Currency code for Intl.NumberFormat (e.g. "USD", "EUR", "INR").
   * Ignored when currencySymbol is provided.
   * @default "USD"
   */
  currency?: string;

  /**
   * Override the currency symbol displayed as prefix.
   * When provided, bypasses Intl currency display.
   */
  currencySymbol?: string;

  /**
   * Locale for number formatting.
   * @default "en-IN"
   */
  locale?: string;

  /**
   * Number of decimal places.
   * @default 2
   */
  decimalPlaces?: number;

  /**
   * When true, always show exactly `decimalPlaces` digits
   * (e.g. 12 → "12.00"). When false, trailing decimals are dropped.
   * @default false
   */
  fixedDecimalScale?: boolean;

  /**
   * Allow negative values.
   * @default true
   */
  allowNegative?: boolean;

  /**
   * Allow leading zeros (e.g. "007.50").
   * When false, leading zeros are stripped on blur.
   * @default true
   */
  allowLeadingZeros?: boolean;

  /**
   * Minimum allowed value. Shows error on blur when exceeded.
   */
  min?: number;

  /**
   * Maximum allowed value. Shows error on blur when exceeded.
   */
  max?: number;

  /**
   * Placeholder text when empty.
   * @default Formatted "0" for the given locale/currency
   */
  placeholder?: string;

  /**
   * The current formatted display value (read-only, for external use).
   */
  formattedValue?: string;

  /**
   * The current raw numeric value (read-only, for external use).
   */
  rawValue?: number;
}
