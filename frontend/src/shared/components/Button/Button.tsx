/**
 * Button — Core Component
 *
 * The foundational interactive element of the FinFlow design system.
 * Supports 9 visual variants, 5 sizes, icons, loading state, and
 * full keyboard/ARIA accessibility. Integrates with the Motion Engine
 * for hover/tap feedback and respects prefers-reduced-motion.
 */
import { forwardRef, useCallback, useImperativeHandle, useRef, type ReactNode } from "react";
import { motion, MotionConfig, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { useReducedMotion, buttonVariants, buttonSpinnerVariants } from "@/shared/motion";
import type { ButtonProps } from "./types";
import { getButtonClasses } from "./styles";
import { ICON_SIZE, SPINNER_SIZE } from "./constants";

/**
 * Internal loading spinner rendered inside the button.
 */
function ButtonSpinner({ size }: { size: ButtonProps["size"] }): ReactNode {
  const s = SPINNER_SIZE[size ?? "md"];
  return (
    <motion.span
      variants={buttonSpinnerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="inline-flex shrink-0 items-center justify-center"
    >
      <Loader2 size={s} className="animate-spin" />
    </motion.span>
  );
}

/**
 * Button — the primary interactive component.
 *
 * @example
 * <Button variant="primary" size="md" leftIcon={<Save />}>
 *   Save Changes
 * </Button>
 *
 * @example
 * <Button variant="danger" isLoading>
 *   Deleting...
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = false,
    isDisabled = false,
    isIconOnly = false,
    className,
    disabled,
    type = "button",
    onClick,
    ...rest
  },
  ref,
) {
  const internalRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => internalRef.current!, []);

  const reducedMotion = useReducedMotion();
  const effectiveDisabled = disabled || isDisabled || isLoading;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (effectiveDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    },
    [effectiveDisabled, onClick],
  );

  // Determine which motion variant set to use
  const motionProps: HTMLMotionProps<"button"> = reducedMotion
    ? {}
    : {
        variants: buttonVariants,
        initial: "rest",
        whileHover: effectiveDisabled ? undefined : "hover",
        whileTap: effectiveDisabled ? undefined : "press",
      };

  const iconSize = ICON_SIZE[size];

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <motion.button
        ref={internalRef}
        type={type}
        disabled={effectiveDisabled}
        aria-disabled={effectiveDisabled}
        aria-busy={isLoading}
        className={cn(
          getButtonClasses({
            variant,
            size,
            fullWidth,
            isDisabled: effectiveDisabled,
            isLoading,
            isIconOnly,
          }),
          className,
        )}
        onClick={handleClick}
        {...motionProps}
        {...(rest as Omit<HTMLMotionProps<"button">, keyof ButtonProps>)}
      >
        {/* Loading state: replace left icon with spinner */}
        {isLoading ? (
          <ButtonSpinner size={size} />
        ) : (
          leftIcon && (
            <span className="inline-flex shrink-0" style={{ width: iconSize, height: iconSize }}>
              {leftIcon}
            </span>
          )
        )}

        {/* Label — hidden when icon-only */}
        {!isIconOnly && <span className={cn(isLoading && "opacity-70")}>{children}</span>}

        {/* Right icon — hidden during loading */}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0" style={{ width: iconSize, height: iconSize }}>
            {rightIcon}
          </span>
        )}
      </motion.button>
    </MotionConfig>
  );
});

Button.displayName = "Button";

export { Button };
