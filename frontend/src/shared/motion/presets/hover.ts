/**
 * Motion Preset — Hover / Press
 *
 * Interactive feedback presets for whileHover and whileTap.
 * These are NOT variant objects — they are flat Framer Motion targets.
 *
 * Usage:
 *   <motion.button whileHover={hoverLift} whileTap={pressScale} />
 */
import type { TargetAndTransition, Transition } from "framer-motion";
import { duration, easing, spring as springTokens } from "../tokens";

// ── Hover States ─────────────────────────────────────────────────

/** Lift card slightly on hover with shadow shift */
export const hoverLift: TargetAndTransition = {
  y: -2,
  transition: { duration: duration.fast / 1000, ease: easing.out },
};

/** Subtle scale up on hover */
export const hoverScale: TargetAndTransition = {
  scale: 1.02,
  transition: { duration: duration.faster / 1000, ease: easing.out },
};

/** Glow effect — scale + shadow (use with custom boxShadow) */
export const hoverGlow: TargetAndTransition = {
  scale: 1.01,
  boxShadow: "0 8px 30px rgba(37, 99, 235, 0.12)",
  transition: { duration: duration.fast / 1000, ease: easing.out },
};

/** Brightness lift — for images and icons */
export const hoverBright: TargetAndTransition = {
  filter: "brightness(1.08)",
  transition: { duration: duration.faster / 1000, ease: easing.out },
};

// ── Tap / Press States ───────────────────────────────────────────

/** Standard press scale-down */
export const pressScale: TargetAndTransition = {
  scale: 0.97,
  transition: { duration: duration.fastest / 1000, ease: easing.sharp },
};

/** Aggressive press — for destructive actions */
export const pressDeep: TargetAndTransition = {
  scale: 0.95,
  transition: { duration: duration.fastest / 1000, ease: easing.sharp },
};

/** Spring press — bouncy feedback */
export const pressSpring: TargetAndTransition = {
  scale: 0.96,
  transition: springTokens.snappy as unknown as Transition,
};

// ── Combined States ──────────────────────────────────────────────

/** Default button interaction — hover lift + press scale */
export const buttonInteraction = {
  whileHover: hoverLift,
  whileTap: pressScale,
} as const;

/** Card interaction — subtle hover lift + press scale */
export const cardInteraction = {
  whileHover: hoverLift,
  whileTap: pressScale,
} as const;

/** Icon button — spring press */
export const iconButtonInteraction = {
  whileHover: hoverScale,
  whileTap: pressSpring,
} as const;
