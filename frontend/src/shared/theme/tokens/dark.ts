/**
 * Theme Tokens — Dark
 *
 * Deep charcoal backgrounds, elevated surfaces.
 * Designed FIRST per DESIGN_SYSTEM.md §6.1 (Dark Mode is Primary).
 */
import type { ThemeConfig } from "../types";

export const darkTokens: ThemeConfig = {
  name: "dark",
  label: "Dark",
  isDark: true,
  tokens: {
    /* ── Background (§6.2) ── */
    "bg-primary": "#0A0A0B",
    "bg-secondary": "#111113",
    "bg-tertiary": "#1A1A1E",
    "bg-inverse": "#FFFFFF",

    /* ── Surface (§6.2) ── */
    "surface-primary": "#141416",
    "surface-secondary": "#1C1C20",
    "surface-tertiary": "#232328",
    "surface-hover": "#1E1E22",
    "surface-active": "#2A2A30",

    /* ── Border (§6.2) ── */
    "border-default": "#2A2A30",
    "border-subtle": "#1E1E22",
    "border-strong": "#3A3A42",

    /* ── Text (§6.2) ── */
    "text-primary": "#F0F0F3",
    "text-secondary": "#A0A0AB",
    "text-tertiary": "#6E6E7A",
    "text-inverse": "#111827",
    "text-disabled": "#4A4A55",

    /* ── Brand / Primary — brightened for dark (§6.2) ── */
    "color-primary": "#4D8AFF",
    "color-primary-hover": "#6BA1FF",
    "color-primary-active": "#3D7AEE",
    "color-primary-subtle": "rgba(77,138,255,0.12)",

    /* ── Semantic — brightened (§6.4) ── */
    "color-success": "#4ADE80",
    "color-success-subtle": "rgba(74,222,128,0.12)",
    "color-warning": "#FBBF24",
    "color-warning-subtle": "rgba(251,191,36,0.12)",
    "color-danger": "#F87171",
    "color-danger-subtle": "rgba(248,113,113,0.12)",
    "color-info": "#22D3EE",
    "color-info-subtle": "rgba(34,211,238,0.12)",

    /* ── Financial status (§5.15 — dark column) ── */
    "color-credit": "#4ADE80",
    "color-debit": "#F87171",
    "color-pending": "#FBBF24",
    "color-held": "#C084FC",
    "color-failed": "#F87171",
    "color-reversed": "#9CA3AF",
    "color-scheduled": "#22D3EE",
    "color-settled": "#4ADE80",

    /* ── Chart palette — same as light (§5.14, designed for both) ── */
    "chart-1": "#2563EB",
    "chart-2": "#7C3AED",
    "chart-3": "#059669",
    "chart-4": "#D97706",
    "chart-5": "#DC2626",
    "chart-6": "#0891B2",
    "chart-7": "#DB2777",
    "chart-8": "#4F46E5",
    "chart-9": "#059669",
    "chart-10": "#EA580C",
    "chart-11": "#7C2D12",
    "chart-12": "#64748B",

    /* ── Glass morphism (§6.5) ── */
    "glass-bg": "rgba(20,20,22,0.72)",
    "glass-border": "rgba(255,255,255,0.08)",
    "glass-blur": "blur(16px)",
    "glass-shadow": "0 8px 32px rgba(0,0,0,0.40)",

    /* ── Elevation (§5.5 — stronger shadows for dark) ── */
    "elevation-xs": "0 1px 2px rgba(0,0,0,0.20)",
    "elevation-sm": "0 1px 3px rgba(0,0,0,0.30), 0 1px 2px rgba(0,0,0,0.24)",
    "elevation-md": "0 4px 6px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.24)",
    "elevation-lg": "0 10px 15px rgba(0,0,0,0.35), 0 4px 6px rgba(0,0,0,0.20)",
    "elevation-xl": "0 20px 25px rgba(0,0,0,0.35), 0 10px 10px rgba(0,0,0,0.16)",
    "elevation-2xl": "0 25px 50px rgba(0,0,0,0.50)",

    /* ── Gradients (§6.6 — slightly adjusted for dark) ── */
    "gradient-primary": "linear-gradient(135deg, #4D8AFF, #A78BFA)",
    "gradient-success": "linear-gradient(135deg, #22C55E, #4ADE80)",
    "gradient-warm": "linear-gradient(135deg, #FBBF24, #F87171)",
    "gradient-cool": "linear-gradient(135deg, #22D3EE, #60A5FA)",
    "gradient-surface": "linear-gradient(180deg, transparent, rgba(255,255,255,0.02))",
    "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",

    /* ── Aurora premium (§6.7) ── */
    "aurora-1": "#A78BFA",
    "aurora-2": "#C4B5FD",
    "aurora-3": "#DDD6FE",
    "aurora-gradient": "linear-gradient(135deg, #A78BFA, #22D3EE, #4ADE80)",
    "aurora-glow": "0 0 40px rgba(167,139,250,0.3)",

    /* ── Focus ring — light ring on dark bg ── */
    "focus-ring": "0 0 0 2px #141416, 0 0 0 4px #4D8AFF",
    "focus-ring-offset": "0 0 0 2px #141416",

    /* ── Input ── */
    "input-bg": "#141416",
    "input-border": "#3A3A42",
    "input-border-focus": "#4D8AFF",
    "input-placeholder": "#4A4A55",
  },
};
