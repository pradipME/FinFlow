/**
 * Motion Engine — Type Definitions
 *
 * Central type vocabulary for all animation tokens, presets, and variants.
 * Every motion file imports types from here.
 */
import type { CSSProperties } from "react";
import type { Variants as FmVariants, Transition, TargetAndTransition } from "framer-motion";

// ── Duration ─────────────────────────────────────────────────────

/** Named duration tokens — maps to DESIGN_SYSTEM.md §5.9 */
export type DurationToken =
  | "instant"
  | "fastest"
  | "faster"
  | "fast"
  | "normal"
  | "moderate"
  | "slow"
  | "slower"
  | "slowest";

/** Raw millisecond values for each duration token */
export const DURATION_MS: Record<DurationToken, number> = {
  instant: 0,
  fastest: 50,
  faster: 100,
  fast: 150,
  normal: 200,
  moderate: 300,
  slow: 400,
  slower: 500,
  slowest: 700,
};

// ── Easing ───────────────────────────────────────────────────────

/** Named easing curves — maps to DESIGN_SYSTEM.md §5.9 */
export type EasingName =
  | "default"
  | "in"
  | "out"
  | "in-out"
  | "spring"
  | "spring-soft"
  | "sharp";

/** CSS cubic-bezier strings for each easing name */
export const EASINGVALUES: Record<EasingName, string> = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "spring-soft": "cubic-bezier(0.22, 1.0, 0.36, 1.0)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
};

// ── Spring Physics ───────────────────────────────────────────────

/** Named spring presets for Framer Motion spring transitions */
export interface SpringPreset {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

export type SpringName =
  | "gentle"
  | "wobbly"
  | "stiff"
  | "slow"
  | "molasses"
  | "bouncy"
  | "snappy";

// ── Framer Motion Variant Types ──────────────────────────────────

/** Re-export with our own alias for clarity */
export type Variants = FmVariants;

/** A single variant state — what Framer Motion calls a "target" */
export type VariantState = TargetAndTransition;

/** Transition config — either a named token or full Framer config */
export type MotionTransition = Transition;

// ── Preset Shape ─────────────────────────────────────────────────

/**
 * Every preset file exports an object matching this shape.
 * Keys are state names (e.g., "hidden", "visible", "exit").
 * Values are Framer Motion variant targets.
 */
export type PresetVariants = Record<string, VariantState>;

/**
 * A motion preset bundles variants with an optional default transition.
 */
export interface MotionPreset {
  variants: PresetVariants;
  transition?: MotionTransition;
}

// ── Utility Types ────────────────────────────────────────────────

/** CSS transform properties that are GPU-accelerated */
export interface GpuTransform {
  x?: string | number;
  y?: string | number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
}

/** Convenience type for building inline animation styles */
export type AnimationStyle = CSSProperties & GpuTransform;
