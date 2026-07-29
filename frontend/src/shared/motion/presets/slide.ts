/**
 * Motion Preset — Slide
 *
 * Directional slide transitions with optional opacity.
 * Use for: drawers, page transitions, mobile menus, list items.
 *
 * Usage:
 *   <motion.div variants={slideUp} initial="hidden" animate="visible" exit="exit" />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

// ── Vertical ─────────────────────────────────────────────────────

/** Slide up from below */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Slide down from above */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

// ── Horizontal ───────────────────────────────────────────────────

/** Slide in from the right */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    x: 16,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Slide in from the left */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

// ── Pure (no opacity) ────────────────────────────────────────────

/** Pure slide up — no fade, for stacked layouts */
export const slideUpPure: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    y: "100%",
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Pure slide down — no fade */
export const slideDownPure: Variants = {
  hidden: { y: "-100%" },
  visible: {
    y: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    y: "-100%",
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Pure slide left — no fade, for full-height panels */
export const slideLeftPure: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: duration.slow / 1000, ease: easing.out },
  },
  exit: {
    x: "100%",
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};

/** Pure slide right — no fade */
export const slideRightPure: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: duration.slow / 1000, ease: easing.out },
  },
  exit: {
    x: "-100%",
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};
