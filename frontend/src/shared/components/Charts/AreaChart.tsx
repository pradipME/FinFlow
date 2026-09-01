import { useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { ChartPoint } from "./chart-utils";
import {
  buildAreaPath,
  buildSmoothPath,
  buildXScale,
  buildYScale,
  formatAxisValue,
  resolveColor,
  yPosition,
} from "./chart-utils";

interface AreaChartProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
  fill?: boolean;
  grid?: boolean;
  valueFormat?: (value: number) => string;
}

/**
 * AreaChart — lightweight SVG area/line chart with smooth curves,
 * gradient fill, and optional dotted gridlines. No external chart deps.
 */
export function AreaChart({
  data,
  height = 220,
  color,
  fill = true,
  grid = true,
  valueFormat,
}: AreaChartProps): ReactNode {
  const id = useId();
  const width = 600;
  const stroke = resolveColor(color);
  const scale = buildYScale(data);
  const xs = buildXScale(data, width);
  const linePath = buildSmoothPath(data, xs, scale, height);
  const areaPath = fill ? buildAreaPath(linePath, height) : "";
  const fmt = valueFormat ?? formatAxisValue;

  const gridLines = [0.25, 0.5, 0.75].map((f) => f * height);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Area chart"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
        {color && (
          <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={stroke} />
            <stop offset="100%" stopColor="var(--ff-chart-3, #38bdf8)" />
          </linearGradient>
        )}
      </defs>

      {grid &&
        gridLines.map((gy) => (
          <line key={gy} x1="0" x2={width} y1={gy} y2={gy} stroke="var(--ff-border-subtle, #161e2b)" strokeDasharray="3 4" strokeWidth="1" />
        ))}

      {areaPath && <path d={areaPath} fill={`url(#${id}-fill)`} />}

      <motion.path
        d={linePath}
        fill="none"
        stroke={`url(#${id}-line)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {data.map((point, i) => (
        <motion.circle
          key={`${point.label}-${i}`}
          cx={xs[i]}
          cy={yPosition(point.value, scale, height)}
          r="3.5"
          fill="var(--ff-surface-primary, #111722)"
          stroke={stroke}
          strokeWidth="2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.03 }}
        >
          <title>
            {point.label}: {fmt(point.value)}
          </title>
        </motion.circle>
      ))}
    </svg>
  );
}