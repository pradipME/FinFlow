/**
 * Badge — Core Component
 *
 * Inline status/label element. Renders as:
 *   <span>    — default (non-interactive)
 *   <button>  — when onClick is provided
 *   <a>       — when href is provided
 *
 * Integrates with Theme Engine tokens and Motion Engine hover/tap
 * feedback when interactive.
 */
import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/shared/utils";
import { useReducedMotion, hoverScale, pressScale } from "@/shared/motion";
import type { BadgeVariant, BadgeSize, BadgeShape, FinancialStatus } from "./types";
import { getBadgeClasses, getDotColorClass } from "./styles";
import { ICON_SIZE, DOT_SIZE } from "./constants";

// ── Props ────────────────────────────────────────────────────────

interface BadgeBaseProps {
  children: ReactNode;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  size?: BadgeSize;
  financialStatus?: FinancialStatus;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showDot?: boolean;
  dotColor?: string;
  className?: string;
}

interface BadgeSpanProps extends BadgeBaseProps {
  onClick?: never;
  href?: never;
}

interface BadgeButtonProps extends BadgeBaseProps {
  onClick: () => void;
  href?: never;
}

interface BadgeLinkProps extends BadgeBaseProps {
  href: string;
  onClick?: never;
}

type BadgeProps = BadgeSpanProps | BadgeButtonProps | BadgeLinkProps;

// ── Helpers ──────────────────────────────────────────────────────

function DotIndicator({
  size,
  variant,
  financialStatus,
  dotColor,
}: {
  size: BadgeSize;
  variant: BadgeVariant;
  financialStatus?: FinancialStatus;
  dotColor?: string;
}) {
  const pixelSize = DOT_SIZE[size];
  const colorClass = dotColor ?? getDotColorClass(variant, financialStatus);

  return (
    <span
      className={cn("inline-block shrink-0 rounded-full", colorClass)}
      style={{ width: pixelSize, height: pixelSize }}
      aria-hidden="true"
    />
  );
}

function BadgeIcon({ children, size }: { children: ReactNode; size: BadgeSize }) {
  const px = ICON_SIZE[size];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────

/**
 * Badge — inline status/label element.
 *
 * @example
 * <Badge variant="success" size="sm">Active</Badge>
 *
 * @example
 * <Badge variant="financial" financialStatus="credit" showDot>
 *   +$1,200.00
 * </Badge>
 *
 * @example
 * <Badge variant="outline" shape="pill" onClick={() => {}}>
 *   Dismissible
 * </Badge>
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    variant = "primary",
    shape = "rounded",
    size = "md",
    financialStatus,
    leftIcon,
    rightIcon,
    showDot = false,
    dotColor,
    className,
    ...rest
  },
  ref,
) {
  const reducedMotion = useReducedMotion();
  const isClickable = "onClick" in rest && typeof rest.onClick === "function";
  const isLink = "href" in rest && typeof rest.href === "string";

  const classes = cn(
    getBadgeClasses({
      variant,
      size,
      shape,
      isClickable: isClickable || isLink,
      financialStatus,
      hasDot: showDot,
    }),
    className,
  );

  const content = (
    <>
      {showDot && (
        <DotIndicator
          size={size}
          variant={variant}
          financialStatus={financialStatus}
          dotColor={dotColor}
        />
      )}
      {leftIcon && <BadgeIcon size={size}>{leftIcon}</BadgeIcon>}
      {children}
      {rightIcon && <BadgeIcon size={size}>{rightIcon}</BadgeIcon>}
    </>
  );

  // ── Link badge ──────────────────────────────────────────────
  if (isLink) {
    const { href, ...linkRest } = rest as { href: string; [k: string]: unknown };
    const motionProps: HTMLMotionProps<"a"> = reducedMotion
      ? {}
      : { whileHover: hoverScale, whileTap: pressScale };
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...motionProps}
        {...(linkRest as Omit<HTMLMotionProps<"a">, "href" | "className" | "children">)}
      >
        {content}
      </motion.a>
    );
  }

  // ── Clickable badge (button) ────────────────────────────────
  if (isClickable) {
    const { onClick, ...buttonRest } = rest as {
      onClick: () => void;
      [k: string]: unknown;
    };
    const motionProps: HTMLMotionProps<"button"> = reducedMotion
      ? {}
      : { whileHover: hoverScale, whileTap: pressScale };
    return (
      <motion.button
        type="button"
        className={classes}
        onClick={onClick}
        {...motionProps}
        {...(buttonRest as Omit<
          HTMLMotionProps<"button">,
          "type" | "className" | "children" | "onClick"
        >)}
      >
        {content}
      </motion.button>
    );
  }

  // ── Static badge (span) ─────────────────────────────────────
  return (
    <span ref={ref} className={classes} {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>
      {content}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge };
