/**
 * Motion Variants — Dialog
 *
 * Complete variant map for dialog and confirmation modals.
 * Composes modal backdrop + content presets with confirm-specific animations.
 *
 * Usage:
 *   <motion.div variants={dialogVariants} initial="hidden" animate="visible" exit="exit" />
 */
import type { Variants } from "framer-motion";
import { duration, easing, blur as blurTokens } from "../tokens";

/** Standard dialog — backdrop + content */
export const dialogVariants: Variants = {
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

/** Dialog content panel */
export const dialogPanelVariants: Variants = {
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

/** Confirm dialog — slide up with spring */
export const confirmDialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 32 },
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
    scale: 0.96,
    y: 16,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Dialog backdrop with blur */
export const dialogBackdropVariants: Variants = {
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

/** Dialog stagger container — children reveal sequentially */
export const dialogStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/** Dialog stagger child item */
export const dialogChildItem: Variants = {
  hidden: { opacity: 0, y: 8 },
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
