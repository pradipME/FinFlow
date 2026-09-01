/**
 * Theme Tokens — AMOLED
 *
 * True black (#000000) for OLED power savings. Mirrors the "FinFlow Ink"
 * dark palette, with true-black base and slightly brighter borders/hairlines
 * for visibility against black.
 */
import type { ThemeConfig } from "../types";

export const amoledTokens: ThemeConfig = {
  name: "amoled",
  label: "AMOLED",
  isDark: true,
  tokens: {
    /* ── Background ── */
    "bg-primary": "#000000",
    "bg-secondary": "#06080C",
    "bg-tertiary": "#0C1119",
    "bg-inverse": "#FFFFFF",

    /* ── Surface ── */
    "surface-primary": "#080C12",
    "surface-secondary": "#0E141E",
    "surface-tertiary": "#151D29",
    "surface-hover": "#101722",
    "surface-active": "#1B2432",

    /* ── Border ── */
    "border-default": "#1B2432",
    "border-subtle": "#101722",
    "border-strong": "#2A3547",

    /* ── Text ── */
    "text-primary": "#F1F4F9",
    "text-secondary": "#9EAAB9",
    "text-tertiary": "#6A7789",
    "text-inverse": "#0B0F16",
    "text-disabled": "#48566C",

    /* ── Brand / Primary — signature emerald ── */
    "color-primary": "#2FD6A3",
    "color-primary-hover": "#57E2B8",
    "color-primary-active": "#1FB88B",
    "color-primary-subtle": "rgba(47,214,163,0.10)",

    /* ── Semantic ── */
    "color-success": "#34D399",
    "color-success-subtle": "rgba(52,211,153,0.10)",
    "color-warning": "#FBBF24",
    "color-warning-subtle": "rgba(251,191,36,0.10)",
    "color-danger": "#FB7185",
    "color-danger-subtle": "rgba(251,113,133,0.10)",
    "color-info": "#38BDF8",
    "color-info-subtle": "rgba(56,189,248,0.10)",

    /* ── Financial status ── */
    "color-credit": "#34D399",
    "color-debit": "#FB7185",
    "color-pending": "#FBBF24",
    "color-held": "#A78BFA",
    "color-failed": "#F87171",
    "color-reversed": "#8A94A6",
    "color-scheduled": "#38BDF8",
    "color-settled": "#34D399",

    /* ── Chart palette ── */
    "chart-1": "#34D399",
    "chart-2": "#818CF8",
    "chart-3": "#38BDF8",
    "chart-4": "#FBBF24",
    "chart-5": "#FB7185",
    "chart-6": "#A78BFA",
    "chart-7": "#22D3EE",
    "chart-8": "#F59E0B",
    "chart-9": "#2FD6A3",
    "chart-10": "#FDA4AF",
    "chart-11": "#94A3B8",
    "chart-12": "#64748B",

    /* ── Glass morphism ── */
    "glass-bg": "rgba(8,12,18,0.80)",
    "glass-border": "rgba(255,255,255,0.06)",
    "glass-blur": "blur(20px)",
    "glass-shadow": "0 12px 40px rgba(0,0,0,0.60)",

    /* ── Elevation ── */
    "elevation-xs": "0 1px 2px rgba(0,0,0,0.35)",
    "elevation-sm": "0 1px 3px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.36)",
    "elevation-md": "0 4px 8px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.36)",
    "elevation-lg": "0 12px 24px rgba(0,0,0,0.50), 0 4px 8px rgba(0,0,0,0.32)",
    "elevation-xl": "0 24px 48px rgba(0,0,0,0.55), 0 8px 16px rgba(0,0,0,0.30)",
    "elevation-2xl": "0 32px 64px rgba(0,0,0,0.70)",

    /* ── Gradients ── */
    "gradient-primary": "linear-gradient(135deg, #1FB88B 0%, #2FD6A3 50%, #38BDF8 100%)",
    "gradient-success": "linear-gradient(135deg, #059669, #34D399)",
    "gradient-warm": "linear-gradient(135deg, #F59E0B, #FB7185)",
    "gradient-cool": "linear-gradient(135deg, #0EA5E9, #818CF8)",
    "gradient-surface": "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
    "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",

    /* ── Aurora premium ── */
    "aurora-1": "#10B981",
    "aurora-2": "#38BDF8",
    "aurora-3": "#818CF8",
    "aurora-gradient": "linear-gradient(135deg, #10B981, #38BDF8, #818CF8)",
    "aurora-glow": "0 0 48px rgba(16,185,129,0.2)",

    /* ── Focus ring ── */
    "focus-ring": "0 0 0 2px #000000, 0 0 0 4px #2FD6A3",
    "focus-ring-offset": "0 0 0 2px #000000",

    /* ── Input ── */
    "input-bg": "#06090E",
    "input-border": "#232E41",
    "input-border-focus": "#2FD6A3",
    "input-placeholder": "#4E5B70",
  },
};