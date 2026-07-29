/**
 * Motion Preset — Fade
 *
 * Opacity-only transitions. No transforms, no layout shift.
 * Use for: tooltips, popovers, notifications, any appear/disappear.
 *
 * Usage:
 *   <motion.div variants={fade} initial="hidden" animate="visible" exit="exit" />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

/** Fade in/out — standard speed */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Fade in — slow (for emphasis) */
export const fadeSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};

/** Fade in — fast (for quick feedback) */
export const fadeFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fastest / 1000, ease: easing.in },
  },
};

/** Fade in with slight upward drift — for content appearing */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Fade in with slight downward drift */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};
