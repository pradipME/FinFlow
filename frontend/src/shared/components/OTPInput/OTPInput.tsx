/**
 * OTPInput
 *
 * Enterprise one-time password input with separate digit cells:
 *   - 4 or 6 digit length
 *   - Auto-focus navigation between cells
 *   - Paste distribution across cells
 *   - Arrow key and backspace navigation
 *   - Auto-advance on digit entry
 *   - onComplete callback
 *   - inputMode="numeric" for mobile keyboards
 *   - autoComplete="one-time-code" for SMS autofill
 *
 * Does NOT compose <Input> — fundamentally different architecture
 * (multiple <input> elements for individual digit capture).
 *
 * @example
 *   <OTPInput length={6} onComplete={handleVerify} />
 *   <OTPInput length={4} value={otp} onChange={setOtp} error />
 *   <OTPInput length={6} separator={<span className="mx-1">-</span>} />
 */
import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
  useMemo,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { motion, MotionConfig } from "framer-motion";
import { useReducedMotion } from "@/shared/motion";
import type { OTPInputProps } from "./types";
import {
  getWrapperClasses,
  getCellsContainerClasses,
  getCellClasses,
  getHiddenInputClasses,
  getLabelClasses,
} from "./styles";

// ── Helpers ─────────────────────────────────────────────────────

/** Convert a string value into a fixed-length array of single characters (or empty strings). */
function valueToDigits(value: string, length: number): string[] {
  const arr = value.split("").slice(0, length);
  while (arr.length < length) arr.push("");
  return arr;
}

// ── OTPInput ─────────────────────────────────────────────────────

