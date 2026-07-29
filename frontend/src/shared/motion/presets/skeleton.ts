/**
 * Motion Preset — Skeleton
 *
 * Loading skeleton pulse animation.
 * This is a transition config, not a variant — applied via `animate`.
 *
 * Usage:
 *   <motion.div
 *     animate={skeletonPulse.animate}
 *     transition={skeletonPulse.transition}
 *     className="bg-surface-tertiary"
 *   />
 *
 *   Or use the keyframes directly:
 *   <div className="animate-pulse bg-surface-tertiary" />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

/** Skeleton pulse — smooth opacity oscillation */
export const skeletonPulse = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
  },
  transition: {
    duration: duration.slowest / 1000,
    ease: easing["in-out"],
    repeat: Infinity,
    repeatType: "loop" as const,
  },
} as const;

/** Skeleton shimmer — translate a highlight gradient across the element */
export const skeletonShimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
  },
  transition: {
    duration: 1.8,
    ease: easing["in-out"],
    repeat: Infinity,
    repeatType: "loop" as const,
  },
} as const;

/** Skeleton fade-in — element appears as content loads */
export const skeletonFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
};
