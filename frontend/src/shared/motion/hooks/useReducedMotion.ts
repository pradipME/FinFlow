/**
 * Motion Engine — useReducedMotion Hook
 *
 * Subscribes to the OS `prefers-reduced-motion` media query via
 * useSyncExternalStore. Returns `true` when the user has requested
 * reduced motion. Every animation preset checks this before applying
 * duration/spring transitions.
 *
 * Usage:
 *   const reduced = useReducedMotion();
 *   const variants = reduced ? instantFade : fade;
 */
import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_MEDIA } from "../constants";

function getSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_MEDIA).matches;
}

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION_MEDIA);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * Returns `true` when the user's OS preference is "reduce motion".
 * Safe to call in any component — no provider required.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
