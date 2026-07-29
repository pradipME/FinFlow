/**
 * Skeleton
 *
 * Eight layout variants with pulse, shimmer, or static animation.
 * Respects OS prefers-reduced-motion — falls back to static.
 * Decorative element — aria-hidden by default.
 *
 * @example
 *   <Skeleton variant="text" width="200px" />
 *   <Skeleton variant="avatar" />
 *   <Skeleton variant="card" />
 *   <Skeleton variant="custom" width={300} height={100} rounded={12} />
 */
import { motion } from "framer-motion";
import { useReducedMotion, skeletonShimmer } from "@/shared/motion";
import type { SkeletonProps, SkeletonVariant, SkeletonAnimation } from "./types";
import {
  BASE_CLASSES,
  ANIMATION_CLASSES,
  SHIMMER_GRADIENT,
  SHIMMER_BACKGROUND_SIZE,
  VARIANT_DEFAULTS,
  LINE_WIDTHS,
  INNER_GAP,
} from "./constants";

// ── Helpers ──────────────────────────────────────────────────────

function toCss(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function mergeStyle(
  ...sources: Array<Record<string, string | number | undefined>>
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const src of sources) {
    for (const [k, v] of Object.entries(src)) {
      if (v !== undefined) out[k] = v;
    }
  }
  return out;
}

// ── Single Block ─────────────────────────────────────────────────

interface BlockProps {
  width?: string;
  height?: string;
  rounded?: string;
  circle?: boolean;
  animation: SkeletonAnimation;
  reduced: boolean;
  className?: string;
}

function Block({ width, height, rounded, circle, animation, reduced, className }: BlockProps) {
  const effectiveAnimation: SkeletonAnimation = reduced ? "static" : animation;

  const blockClasses = [
    BASE_CLASSES,
    effectiveAnimation === "pulse" ? ANIMATION_CLASSES.pulse : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const blockStyle = mergeStyle(
    { width, height },
    circle ? { borderRadius: "50%" } : rounded ? { borderRadius: toCss(rounded) } : {},
  );

  if (effectiveAnimation === "shimmer") {
    return (
      <motion.div
        className={blockClasses}
        style={{
          ...blockStyle,
          background: SHIMMER_GRADIENT,
          backgroundSize: SHIMMER_BACKGROUND_SIZE,
        }}
        animate={skeletonShimmer.animate as unknown as Record<string, string[]>}
        transition={skeletonShimmer.transition}
        aria-hidden="true"
      />
    );
  }

  return <div className={blockClasses} style={blockStyle} aria-hidden="true" />;
}

// ── Variant Renderers ────────────────────────────────────────────

function TextSkeleton(props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean }) {
  const defaults = VARIANT_DEFAULTS.text;
  return (
    <Block
      width={toCss(props.width) ?? defaults.width}
      height={toCss(props.height) ?? defaults.height}
      rounded={toCss(props.rounded) ?? defaults.rounded}
      circle={props.circle}
      animation={props.animation}
      reduced={props.reduced}
    />
  );
}

function AvatarSkeleton(props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean }) {
  const defaults = VARIANT_DEFAULTS.avatar;
  return (
    <Block
      width={toCss(props.width) ?? defaults.width}
      height={toCss(props.height) ?? defaults.height}
      circle={true}
      animation={props.animation}
      reduced={props.reduced}
    />
  );
}

function CardSkeleton(props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean }) {
  const widths = LINE_WIDTHS.card;
  const gap = INNER_GAP.card;

  return (
    <div className="flex flex-col" style={{ gap }} aria-hidden="true">
      {/* Header block */}
      <Block
        width="40%"
        height="14px"
        rounded="4px"
        animation={props.animation}
        reduced={props.reduced}
      />
      {/* Content lines */}
      {widths.map((w, i) => (
        <Block
          key={i}
          width={w}
          height={toCss(props.height) ?? "10px"}
          rounded="4px"
          animation={props.animation}
          reduced={props.reduced}
        />
      ))}
    </div>
  );
}

