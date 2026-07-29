/**
 * Motion Variants — Button
 *
 * Complete variant map for button components.
 * Composes hover, press, focus, and loading states.
 *
 * Usage:
 *   <motion.button variants={buttonVariants} whileHover="hover" whileTap="press" />
 */
import type { Variants } from "framer-motion";
import { duration, easing, spring as springTokens } from "../tokens";

export const buttonVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: { duration: duration.fast / 1000, ease: easing.out },
  },
  press: {
    scale: 0.97,
    y: 0,
    transition: { duration: duration.fastest / 1000, ease: easing.sharp },
  },
  focus: {
    scale: 1,
    outline: "2px solid var(--ff-color-primary)",
    outlineOffset: "2px",
  },
  loading: {
    scale: 1,
    cursor: "wait",
  },
  disabled: {
    scale: 1,
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

/** Ghost / link button — minimal feedback */
export const ghostButtonVariants: Variants = {
  rest: {
    scale: 1,
    backgroundColor: "transparent",
  },
  hover: {
    scale: 1,
    backgroundColor: "var(--ff-surface-hover)",
    transition: { duration: duration.faster / 1000, ease: easing.out },
  },
  press: {
    scale: 0.98,
    backgroundColor: "var(--ff-surface-active)",
    transition: { duration: duration.fastest / 1000, ease: easing.sharp },
  },
};

/** Icon button — spring press */
export const iconButtonVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.08,
    rotate: 0,
    transition: springTokens.gentle,
  },
  press: {
    scale: 0.92,
    rotate: 0,
    transition: springTokens.snappy,
  },
};

/** Loading spinner inside button */
export const buttonSpinnerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -90 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotate: 90,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};
