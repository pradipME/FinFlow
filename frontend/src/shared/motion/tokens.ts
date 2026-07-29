/**
 * Motion Engine — Tokens
 *
 * Centralized numeric values for all animations.
 * sourced from DESIGN_SYSTEM.md §5.9.
 *
 * RULE: No animation file hardcodes a number.
 *       Every value is imported from here.
 */
import type { EasingName, SpringName, SpringPreset } from "./types";
import { DURATION_MS } from "./types";

// ── Duration (milliseconds) ──────────────────────────────────────

export const duration = DURATION_MS;

// ── Easing (Framer Motion format) ────────────────────────────────
// Framer Motion accepts [x1, y1, x2, y2] tuples for cubic-bezier.

type EasingTuple = [number, number, number, number];

export const easing: Record<EasingName, EasingTuple> = {
  default: [0.4, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
  "in-out": [0.4, 0, 0.2, 1],
  spring: [0.34, 1.56, 0.64, 1],
  "spring-soft": [0.22, 1.0, 0.36, 1.0],
  sharp: [0.4, 0, 0.6, 1],
};

// ── Spring Physics ───────────────────────────────────────────────

export const spring: Record<SpringName, SpringPreset> = {
  gentle: { type: "spring", stiffness: 120, damping: 14, mass: 1 },
  wobbly: { type: "spring", stiffness: 180, damping: 12, mass: 1 },
  stiff: { type: "spring", stiffness: 210, damping: 26, mass: 1 },
  slow: { type: "spring", stiffness: 280, damping: 60, mass: 1 },
  molasses: { type: "spring", stiffness: 120, damping: 50, mass: 1 },
  bouncy: { type: "spring", stiffness: 260, damping: 10, mass: 0.8 },
  snappy: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 },
};

// ── Scale ────────────────────────────────────────────────────────

export const scale = {
  /** Fully hidden — used by scale-in enter */
  hidden: 0.92,
  /** Resting state */
  resting: 1,
  /** Subtle press feedback */
  pressed: 0.97,
  /** Hover lift micro-scale */
  hover: 1.02,
  /** Modal backdrop dim */
  backdrop: 0.95,
} as const;

// ── Opacity ──────────────────────────────────────────────────────

export const opacity = {
  /** Fully transparent */
  hidden: 0,
  /** Subtle hint */
  hint: 0.4,
  /** Standard disabled / secondary */
  disabled: 0.5,
  /** Default visible */
  visible: 1,
} as const;

// ── Blur (pixels) ────────────────────────────────────────────────

export const blur = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  "2xl": 40,
} as const;

// ── Distance (pixels) — translate offsets ────────────────────────

export const distance = {
  /** Tight — inline elements, small cards */
  xs: 8,
  /** Standard — buttons, inputs */
  sm: 12,
  /** Medium — cards, list items */
  md: 16,
  /** Large — sections, panels */
  lg: 24,
  /** XL — modals, drawers */
  xl: 40,
  /** Page-level transitions */
  "2xl": 64,
} as const;

// ── Rotation (degrees) ──────────────────────────────────────────

export const rotation = {
  /** Subtle tilt — hover feedback */
  subtle: -2,
  /** Standard tilt */
  tilt: -4,
  /** Full spin — loading indicators */
  spin: 360,
} as const;
