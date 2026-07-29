/**
 * CurrencyInput
 *
 * Enterprise currency field that composes <Input> and adds:
 *   - Locale-aware number formatting (thousands, decimals)
 *   - Currency symbol via prefix or Intl
 *   - Configurable decimal places with fixedDecimalScale
 *   - Negative value toggle + leading zeros control
 *   - Min/max validation with error display
 *   - Raw + formatted value callbacks
 *   - Caret-aware formatting (no jumpy typing)
 *   - Paste handling with numeric extraction
 *   - Full accessibility support
 *
 * Zero duplicated input logic — all delegated to Input.
 *
 * @example
 *   <CurrencyInput value={1234.56} onValueChange={setValue} currency="USD" />
 *   <CurrencyInput defaultValue={0} min={0} max={10000} fixedDecimalScale />
 *   <CurrencyInput currencySymbol="₹" locale="en-IN" value={99.99} />
 *   <CurrencyInput locale="de-DE" currency="EUR" currencySymbol="€" value={1234.56} />
 */
import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
  useMemo,
  type ClipboardEvent as ReactClipboardEvent,
  type KeyboardEvent,
} from "react";
import { Input } from "../Input/Input";
import type { CurrencyInputProps } from "./types";
import { getWrapperClasses } from "./styles";
import {
  getDecimalSeparator,
  getGroupingSeparator,
  formatNumber,
  parseFormattedValue,
  extractNumericFromPaste,
  calculateNewCaretPosition,
} from "./utils";

