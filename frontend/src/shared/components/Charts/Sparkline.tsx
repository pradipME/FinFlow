import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ChartPoint } from "./chart-utils";
import { buildSmoothPath, buildXScale, buildYScale, resolveColor } from "./chart-utils";

interface SparklineProps {
  data: ChartPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Sparkline — minimal inline trend line for stat cards.
 */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  color,
  strokeWidth = 2,
}: SparklineProps): ReactNode {
  const stroke = resolveColor(color, "var(--ff-chart-1, #34d399)");
  const scale = buildYScale(data);
  const xs = buildXScale(data, width);
  const path = buildSmoothPath(data, xs, scale, height);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden="true">
      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}