/**
 * Motion Preset — Drawer
 *
 * Full-height side panels that slide in from an edge.
 * Panel uses pure translate; backdrop fades separately.
 *
 * Usage:
 *   <motion.div variants={drawerRight} ... />
 *   <motion.div variants={drawerBackdrop} ... />  // optional overlay
 */
import type { Variants } from "framer-motion";
import { duration, easing, blur as blurTokens } from "../tokens";

// ── Backdrop ─────────────────────────────────────────────────────

/** Drawer backdrop — fade + blur */
export const drawerBackdrop: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: `blur(${blurTokens.none}px)`,
  },
  visible: {
    opacity: 1,
    backdropFilter: `blur(${blurTokens.sm}px)`,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    backdropFilter: `blur(${blurTokens.none}px)`,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

// ── Right Drawer ─────────────────────────────────────────────────

/** Slide in from right edge */
export const drawerRight: Variants = {
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

// ── Left Drawer ──────────────────────────────────────────────────

/** Slide in from left edge */
export const drawerLeft: Variants = {
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

// ── Top Drawer ───────────────────────────────────────────────────

/** Slide in from top (for notification panels) */
export const drawerTop: Variants = {
  hidden: { y: "-100%" },
  visible: {
    y: 0,
    transition: { duration: duration.slow / 1000, ease: easing.out },
  },
  exit: {
    y: "-100%",
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};

// ── Bottom Drawer (Sheet) ────────────────────────────────────────

/** Slide up from bottom — for mobile sheets */
export const drawerBottom: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: duration.slow / 1000, ease: easing.out },
  },
  exit: {
    y: "100%",
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};
