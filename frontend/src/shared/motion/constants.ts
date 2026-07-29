/**
 * Motion Engine — Constants
 *
 * Single source of truth for motion-related constants.
 * Re-exports REDUCED_MOTION_MEDIA from theme for convenience.
 */

/** OS media query for reduced-motion preference */
export const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)" as const;

/** localStorage key for user override of reduced-motion */
export const REDUCED_MOTION_STORAGE_KEY = "finflow-reduced-motion" as const;

/** All named duration tokens */
export const DURATION_NAMES = [
  "instant",
  "fastest",
  "faster",
  "fast",
  "normal",
  "moderate",
  "slow",
  "slower",
  "slowest",
] as const;

/** All named easing curves */
export const EASING_NAMES = [
  "default",
  "in",
  "out",
  "in-out",
  "spring",
  "spring-soft",
  "sharp",
] as const;

/** All named spring presets */
export const SPRING_NAMES = [
  "gentle",
  "wobbly",
  "stiff",
  "slow",
  "molasses",
  "bouncy",
  "snappy",
] as const;
