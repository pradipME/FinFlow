/**
 * Motion Preset — Toast
 *
 * Toast notification enter/exit and stacking.
 * Designed for Sonner or custom toast containers.
 *
 * Usage:
 *   <motion.div variants={toastEnter} initial="hidden" animate="visible" exit="exit" />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

/** Toast enter — slide in from right + fade */
export const toastEnter: Variants = {
  hidden: {
    opacity: 0,
    x: 80,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: duration.moderate / 1000,
      ease: easing.out,
    },
  },
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Toast exit — fade + slide right */
export const toastExit: Variants = {
  hidden: { opacity: 1, x: 0 },
  visible: {
    opacity: 0,
    x: 40,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Toast stack — push existing toasts up */
export const toastStack: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.normal / 1000,
      ease: easing.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Toast success — subtle bounce on appear */
export const toastSuccess: Variants = {
  hidden: { opacity: 0, x: 80, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};
