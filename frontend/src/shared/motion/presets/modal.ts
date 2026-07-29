/**
 * Motion Preset — Modal
 *
 * Backdrop fade + content scale for modal dialogs.
 * Backdrop and content are separate variant sets.
 *
 * Usage:
 *   <motion.div variants={modalBackdrop} ... />  // backdrop
 *   <motion.div variants={modalContent} ... />   // content
 */
import type { Variants } from "framer-motion";
import { duration, easing, blur as blurTokens } from "../tokens";

/** Modal backdrop — fade + blur */
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: `blur(${blurTokens.none}px)`,
  },
  visible: {
    opacity: 1,
    backdropFilter: `blur(${blurTokens.md}px)`,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    backdropFilter: `blur(${blurTokens.none}px)`,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Modal content — scale from center + fade */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.moderate / 1000,
      ease: easing.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Modal content — spring version for playful feel */
export const modalContentSpring: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Alert/confirm dialog — slide up + scale */
export const alertDialog: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.moderate / 1000,
      ease: easing.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};
