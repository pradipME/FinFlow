/**
 * Spinner
 *
 * Four animation variants (ring, dots, pulse, bars) across five sizes.
 * Supports inline, overlay, and fullscreen display modes.
 * Respects OS prefers-reduced-motion.
 *
 * @example
 *   <Spinner />
 *   <Spinner variant="dots" size="lg" label="Sending message..." />
 *   <Spinner mode="overlay" />
 *   <Spinner mode="fullscreen" label="Loading your account..." />
 */
import { motion, MotionConfig } from "framer-motion";
import { useReducedMotion, duration, easing } from "@/shared/motion";
import type { SpinnerProps, SpinnerSize } from "./types";
import {
  MODE_CLASSES,
  SIZE_CLASSES,
  SPINNER_DIMENSION,
  RING_STROKE_WIDTH,
  DOT_DIMENSION,
  BAR_DIMENSIONS,
  LABEL_SIZE_CLASSES,
} from "./constants";

// ── Ring Variant ─────────────────────────────────────────────────

function RingGraphic({ size }: { size: SpinnerSize }) {
  const stroke = RING_STROKE_WIDTH[size];
  const dim = SPINNER_DIMENSION[size];
  const r = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      fill="none"
      className="text-brand-primary"
    >
      {/* Background track */}
      <circle
        cx={dim / 2}
        cy={dim / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        opacity={0.15}
      />
      {/* Animated arc */}
      <motion.circle
        cx={dim / 2}
        cy={dim / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
        animate={{ rotate: 360 }}
        transition={{
          duration: duration.slowest / 1000,
          ease: easing.out,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}

// ── Dots Variant ─────────────────────────────────────────────────

function DotsGraphic({ size }: { size: SpinnerSize }) {
  const dotDim = DOT_DIMENSION[size];

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full bg-brand-primary"
          style={{ width: dotDim, height: dotDim }}
          animate={{
            y: [-dotDim * 0.4, 0, -dotDim * 0.4],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: duration.normal / 1000,
            ease: easing["in-out"],
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// ── Pulse Variant ────────────────────────────────────────────────

function PulseGraphic({ size }: { size: SpinnerSize }) {
  const dim = SPINNER_DIMENSION[size];

  return (
    <motion.span
      className="rounded-full bg-brand-primary"
      style={{ width: dim, height: dim }}
      animate={{ scale: [1, 1.25, 1], opacity: [0.4, 1, 0.4] }}
      transition={{
        duration: duration.slowest / 1000,
        ease: easing["in-out"],
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  );
}

// ── Bars Variant ─────────────────────────────────────────────────

function BarsGraphic({ size }: { size: SpinnerSize }) {
  const { width, height } = BAR_DIMENSIONS[size];

  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="rounded-sm bg-brand-primary"
          style={{ width }}
          animate={{ height: [height * 0.35, height, height * 0.35] }}
          transition={{
            duration: duration.normal / 1000,
            ease: easing["in-out"],
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// ── Reduced-Motion Static Variants ───────────────────────────────

function StaticRing({ size }: { size: SpinnerSize }) {
  const stroke = RING_STROKE_WIDTH[size];
  const dim = SPINNER_DIMENSION[size];
  const r = (dim - stroke) / 2;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      fill="none"
      className="text-brand-primary"
    >
      <circle
        cx={dim / 2}
        cy={dim / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * r * 0.25} ${2 * Math.PI * r * 0.75}`}
      />
    </svg>
  );
}

function StaticDots({ size }: { size: SpinnerSize }) {
  const dotDim = DOT_DIMENSION[size];

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full bg-brand-primary"
          style={{ width: dotDim, height: dotDim, opacity: 0.6 }}
        />
      ))}
    </div>
  );
}

function StaticPulse({ size }: { size: SpinnerSize }) {
  const dim = SPINNER_DIMENSION[size];

  return (
    <span
      className="rounded-full bg-brand-primary"
      style={{ width: dim, height: dim, opacity: 0.6 }}
    />
  );
}

function StaticBars({ size }: { size: SpinnerSize }) {
  const { width, height } = BAR_DIMENSIONS[size];

  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="rounded-sm bg-brand-primary"
          style={{ width, height: height * (0.5 + i * 0.15) }}
        />
      ))}
    </div>
  );
}

// ── Variant Dispatch ─────────────────────────────────────────────

type GraphicFC = React.FC<{ size: SpinnerSize }>;

const GRAPHICS: Record<string, GraphicFC> = {
  ring: RingGraphic,
  dots: DotsGraphic,
  pulse: PulseGraphic,
  bars: BarsGraphic,
};

const STATIC_GRAPHICS: Record<string, GraphicFC> = {
  ring: StaticRing,
  dots: StaticDots,
  pulse: StaticPulse,
  bars: StaticBars,
};

// ── Spinner ──────────────────────────────────────────────────────

export function Spinner({
  variant = "ring",
  size = "md",
  mode = "inline",
  label,
  className,
}: SpinnerProps) {
  const reduced = useReducedMotion();

  const Graphic = reduced ? STATIC_GRAPHICS[variant] : GRAPHICS[variant];

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label ?? "Loading"}
        className={[
          MODE_CLASSES[mode],
          SIZE_CLASSES[size],
          mode === "inline" ? "flex-col" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Graphic size={size} />

        {label && (
          <span className={["font-medium text-text-secondary", LABEL_SIZE_CLASSES[size]].join(" ")}>
            {label}
          </span>
        )}

        {/* Screen-reader only text */}
        <span className="sr-only">{label ?? "Loading"}</span>
      </div>
    </MotionConfig>
  );
}
