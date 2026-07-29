/**
 * IconButton — Core Component
 *
 * A specialized button that renders only an icon with no text label.
 * Reuses Button's style constants but owns its own motion integration
 * (iconButtonVariants with spring physics) and rendering loop.
 *
 * Two orthogonal axes:
 *   shape:  circle | square
 *   variant: filled | ghost | outline
 */
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { motion, MotionConfig, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { useReducedMotion, iconButtonVariants } from "@/shared/motion";
import type { IconButtonProps } from "./types";
import { getIconButtonClasses } from "./styles";
import { SPINNER_SIZE } from "./constants";

/**
 * IconButton — icon-only button with shape and variant control.
 *
 * @example
 * <IconButton shape="circle" variant="ghost" aria-label="Close dialog">
 *   <X />
 * </IconButton>
 *
 * @example
 * <IconButton shape="square" variant="outline" aria-label="Edit" isLoading>
 *   <Pencil />
 * </IconButton>
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    children,
    shape = "circle",
    variant = "filled",
    size = "md",
    isLoading = false,
    isDisabled = false,
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

  // IconButton uses spring-based iconButtonVariants instead of standard buttonVariants
  const motionProps: HTMLMotionProps<"button"> = reducedMotion
    ? {}
    : {
        variants: iconButtonVariants,
        initial: "rest",
        whileHover: effectiveDisabled ? undefined : "hover",
        whileTap: effectiveDisabled ? undefined : "press",
      };

  const spinnerSize = SPINNER_SIZE[size];

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <motion.button
        ref={internalRef}
        type={type}
        disabled={effectiveDisabled}
        aria-disabled={effectiveDisabled}
        aria-busy={isLoading}
        className={cn(
          getIconButtonClasses({
            shape,
            variant,
            size,
            isDisabled: effectiveDisabled,
            isLoading,
          }),
          className,
        )}
        onClick={handleClick}
        {...motionProps}
        {...(rest as Omit<HTMLMotionProps<"button">, keyof IconButtonProps>)}
      >
        {isLoading ? (
          <span className="inline-flex shrink-0 items-center justify-center">
            <Loader2 size={spinnerSize} className="animate-spin" />
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center justify-center">{children}</span>
        )}
      </motion.button>
    </MotionConfig>
  );
});

IconButton.displayName = "IconButton";

export { IconButton };