// ── CurrencyInput ────────────────────────────────────────────────

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      onFormattedValueChange,
      currency = "USD",
      currencySymbol,
      locale = "en-IN",
      decimalPlaces = 2,
      fixedDecimalScale = false,
      allowNegative = true,
      allowLeadingZeros = true,
      min,
      max,
      disabled = false,
      readOnly = false,
      loading = false,
      className,
      placeholder,
      errorText: errorTextProp,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        inputRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [ref],
    );

    const [displayValue, setDisplayValue] = useState<string>("");
    const [committedValue, setCommittedValue] = useState<number | undefined>(
      controlledValue ?? defaultValue,
    );
    const committedRef = useRef(committedValue);
    committedRef.current = committedValue;

    // ── Locale helpers (memoized) ───────────────────────────────

    const decimalSep = useMemo(() => getDecimalSeparator(locale), [locale]);
    const groupSep = useMemo(() => getGroupingSeparator(locale), [locale]);

    const useCurrencyDisplay = !currencySymbol;

    // ── Memoized formatter ──────────────────────────────────────

    const formatter = useMemo(
      () =>
        (num: number): string =>
          formatNumber(num, locale, currency, decimalPlaces, fixedDecimalScale, useCurrencyDisplay),
      [locale, currency, decimalPlaces, fixedDecimalScale, useCurrencyDisplay],
    );

    // ── Format on mount / controlled value change ────────────────

    useEffect(() => {
      if (controlledValue !== undefined && !isNaN(controlledValue)) {
        setDisplayValue(formatter(controlledValue));
        setCommittedValue(controlledValue);
        committedRef.current = controlledValue;
      } else if (controlledValue === undefined && defaultValue !== undefined) {
        setDisplayValue(formatter(defaultValue));
        setCommittedValue(defaultValue);
        committedRef.current = defaultValue;
      } else if (controlledValue === undefined && defaultValue === undefined) {
        setDisplayValue("");
        setCommittedValue(undefined);
        committedRef.current = undefined;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controlledValue, defaultValue, formatter]);

    // ── Validation ──────────────────────────────────────────────

    const minMaxError = useMemo(() => {
      if (committedValue === undefined || isNaN(committedValue)) return undefined;
      if (min !== undefined && committedValue < min) {
        return `Minimum value is ${formatter(min)}`;
      }
      if (max !== undefined && committedValue > max) {
        return `Maximum value is ${formatter(max)}`;
      }
      return undefined;
    }, [committedValue, min, max, formatter]);

    const errorText = minMaxError ?? errorTextProp;

    // ── Focus / Blur ────────────────────────────────────────────

    const handleFocus = useCallback(() => {
      rest.onFocus?.({} as React.FocusEvent<HTMLInputElement>);
    }, [rest.onFocus]);

    const handleBlur = useCallback(() => {
      // Parse current display to get raw number
      const parsed = parseFormattedValue(displayValue, decimalSep, groupSep);

      if (!isNaN(parsed)) {
        let finalValue = parsed;

        // Strip negatives if not allowed
        if (!allowNegative && finalValue < 0) {
          finalValue = Math.abs(finalValue);
        }

        // Strip leading zeros unless allowed
        if (!allowLeadingZeros && finalValue !== 0) {
          finalValue = parseFloat(finalValue.toString());
        }

        const formatted = formatter(finalValue);
        setDisplayValue(formatted);
        setCommittedValue(finalValue);
        committedRef.current = finalValue;
        onValueChange?.(finalValue);
        onFormattedValueChange?.(formatted);
      } else if (displayValue.trim() === "" || displayValue === "0") {
        // Empty input — default to 0
        const formatted = formatter(0);
        setDisplayValue(formatted);
        const prev = committedRef.current;
        setCommittedValue(0);
        committedRef.current = 0;
        if (prev !== 0) {
          onValueChange?.(0);
          onFormattedValueChange?.(formatted);
        }
      } else {
        // Invalid input — revert to last committed value
        if (committedValue !== undefined && !isNaN(committedValue)) {
          const formatted = formatter(committedValue);
          setDisplayValue(formatted);
        } else {
          setDisplayValue("");
        }
      }

      rest.onBlur?.({} as React.FocusEvent<HTMLInputElement>);
    }, [
      displayValue,
      decimalSep,
      groupSep,
      formatter,
      allowNegative,
      allowLeadingZeros,
      controlledValue,
      committedValue,
      onValueChange,
      onFormattedValueChange,
      rest.onBlur,
    ]);

    // ── Change (typing) ─────────────────────────────────────────

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Strip grouping separators and convert locale decimal to "."
        let stripped = raw;
        if (groupSep) {
          stripped = stripped.split(groupSep).join("");
        }
        if (decimalSep !== ".") {
          stripped = stripped.split(decimalSep).join(".");
        }

        // Validate pattern
        const pattern = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
        if (pattern.test(stripped) || stripped === "" || stripped === "-") {
          // Preserve caret position through formatting changes
          const input = inputRef.current;
          if (input) {
            const oldCaret = input.selectionStart ?? raw.length;
            const caretPos = calculateNewCaretPosition(displayValue, raw, oldCaret);
            setDisplayValue(raw);
            // Restore caret after React re-render
            requestAnimationFrame(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(caretPos, caretPos);
              }
            });
          } else {
            setDisplayValue(raw);
          }
        }
      },
      [groupSep, decimalSep, allowNegative, displayValue],
    );

    // ── Paste ───────────────────────────────────────────────────

    const handlePaste = useCallback(
      (e: ReactClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const extracted = extractNumericFromPaste(pastedText, decimalSep, allowNegative);

        if (extracted === "") return;

        const parsed = parseFloat(extracted);
        if (!isNaN(parsed)) {
          let finalValue = parsed;
          if (!allowNegative && finalValue < 0) {
            finalValue = Math.abs(finalValue);
          }
          const formatted = formatter(finalValue);
          setDisplayValue(formatted);
          setCommittedValue(finalValue);
          committedRef.current = finalValue;
          onValueChange?.(finalValue);
          onFormattedValueChange?.(formatted);
        }
      },
      [decimalSep, allowNegative, formatter, onValueChange, onFormattedValueChange],
    );

    // ── Keyboard ────────────────────────────────────────────────

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, arrow keys, tab
        const allowed = [
          "Backspace", "Delete", "Tab", "Escape", "Enter",
          "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
          "Home", "End",
        ];

        if (
          allowed.includes(e.key) ||
          e.ctrlKey ||
          e.metaKey ||
          // Allow decimal separator key
          e.key === decimalSep ||
          e.key === "." ||
          // Allow minus at start
          (allowNegative && e.key === "-" && (e.target as HTMLInputElement).selectionStart === 0)
        ) {
          rest.onKeyDown?.(e);
          return;
        }

        // Block non-numeric input
        if (!/^\d$/.test(e.key)) {
          e.preventDefault();
          return;
        }

        rest.onKeyDown?.(e);
      },
      [decimalSep, allowNegative, rest.onKeyDown],
    );

    // ── Prefix ──────────────────────────────────────────────────

    const prefixNode = useMemo(() => {
      if (currencySymbol) {
        return (
          <span
            className="text-text-secondary text-sm font-medium"
            aria-hidden="true"
          >
            {currencySymbol}
          </span>
        );
      }
      return undefined;
    }, [currencySymbol]);

    // ── Render ──────────────────────────────────────────────────

    return (
      <div className={getWrapperClasses(className)}>
        <Input
          ref={setRefs}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={displayValue}
          disabled={disabled}
          readOnly={readOnly}
          loading={loading}
          placeholder={
            placeholder ??
            (fixedDecimalScale || useCurrencyDisplay
              ? formatter(0)
              : "0")
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste as unknown as React.ClipboardEventHandler<HTMLInputElement>}
          prefix={prefixNode}
          errorText={errorText}
          aria-invalid={minMaxError ? true : undefined}
          aria-describedby={
            minMaxError
              ? `${generatedId}-minmax-error`
              : rest["aria-describedby"]
          }
          {...rest}
        />
      </div>
    );
  },
);
