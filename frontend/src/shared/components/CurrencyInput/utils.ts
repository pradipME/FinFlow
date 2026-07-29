/**
 * CurrencyInput — Utility Functions
 *
 * Pure helpers for locale-aware formatting, parsing, and caret management.
 * All functions are side-effect free and testable in isolation.
 */

// ── Locale Helpers ──────────────────────────────────────────────

/** Extract the decimal separator character for a locale (e.g. "." for en-US, "," for de-DE). */
export function getDecimalSeparator(locale: string): string {
  const parts = new Intl.NumberFormat(locale)
    .formatToParts(1000.1)
    .filter((p) => p.type === "decimal");
  return parts[0]?.value ?? ".";
}

/** Extract the digit grouping separator for a locale (e.g. "," for en-US, "." for de-DE). */
export function getGroupingSeparator(locale: string): string {
  const parts = new Intl.NumberFormat(locale)
    .formatToParts(1000)
    .filter((p) => p.type === "group");
  return parts[0]?.value ?? ",";
}

// ── Formatting ──────────────────────────────────────────────────

/**
 * Format a number using Intl.NumberFormat.
 *
 * @param num           The raw number to format
 * @param locale        BCP 47 locale string
 * @param currency      ISO 4217 currency code (used when useCurrencyDisplay is true)
 * @param decimalPlaces Number of decimal digits
 * @param fixedDecimalScale When true, always show exactly decimalPlaces digits
 * @param useCurrencyDisplay When true, format as currency (style: "currency")
 */
export function formatNumber(
  num: number,
  locale: string,
  currency: string,
  decimalPlaces: number,
  fixedDecimalScale: boolean,
  useCurrencyDisplay: boolean,
): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: fixedDecimalScale ? decimalPlaces : 0,
    maximumFractionDigits: decimalPlaces,
  };
  if (useCurrencyDisplay) {
    options.style = "currency";
    options.currency = currency;
  }
  return new Intl.NumberFormat(locale, options).format(num);
}

// ── Parsing ─────────────────────────────────────────────────────

/**
 * Parse a formatted currency string back to a raw number.
 * Handles locale-specific grouping and decimal separators.
 *
 * @returns The parsed number, or NaN if unparseable.
 */
export function parseFormattedValue(
  raw: string,
  decimalSep: string,
  groupSep: string,
): number {
  let cleaned = raw;

  // Strip grouping separators
  if (groupSep) {
    // Escape for regex if it's a special character
    const escaped = groupSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    cleaned = cleaned.replace(new RegExp(escaped, "g"), "");
  }

  // Replace locale decimal separator with "."
  if (decimalSep !== ".") {
    const escaped = decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    cleaned = cleaned.replace(new RegExp(escaped), ".");
  }

  // Strip everything except digits, dots, minus
  cleaned = cleaned.replace(/[^0-9.\-]/g, "");

  // Handle multiple dots — keep only the first
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex !== -1) {
    cleaned =
      cleaned.substring(0, dotIndex + 1) +
      cleaned.substring(dotIndex + 1).replace(/\./g, "");
  }

  if (cleaned === "" || cleaned === "-" || cleaned === ".") return NaN;
  return parseFloat(cleaned);
}

/**
 * Strip non-numeric characters from pasted text, keeping only
 * digits, one decimal separator, and an optional leading minus.
 */
export function extractNumericFromPaste(
  text: string,
  decimalSep: string,
  allowNegative: boolean,
): string {
  let result = text.trim();

  // If locale uses comma as decimal, the dot is a grouping separator —
  // strip it first, then convert comma to dot for parsing
  if (decimalSep === ",") {
    result = result.replace(/\./g, "");
    result = result.replace(/,/g, ".");
  }

  // Remove everything except digits, dots, and optionally minus
  const pattern = allowNegative ? /[^0-9.\-]/g : /[^0-9.]/g;
  result = result.replace(pattern, "");

  // Handle multiple dots
  const dotIndex = result.indexOf(".");
  if (dotIndex !== -1) {
    result =
      result.substring(0, dotIndex + 1) +
      result.substring(dotIndex + 1).replace(/\./g, "");
  }

  // Handle minus — only at start
  if (allowNegative) {
    const minusIndex = result.indexOf("-");
    if (minusIndex > 0) {
      result = result.substring(0, minusIndex) + result.substring(minusIndex + 1);
    }
  } else {
    result = result.replace(/-/g, "");
  }

  return result;
}

// ── Caret Management ────────────────────────────────────────────

/**
 * Count how many digit characters exist in `str` up to (not including) `pos`.
 */
function countDigitsBefore(str: string, pos: number): number {
  let count = 0;
  for (let i = 0; i < pos && i < str.length; i++) {
    if (/\d/.test(str[i])) count++;
  }
  return count;
}

/**
 * Given a formatted string and the number of digit characters before the caret,
 * find the position in the formatted string that has the same number of digits before it.
 *
 * This keeps the caret in a natural position when formatting inserts/removes
 * grouping separators or decimal points.
 */
export function getCaretPosition(
  formatted: string,
  digitCount: number,
): number {
  if (digitCount === 0) {
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) return i;
    }
    return formatted.length;
  }
  let digits = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) digits++;
    if (digits >= digitCount) return i + 1;
  }
  return formatted.length;
}

/**
 * Calculate the new caret position after formatting changes.
 *
 * @param oldValue   The previous display value
 * @param newValue   The new (formatted) display value
 * @param oldCaret   The caret position before formatting
 * @returns The caret position after formatting
 */
export function calculateNewCaretPosition(
  oldValue: string,
  newValue: string,
  oldCaret: number,
): number {
  const digitsBefore = countDigitsBefore(oldValue, oldCaret);
  return getCaretPosition(newValue, digitsBefore);
}
