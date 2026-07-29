/**
 * Motion Engine — Utilities
 *
 * Pure helper functions for building, composing, and adapting animations.
 * Zero React dependency — safe in workers, tests, SSR.
 */
import type { Variants, Transition } from "framer-motion";
import { duration, easing } from "../tokens";

// ── Stagger Calculator ───────────────────────────────────────────

/**
 * Calculate stagger delay for a list of N items.
 * Returns a `staggerChildren` value for the parent variant
 * and `delayChildren` for the initial offset.
 */
export function staggerConfig(
  itemCount: number,
  opts?: { totalDuration?: number; delayChildren?: number },
): Transition {
  const total = opts?.totalDuration ?? 0.4;
  const stagger = itemCount > 1 ? total / (itemCount - 1) : 0;
  return {
    staggerChildren: stagger,
    delayChildren: opts?.delayChildren ?? 0,
  };
}

/**
 * Individual child delay based on index.
 * Use when you need manual index-based staggering.
 */
export function childDelay(index: number, staggerMs = 50): number {
  return index * staggerMs;
}

// ── Reduced Motion Fallback ──────────────────────────────────────

/**
 * Wraps a Variants object so that all transitions use duration: 0
 * when reduced motion is requested.
 */
export function withReducedMotion(
  variants: Variants,
  reducedMotion: boolean,
): Variants {
  if (!reducedMotion) return variants;

  const safe: Variants = {};
  for (const [state, target] of Object.entries(variants)) {
    if (typeof target === "object" && target !== null) {
      // Replace transition with instant, keep all other properties
      const { transition: _old, ...rest } = target as Record<string, unknown>;
      safe[state] = { ...rest, transition: { duration: 0 } };
    } else {
      safe[state] = target;
    }
  }
  return safe;
}

// ── Variant Builders ─────────────────────────────────────────────

/**
 * Build a simple fade variant set from raw opacity values and duration.
 */
export function buildFadeVariant(opts?: {
  from?: number;
  to?: number;
  enterMs?: number;
  exitMs?: number;
  enterEasing?: [number, number, number, number];
  exitEasing?: [number, number, number, number];
}): Variants {
  const from = opts?.from ?? 0;
  const to = opts?.to ?? 1;
  const enterMs = opts?.enterMs ?? duration.normal;
  const exitMs = opts?.exitMs ?? duration.fast;

  return {
    hidden: { opacity: from },
    visible: {
      opacity: to,
      transition: {
        duration: enterMs / 1000,
        ease: opts?.enterEasing ?? easing.out,
      },
    },
    exit: {
      opacity: from,
      transition: {
        duration: exitMs / 1000,
        ease: opts?.exitEasing ?? easing.in,
      },
    },
  };
}

/**
 * Build a slide variant set from direction and distance.
 */
export function buildSlideVariant(
  direction: "up" | "down" | "left" | "right",
  distancePx = 24,
  opts?: { enterMs?: number; exitMs?: number },
): Variants {
  const enterMs = opts?.enterMs ?? duration.moderate;
  const exitMs = opts?.exitMs ?? duration.fast;

  const axis = direction === "up" || direction === "down" ? ("y" as const) : ("x" as const);
  const sign = direction === "down" || direction === "right" ? 1 : -1;

  // Build objects explicitly per-axis to avoid computed-property type issues
  const hidden = axis === "y"
    ? { opacity: 0, y: distancePx * sign }
    : { opacity: 0, x: distancePx * sign };

  const visibleTarget = axis === "y"
    ? { opacity: 1, y: 0 }
    : { opacity: 1, x: 0 };

  const exitTarget = axis === "y"
    ? { opacity: 0, y: (distancePx * sign) / 2 }
    : { opacity: 0, x: (distancePx * sign) / 2 };

  return {
    hidden,
    visible: {
      ...visibleTarget,
      transition: { duration: enterMs / 1000, ease: easing.out },
    },
    exit: {
      ...exitTarget,
      transition: { duration: exitMs / 1000, ease: easing.in },
    },
  };
}

// ── Compose Variants ─────────────────────────────────────────────

/**
 * Deep-merge two Variants objects. The second takes precedence.
 * Useful for overriding specific states of a preset.
 */
export function mergeVariants(base: Variants, override: Variants): Variants {
  const result: Variants = {};
  const allKeys = new Set([...Object.keys(base), ...Object.keys(override)]);

  for (const key of allKeys) {
    const baseVal = base[key];
    const overVal = override[key];

    if (overVal !== undefined && baseVal !== undefined && typeof baseVal === "object" && typeof overVal === "object" && baseVal !== null && overVal !== null) {
      result[key] = { ...(baseVal as object), ...(overVal as object) };
    } else if (overVal !== undefined) {
      result[key] = overVal;
    } else if (baseVal !== undefined) {
      result[key] = baseVal;
    }
  }

  return result;
}