export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  function OTPInput(
    {
      length = 6,
      value: controlledValue,
      defaultValue,
      onChange,
      onComplete,
      autoFocus = true,
      disabled = false,
      error = false,
      size = "md",
      separator,
      label,
      placeholder = "",
      className,
      "aria-label": ariaLabel = "Verification code",
    },
    ref,
  ) {
    const generatedId = useId();
    const labelId = `${generatedId}-label`;
    const hiddenInputId = `${generatedId}-hidden`;
    const cellsId = `${generatedId}-cells`;

    // Internal state as fixed-length array — preserves positional empty cells
    const [internalDigits, setInternalDigits] = useState<string[]>(() =>
      valueToDigits(defaultValue ?? "", length),
    );
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const digitsRef = useRef<string[]>(internalDigits);
    const onCompleteRef = useRef(onComplete);
    const onChangeRef = useRef(onChange);
    const reduced = useReducedMotion();

    // Keep refs in sync for callbacks that may have stale closures
    onCompleteRef.current = onComplete;
    onChangeRef.current = onChange;

    // ── Derived state ─────────────────────────────────────────

    const currentDigits = useMemo(
      () =>
        controlledValue !== undefined
          ? valueToDigits(controlledValue, length)
          : internalDigits,
      [controlledValue, internalDigits, length],
    );

    // Keep ref in sync for callbacks that may have stale closures
    digitsRef.current = currentDigits;

    const currentValue = useMemo(
      () => currentDigits.join(""),
      [currentDigits],
    );

    // ── Focus management ──────────────────────────────────────

    const focusCell = useCallback(
      (index: number) => {
        const clamped = Math.max(0, Math.min(index, length - 1));
        inputRefs.current[clamped]?.focus();
        setFocusedIndex(clamped);
      },
      [length],
    );

    // ── Auto-focus on mount ───────────────────────────────────

    useEffect(() => {
      if (autoFocus === true) {
        // Focus first empty cell
        const firstEmpty = currentDigits.findIndex((d) => d === "");
        focusCell(firstEmpty >= 0 ? firstEmpty : 0);
      } else if (typeof autoFocus === "number") {
        focusCell(autoFocus);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Update internal value ─────────────────────────────────

    const updateValue = useCallback(
      (newDigits: string[]) => {
        const joined = newDigits.join("");
        setInternalDigits(newDigits);
        onChangeRef.current?.(joined);

        // joined.length === length means all cells are filled
        // (empty cells produce shorter joined string)
        if (joined.length === length) {
          onCompleteRef.current?.(joined);
        }
      },
      [length],
    );

    // ── Handle single cell input ──────────────────────────────

    const handleCellChange = useCallback(
      (index: number, inputValue: string) => {
        // Take only the last character typed
        const digit = inputValue.replace(/\D/g, "").slice(-1);

        // Use ref to always read the latest digits (avoids stale closure)
        const newDigits = [...digitsRef.current];
        newDigits[index] = digit;
        updateValue(newDigits);

        // Auto-advance to next empty cell
        if (digit && index < length - 1) {
          // Find next empty cell
          const nextEmpty = newDigits.findIndex(
            (d, i) => i > index && d === "",
          );
          if (nextEmpty >= 0) {
            focusCell(nextEmpty);
          } else {
            focusCell(index + 1);
          }
        }
      },
      [length, updateValue, focusCell],
    );

    // ── Handle keydown (navigation) ───────────────────────────

    const handleKeyDown = useCallback(
      (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowLeft" && index > 0) {
          e.preventDefault();
          focusCell(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1) {
          e.preventDefault();
          focusCell(index + 1);
        } else if (e.key === "Backspace") {
          e.preventDefault();
          const newDigits = [...digitsRef.current];

          if (newDigits[index]) {
            // Clear current cell
            newDigits[index] = "";
            updateValue(newDigits);
          } else if (index > 0) {
            // Move to previous and clear
            newDigits[index - 1] = "";
            updateValue(newDigits);
            focusCell(index - 1);
          }
        } else if (e.key === "Delete") {
          e.preventDefault();
          const newDigits = [...digitsRef.current];
          newDigits[index] = "";
          updateValue(newDigits);
        } else if (e.key === "Home") {
          e.preventDefault();
          focusCell(0);
        } else if (e.key === "End") {
          e.preventDefault();
          focusCell(length - 1);
        }
      },
      [length, updateValue, focusCell],
    );

    // ── Handle paste ──────────────────────────────────────────

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, length);

        if (pasted) {
          const newDigits = valueToDigits(pasted, length);
          updateValue(newDigits);

          // Focus last filled cell or next empty
          const lastFilled = pasted.length - 1;
          focusCell(Math.min(lastFilled, length - 1));
        }
      },
      [length, updateValue, focusCell],
    );

    // ── Focus/Blur handlers ───────────────────────────────────

    const handleCellFocus = useCallback((index: number) => {
      setFocusedIndex(index);
      // Select the content for easy replacement
      inputRefs.current[index]?.select();
    }, []);

    const handleCellBlur = useCallback(() => {
      setFocusedIndex(null);
    }, []);

    // ── Render ────────────────────────────────────────────────

    return (
      <MotionConfig reducedMotion="user">
        <div className={getWrapperClasses(className)}>
          {/* Label */}
          {label && (
            <label id={labelId} className={getLabelClasses()}>
              {label}
            </label>
          )}

          {/* Cells container */}
          <div
            id={cellsId}
            className={getCellsContainerClasses()}
            role="group"
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? ariaLabel : undefined}
          >
            {Array.from({ length }, (_, index) => {
              const digit = currentDigits[index] ?? "";
              const isFilled = digit !== "";
              const isActive = focusedIndex === index;

              return (
                <motion.span
                  key={index}
                  className="inline-flex"
                  animate={
                    reduced
                      ? {}
                      : isFilled
                        ? { scale: [1, 1.08, 1] }
                        : {}
                  }
                  transition={{ duration: 0.15 }}
                >
                  {/* Separator between groups (6-digit only) */}
                  {length === 6 && index === 3 && separator && (
                    <span className="mr-2 flex items-center text-text-tertiary">
                      {separator}
                    </span>
                  )}

                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                      // Expose first input via forwarded ref
                      if (index === 0 && ref) {
                        if (typeof ref === "function") ref(el);
                        else (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={1}
                    disabled={disabled}
                    value={digit}
                    placeholder={placeholder}
                    aria-label={`Digit ${index + 1} of ${length}`}
                    className={getCellClasses(size, isFilled, error, isActive)}
                    onChange={(e) => handleCellChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    onFocus={() => handleCellFocus(index)}
                    onBlur={handleCellBlur}
                  />
                </motion.span>
              );
            })}
          </div>

          {/* Hidden input for form submission */}
          <input
            id={hiddenInputId}
            type="text"
            name={ariaLabel}
            value={currentValue}
            readOnly
            className={getHiddenInputClasses()}
            autoComplete="one-time-code"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </MotionConfig>
    );
  },
);
