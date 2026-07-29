/**
 * Motion Preset — Page Transitions
 *
 * Full-page enter/exit for react-router-dom route changes.
 * Used with <AnimatePresence> in a layout wrapper.
 *
 * Usage:
 *   <AnimatePresence mode="wait">
 *     <motion.div key={location.pathname} variants={pageSlide} initial="hidden" animate="visible" exit="exit">
 *       <Outlet />
 *     </motion.div>
 *   </AnimatePresence>
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

/** Page fade — simplest transition */
export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Page slide up — new page rises from below */
export const pageSlide: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Page slide left — for forward navigation */
export const pageSlideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};

/** Page slide right — for backward navigation */
export const pageSlideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};

/** Page zoom — subtle scale for modals / overlays */
export const pageZoom: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    scale: 1.01,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};
