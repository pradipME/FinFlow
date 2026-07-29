/**
 * Input
 *
 * Enterprise form input with icon slots, prefix/suffix adornments,
 * validation states, clear button, and loading spinner.
 * ForwardRef exposes the native <input> for imperative focus/blur.
 *
 * @example
 *   <Input label="Email" type="email" placeholder="you@bank.com" required />
 *   <Input label="Amount" prefix="$" suffix=".00" type="number" />
 *   <Input label="API Key" leftIcon={<KeyIcon />} loading state="success" />
 *   <Input label="Search" clearable errorText="Invalid format" />
 */
import {
  forwardRef,
  useState,
  useCallback,
  useId,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { motion, MotionConfig } from "framer-motion";
import { useReducedMotion } from "@/shared/motion";
import type { InputProps } from "./types";
import {
  WRAPPER_CLASSES,
  LABEL_CLASSES,
  LABEL_REQUIRED_CLASSES,
  LABEL_DISABLED_CLASSES,
  HELPER_TEXT_CLASSES,
  ERROR_TEXT_CLASSES,
  SUCCESS_TEXT_CLASSES,
} from "./constants";
import {
  getInputWrapperClasses,
  getInputElementClasses,
  getLeftIconClasses,
  getRightIconClasses,
  getPrefixClasses,
  getSuffixClasses,
  getClearButtonClasses,
  getLoadingSpinnerClasses,
} from "./styles";

// ── Loading Spinner (inline SVG) ─────────────────────────────────

function LoadingSpinnerSvg() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

// ── Clear Button (×) ────────────────────────────────────────────

function ClearButton({ onClear }: { onClear: () => void }) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label="Clear input"
      className={getClearButtonClasses()}
      onClick={onClear}
      animate={reduced ? {} : { scale: [0.8, 1] }}
      transition={{ duration: 0.15 }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

// ── Input ────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    size = "md",
    state = "default",
    label,
    helperText,
    errorText,
    successText,
    prefix,
    suffix,
    leftIcon,
    rightIcon,
    clearable = false,
    loading = false,
    required = false,
    disabled = false,
    readOnly = false,
    onClear,
    className,
    value,
    onChange,
    onFocus,
    onBlur,
    id: idProp,
    "aria-describedby": ariaDescribedBy,
    defaultValue: _defaultValue,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const successId = `${id}-success`;

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    isControlled ? String(value) : typeof _defaultValue === "string" ? _defaultValue : "",
  );

  const currentValue = isControlled ? String(value) : internalValue;
  const hasValue = currentValue.length > 0;

  // Effective state: errorText overrides
  const effectiveState = errorText ? "invalid" : successText ? "success" : state;

  // ── Handlers ──────────────────────────────────────────────

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue("");
    onClear?.();
    if (ref && typeof ref === "object" && ref.current) {
      ref.current.focus();
    }
  }, [isControlled, onClear, ref]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && clearable && hasValue) {
        handleClear();
      }
    },
    [clearable, hasValue, handleClear],
  );

  // ── IDs for accessibility ─────────────────────────────────

  const describedBy =
    [
      ariaDescribedBy,
      errorText ? errorId : "",
      successText ? successId : "",
      helperText && !errorText ? helperId : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  // ── Render ────────────────────────────────────────────────

  return (
    <MotionConfig reducedMotion="user">
      <div className={[WRAPPER_CLASSES, className ?? ""].filter(Boolean).join(" ")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={[LABEL_CLASSES, disabled ? LABEL_DISABLED_CLASSES : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
            {required && (
              <span className={LABEL_REQUIRED_CLASSES} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div
          className={getInputWrapperClasses({
            size,
            state: effectiveState,
            disabled,
            readOnly,
            hasLeftIcon: !!leftIcon,
            hasRightIcon: !!rightIcon,
            hasPrefix: !!prefix,
            hasSuffix: !!suffix,
            hasClear: clearable && hasValue,
            hasLoading: loading,
          })}
        >
          {/* Left icon */}
          {leftIcon && (
            <span className={getLeftIconClasses()} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {/* Prefix */}
          {prefix && <span className={getPrefixClasses()}>{prefix}</span>}

          {/* Native input */}
          <input
            ref={ref}
            id={id}
            type={type}
            value={currentValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={effectiveState === "invalid" || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            className={getInputElementClasses()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            {...rest}
          />

          {/* Loading spinner */}
          {loading && (
            <span className={getLoadingSpinnerClasses()} aria-label="Loading">
              <LoadingSpinnerSvg />
            </span>
          )}

          {/* Right icon (hidden when loading or clearable) */}
          {rightIcon && !loading && !(clearable && hasValue) && (
            <span className={getRightIconClasses()} aria-hidden="true">
              {rightIcon}
            </span>
          )}

          {/* Clear button */}
          {clearable && hasValue && !loading && <ClearButton onClear={handleClear} />}

          {/* Suffix */}
          {suffix && <span className={getSuffixClasses()}>{suffix}</span>}
        </div>

        {/* Message text — only one shown at a time */}
        {errorText && (
          <p id={errorId} className={ERROR_TEXT_CLASSES} role="alert">
            {errorText}
          </p>
        )}
        {successText && !errorText && (
          <p id={successId} className={SUCCESS_TEXT_CLASSES}>
            {successText}
          </p>
        )}
        {helperText && !errorText && !successText && (
          <p id={helperId} className={HELPER_TEXT_CLASSES}>
            {helperText}
          </p>
        )}
      </div>
    </MotionConfig>
  );
});
