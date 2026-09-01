import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ChartDatum } from "./chart-utils";
import { resolveColor } from "./chart-utils";

interface BarChartProps {
  data: ChartDatum[];
  height?: number;
  color?: string;
  orientation?: "vertical" | "horizontal";
  valueFormat?: (value: number) => string;
}

/**
 * BarChart — lightweight SVG bar chart. Vertical by default
 * (e.g., monthly spend by category), horizontal for comparisons.
 */
export function BarChart({
  data,
  height = 220,
  color,
  orientation = "vertical",
  valueFormat,
}: BarChartProps): ReactNode {
  const fmt = valueFormat ?? ((v: number) => `${v}`);

  const max = Math.max(1, ...data.map((d) => d.value));

  if (orientation === "horizontal") {
    return (
      <div className="flex flex-col gap-3">
        {data.map((datum, i) => {
          const pct = (datum.value / max) * 100;
          const barColor = resolveColor(color, "var(--ff-chart-1, #34d399)");
          return (
            <div key={datum.label + i} className="group">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-text-secondary">{datum.label}</span>
                <span className="font-tabular font-semibold text-text-primary">{fmt(datum.value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${barColor}, color-mix(in srgb, ${barColor} 70%, transparent))` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex w-full items-end gap-2" style={{ height }}>
      {data.map((datum, i) => {
        const pct = Math.max(4, (datum.value / max) * 100);
        const barColor = resolveColor(color, `var(--ff-chart-${(i % 8) + 1}, #34d399)`);
        return (
          <div key={datum.label + i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[11px] font-medium text-text-primary opacity-0 transition-opacity group-hover:opacity-100">
              {fmt(datum.value)}
            </span>
            <div className="flex h-full w-full items-end overflow-hidden rounded-md bg-bg-tertiary">
              <motion.div
                className="w-full rounded-md"
                style={{ background: `linear-gradient(180deg, ${barColor}, color-mix(in srgb, ${barColor} 45%, transparent))` }}
                initial={{ height: 0 }}
                whileInView={{ height: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
            <span className="truncate text-[10px] font-medium text-text-tertiary">{datum.label}</span>
          </div>
        );
      })}
    </div>
  );
}