/**
 * Motion Engine — Provider
 *
 * Wraps the app in Framer Motion's <MotionConfig> with:
 *  - reducedMotion="user" — defers to OS prefers-reduced-motion
 *  - Global default transition (200ms ease-out)
 *  - Exposes reducedMotion boolean via context for non-Framer consumers
 */
import { createContext, useContext, useMemo } from "react";
import { MotionConfig } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { duration, easing } from "../tokens";

// ── Context ──────────────────────────────────────────────────────

interface MotionContextValue {
  /** Whether the user prefers reduced motion */
  reducedMotion: boolean;
}

const MotionContext = createContext<MotionContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────

interface MotionProviderProps {
  children: React.ReactNode;
  /** Optional global transition override */
  globalTransition?: React.ComponentProps<typeof MotionConfig>["transition"];
}

export function MotionProvider({
  children,
  globalTransition,
}: MotionProviderProps) {
  const reducedMotion = useReducedMotion();

  // Default transition — used by any <motion.*> that doesn't specify its own
  const defaultTransition = useMemo(
    () =>
      globalTransition ??
      (reducedMotion
        ? { duration: 0 }
        : {
            duration: duration.normal / 1000,
            ease: easing.out,
          }),
    [globalTransition, reducedMotion],
  );

  const ctxValue = useMemo(() => ({ reducedMotion }), [reducedMotion]);

  return (
    <MotionContext.Provider value={ctxValue}>
      <MotionConfig
        transition={defaultTransition}
        reducedMotion="user"
      >
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────

/**
 * Access the motion context from any component inside <MotionProvider>.
 * Returns reducedMotion boolean.
 */
export function useMotionContext(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error(
      "[FinFlow] useMotionContext() must be used within a <MotionProvider>.",
    );
  }
  return ctx;
}
