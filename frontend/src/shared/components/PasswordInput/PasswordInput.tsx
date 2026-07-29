/**
 * PasswordInput
 *
 * Enterprise password field that composes <Input> and adds:
 *   - Visibility toggle (show/hide)
 *   - Caps Lock detection with accessible warning
 *   - Autocomplete semantics (current-password / new-password)
 *   - Strength indicator slot (consumer-provided ReactNode)
 *   - Optional security restrictions (paste/copy/cut/context menu)
 *
 * Zero duplicated input logic — all delegated to Input.
 *
 * @example
 *   <PasswordInput label="Password" required autoComplete="new-password" />
 *   <PasswordInput
 *     label="Confirm Password"
 *     strengthIndicator={<StrengthBar score={3} />}
 *     disablePaste
 *   />
 */
import {
  forwardRef,
  useState,
  useCallback,
  useId,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { motion, MotionConfig } from "framer-motion";
import { useReducedMotion } from "@/shared/motion";
import { Input } from "../Input/Input";
import type { PasswordInputProps } from "./types";
import {
  getToggleButtonClasses,
  getCapsLockBannerClasses,
  getStrengthIndicatorClasses,
} from "./styles";

// ── Eye Icons (inline SVG) ───────────────────────────────────────

function EyeOpen() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── Caps Lock Icon ───────────────────────────────────────────────

function CapsLockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

// ── PasswordInput ────────────────────────────────────────────────

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      autoComplete = "current-password",
      strengthIndicator,
      disablePaste = false,
      disableCopy = false,
      disableCut = false,
      disableContextMenu = false,
      onCapsLockChange,
      disabled = false,
      readOnly = false,
      loading = false,
      onKeyDown,
      onPaste,
      onCopy,
      onCut,
      onContextMenu,
      className,
      ...rest
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);

    const generatedId = useId();
    const capsLockId = `${generatedId}-capslock`;
    const reduced = useReducedMotion();

    // ── Visibility Toggle ──────────────────────────────────────

    const toggleVisible = useCallback(() => {
      setVisible((prev) => !prev);
    }, []);

    // ── Caps Lock Detection ────────────────────────────────────

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        const isOn = e.getModifierState("CapsLock") === true;
        if (isOn !== capsLockOn) {
          setCapsLockOn(isOn);
          onCapsLockChange?.(isOn);
        }
        onKeyDown?.(e);
      },
      [capsLockOn, onCapsLockChange, onKeyDown],
    );

    const handleKeyUp = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        const isOn = e.getModifierState("CapsLock") === true;
        if (isOn !== capsLockOn) {
          setCapsLockOn(isOn);
          onCapsLockChange?.(isOn);
        }
      },
      [capsLockOn, onCapsLockChange],
    );

    // ── Security Restrictions ──────────────────────────────────

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        if (disablePaste) {
          e.preventDefault();
          return;
        }
        onPaste?.(e);
      },
      [disablePaste, onPaste],
    );

    const handleCopy = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        if (disableCopy) {
          e.preventDefault();
          return;
        }
        onCopy?.(e);
      },
      [disableCopy, onCopy],
    );

    const handleCut = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        if (disableCut) {
          e.preventDefault();
          return;
        }
        onCut?.(e);
      },
      [disableCut, onCut],
    );

    const handleContextMenu = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (disableContextMenu) {
          e.preventDefault();
          return;
        }
        onContextMenu?.(e);
      },
      [disableContextMenu, onContextMenu],
    );

    // ── Compose aria-describedby ───────────────────────────────

    const capsLockDescribedBy = capsLockOn ? capsLockId : undefined;
    const existingDescribedBy = rest["aria-describedby"];
    const describedBy =
      [existingDescribedBy, capsLockDescribedBy].filter(Boolean).join(" ") || undefined;

    // ── Render ─────────────────────────────────────────────────

    return (
      <MotionConfig reducedMotion="user">
        <div className={className ?? ""}>
          {/* Input + toggle wrapper (relative for toggle positioning) */}
          <div className="relative">
            <Input
              ref={ref}
              type={visible ? "text" : "password"}
              autoComplete={autoComplete}
              disabled={disabled}
              readOnly={readOnly}
              loading={loading}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onCut={handleCut}
              onContextMenu={handleContextMenu}
              aria-describedby={describedBy}
              {...rest}
            />

            {/* Visibility toggle — hidden when loading or disabled */}
            {!loading && !disabled && (
              <motion.button
                type="button"
                tabIndex={-1}
                aria-label={visible ? "Hide password" : "Show password"}
                className={getToggleButtonClasses()}
                onClick={toggleVisible}
                animate={reduced ? {} : { scale: [0.85, 1] }}
                transition={{ duration: 0.15 }}
              >
                {visible ? <EyeOpen /> : <EyeClosed />}
              </motion.button>
            )}
          </div>

          {/* Caps Lock warning */}
          {capsLockOn && !disabled && (
            <motion.p
              id={capsLockId}
              className={getCapsLockBannerClasses()}
              role="status"
              aria-live="polite"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CapsLockIcon />
              <span>Caps Lock is on</span>
            </motion.p>
          )}

          {/* Strength indicator slot */}
          {strengthIndicator && (
            <div className={getStrengthIndicatorClasses()}>{strengthIndicator}</div>
          )}
        </div>
      </MotionConfig>
    );
  },
);
