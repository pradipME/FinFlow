import { useReducedMotion } from "framer-motion";

export interface ChartDatum {
  label: string;
  value: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartSeries {
  name: string;
  data: ChartPoint[];
  color?: string;
}

export function resolveColor(color?: string, fallback?: string): string {
  return color ?? fallback ?? "var(--ff-chart-1, #34d399)";
}

export function useChartMotion(): { reduce: boolean; transition: { duration: number } } {
  const reduced = useReducedMotion();
  return { reduce: !!reduced, transition: { duration: reduced ? 0 : 0.55 } };
}

/**
 * Domain helpers — build a padded numeric scale.
 */
export function buildXScale(points: ChartPoint[], width: number, padding = 8): number[] {
  if (points.length <= 1) return [width / 2];
  const step = (width - padding * 2) / (points.length - 1);
  return points.map((_, i) => padding + i * step);
}

export function buildYScale(points: ChartPoint[]): { min: number; max: number } {
  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const range = max - min;
  return {
    min: min - range * 0.08,
    max: max + range * 0.12,
  };
}

export function yPosition(value: number, scale: { min: number; max: number }, height: number, padding = 6): number {
  return height - padding - ((value - scale.min) / (scale.max - scale.min)) * (height - padding * 2);
}

export function buildPath(points: ChartPoint[], xs: number[], scale: { min: number; max: number }, height: number): string {
  if (points.length === 0) return "";
  const y = (p: ChartPoint) => yPosition(p.value, scale, height);
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${y(p).toFixed(1)}`)
    .join(" ");
}

export function buildSmoothPath(points: ChartPoint[], xs: number[], scale: { min: number; max: number }, height: number): string {
  if (points.length < 2) return buildPath(points, xs, scale, height);
  const y = (p: ChartPoint) => yPosition(p.value, scale, height);
  let d = `M${xs[0].toFixed(1)},${y(points[0]).toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prevX = xs[i - 1];
    const prevY = y(points[i - 1]);
    const x = xs[i];
    const cy = y(points[i]);
    const midX = (prevX + x) / 2;
    d += ` C${midX.toFixed(1)},${prevY.toFixed(1)} ${midX.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${cy.toFixed(1)}`;
  }
  return d;
}

export function buildAreaPath(path: string, height: number): string {
  if (!path) return "";
  const last = path.trim().split(/\s+/).pop()?.split(",") ?? ["0", "0"];
  const x = parseFloat(last[0].replace(/[A-Za-z]/g, ""));
  return `${path} L${x.toFixed(1)},${height} L0,${height} Z`;
}

export function formatAxisValue(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

export function useChartDimensions(width: number | undefined, height: number): { width: number; height: number } {
  const w = width ?? 0;
  return { width: w > 0 ? w : 320, height };
}