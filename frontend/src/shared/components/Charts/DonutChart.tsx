import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ChartDatum } from "./chart-utils";
import { resolveColor } from "./chart-utils";

interface DonutChartProps {
  data: ChartDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  valueFormat?: (value: number) => string;
}

const PALETTE = [
  "var(--ff-chart-1, #34d399)",
  "var(--ff-chart-2, #818cf8)",
  "var(--ff-chart-3, #38bdf8)",
  "var(--ff-chart-4, #fbbf24)",
  "var(--ff-chart-5, #fb7185)",
  "var(--ff-chart-6, #a78bfa)",
];

/**
 * DonutChart — SVG donut with animated sweep and legend.
 */
export function DonutChart({
  data,
  size = 180,
  thickness = 22,
  centerLabel,
  centerValue,
  valueFormat,
}: DonutChartProps): ReactNode {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const fmt = valueFormat ?? ((v: number) => `${v}`);
  const cx = size / 2;

  let offset = 0;

  const segments = data.map((datum, i) => {
    const fraction = total > 0 ? datum.value / total : 0;
    const segment = { ...datum, fraction, color: PALETTE[i % PALETTE.length] };
    offset += fraction;
    return segment;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={cx}
            cy={cx}
            r={radius}
            fill="none"
            stroke="var(--ff-bg-tertiary, #131a24)"
            strokeWidth={thickness}
          />
          {segments.map((segment, i) => (
            <motion.circle
              key={segment.label + i}
              cx={cx}
              cy={cx}
              r={radius}
              fill="none"
              stroke={resolveColor(undefined, segment.color)}
              strokeWidth={thickness}
              strokeDasharray={`${circumference * segment.fraction} ${circumference}`}
              strokeDashoffset={-circumference * (segments[i - 1] ? segments.slice(0, i).reduce((s, seg) => s + seg.fraction, 0) : 0)}
              strokeLinecap="butt"
              initial={{ opacity: 0, strokeDasharray: `0 ${circumference}` }}
              whileInView={{ opacity: 1, strokeDasharray: `${circumference * segment.fraction} ${circumference}` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
            >
              <title>
                {segment.label}: {fmt(segment.value)}
              </title>
            </motion.circle>
          ))}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <span className="font-tabular text-xl font-bold text-text-primary">{centerValue}</span>
            )}
            {centerLabel && <span className="text-xs text-text-tertiary">{centerLabel}</span>}
          </div>
        )}
      </div>

      <ul className="flex-1 space-y-2.5">
        {segments.map((segment, i) => (
          <li key={segment.label + i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-text-secondary">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[4px]"
                style={{ background: resolveColor(undefined, segment.color) }}
              />
              {segment.label}
            </span>
            <span className="font-tabular text-sm font-semibold text-text-primary">
              {fmt(segment.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}