function TableRowSkeleton(
  props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean },
) {
  const widths = LINE_WIDTHS.tableRow;
  const gap = INNER_GAP.tableRow;

  return (
    <div className="flex items-center" style={{ gap }} aria-hidden="true">
      {widths.map((w, i) => (
        <Block
          key={i}
          width={w}
          height={toCss(props.height) ?? VARIANT_DEFAULTS.tableRow.height}
          rounded="4px"
          animation={props.animation}
          reduced={props.reduced}
        />
      ))}
    </div>
  );
}

function ChartSkeleton(props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean }) {
  const defaults = VARIANT_DEFAULTS.chart;
  return (
    <Block
      width={toCss(props.width) ?? defaults.width}
      height={toCss(props.height) ?? defaults.height}
      rounded={toCss(props.rounded) ?? defaults.rounded}
      animation={props.animation}
      reduced={props.reduced}
    />
  );
}

function ListItemSkeleton(
  props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean },
) {
  const widths = LINE_WIDTHS.listItem;
  const gap = INNER_GAP.listItem;

  return (
    <div className="flex items-center" style={{ gap }} aria-hidden="true">
      <Block
        width="40px"
        height="40px"
        circle
        animation={props.animation}
        reduced={props.reduced}
      />
      <div className="flex flex-col" style={{ gap: "8px", flex: 1 }}>
        {widths.map((w, i) => (
          <Block
            key={i}
            width={w}
            height={i === 0 ? "12px" : "10px"}
            rounded="4px"
            animation={props.animation}
            reduced={props.reduced}
          />
        ))}
      </div>
    </div>
  );
}

function DashboardWidgetSkeleton(
  props: SkeletonProps & { animation: SkeletonAnimation; reduced: boolean },
) {
  const widths = LINE_WIDTHS.dashboardWidget;
  const gap = INNER_GAP.dashboardWidget;

  return (
    <div className="flex flex-col" style={{ gap }} aria-hidden="true">
      {/* Title bar */}
      <Block
        width={widths[0]}
        height="16px"
        rounded="4px"
        animation={props.animation}
        reduced={props.reduced}
      />
      {/* Content block */}
      <Block
        width="100%"
        height={toCss(props.height) ?? "120px"}
        rounded="8px"
        animation={props.animation}
        reduced={props.reduced}
      />
      {/* Footer lines */}
      {widths.slice(1, 3).map((w, i) => (
        <Block
          key={i}
          width={w}
          height="10px"
          rounded="4px"
          animation={props.animation}
          reduced={props.reduced}
        />
      ))}
    </div>
  );
}

// ── Variant Dispatch ─────────────────────────────────────────────

type VariantRenderer = React.FC<SkeletonProps & { animation: SkeletonAnimation; reduced: boolean }>;

const VARIANT_RENDERERS: Record<SkeletonVariant, VariantRenderer> = {
  text: TextSkeleton,
  avatar: AvatarSkeleton,
  card: CardSkeleton,
  tableRow: TableRowSkeleton,
  chart: ChartSkeleton,
  listItem: ListItemSkeleton,
  dashboardWidget: DashboardWidgetSkeleton,
  custom: TextSkeleton, // uses Block directly with user dimensions
};

// ── Skeleton ─────────────────────────────────────────────────────

export function Skeleton({
  variant = "text",
  width,
  height,
  rounded,
  circle,
  animation = "pulse",
  className,
}: SkeletonProps) {
  const reduced = useReducedMotion();
  const Renderer = VARIANT_RENDERERS[variant];

  // Custom variant: render a single Block with user dimensions
  if (variant === "custom") {
    return (
      <div className={className} role="presentation">
        <Block
          width={toCss(width) ?? VARIANT_DEFAULTS.custom.width}
          height={toCss(height) ?? VARIANT_DEFAULTS.custom.height}
          rounded={toCss(rounded) ?? (circle ? "50%" : VARIANT_DEFAULTS.custom.rounded)}
          circle={circle}
          animation={animation}
          reduced={reduced}
        />
      </div>
    );
  }

  return (
    <div className={className} role="presentation">
      <Renderer
        variant={variant}
        width={width}
        height={height}
        rounded={rounded}
        circle={circle}
        animation={animation}
        reduced={reduced}
      />
    </div>
  );
}
