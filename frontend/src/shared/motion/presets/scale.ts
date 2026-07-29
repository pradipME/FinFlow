/**
 * Motion Preset — Scale
 *
 * Scale-based transitions — grow in, shrink out.
 * Use for: dropdowns, context menus, popovers, confirmation dialogs.
 *
 * Usage:
 *   <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit" />
 */
import type { Variants } from "framer-motion";
import { duration, easing, scale as s } from "../tokens";

/** Scale in from 92% with fade */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: s.hidden },
  visible: {
    opacity: 1,
    scale: s.resting,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    scale: s.hidden,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Scale in from center — for modals */
export const scaleCenter: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Scale in with spring physics — for playful feedback */
export const scaleSpring: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Pop-in — quick scale from 0 with spring overshoot */
export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 12, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: duration.fastest / 1000, ease: easing.in },
  },
};

/** Scale up and fade — for expanding content */
export const scaleExpand: Variants = {
  hidden: { opacity: 0, scaleY: 0, originY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    scaleY: 0,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};
