/**
 * Theme Tokens — AMOLED
 *
 * True black (#000000) for OLED power savings.
 * Source: DESIGN_SYSTEM.md §6.3
 *
 * AMOLED rules:
 *  - Only bg-primary is true black
 *  - Elevated surfaces use dark grays (not black) for visual hierarchy
 *  - Borders slightly increased contrast for visibility against black
 *  - All semantic colors identical to dark theme
 */
import type { ThemeConfig } from "../types";

export const amoledTokens: ThemeConfig = {
  name: "amoled",
  label: "AMOLED",
  isDark: true,
  tokens: {
    /* ── Background (§6.3) ── */
    "bg-primary": "#000000",
    "bg-secondary": "#0A0A0A",
    "bg-tertiary": "#141414",
    "bg-inverse": "#FFFFFF",

    /* ── Surface (§6.3) ── */
    "surface-primary": "#0D0D0D",
    "surface-secondary": "#161616",
    "surface-tertiary": "#1E1E1E",
    "surface-hover": "#1A1A1A",
    "surface-active": "#282828",

    /* ── Border (§6.3 — slightly brighter against true black) ── */
    "border-default": "#222222",
    "border-subtle": "#181818",
    "border-strong": "#333333",

    /* ── Text (§6.3 — brighter for contrast) ── */
    "text-primary": "#F5F5F7",
    "text-secondary": "#A0A0AA",
    "text-tertiary": "#666670",
    "text-inverse": "#111827",
    "text-disabled": "#444450",

    /* ── Brand / Primary — same as dark ── */
    "color-primary": "#4D8AFF",
    "color-primary-hover": "#6BA1FF",
    "color-primary-active": "#3D7AEE",
    "color-primary-subtle": "rgba(77,138,255,0.10)",

    /* ── Semantic — identical to dark, lower opacity for subtles (§6.4) ── */
    "color-success": "#4ADE80",
    "color-success-subtle": "rgba(74,222,128,0.10)",
    "color-warning": "#FBBF24",
    "color-warning-subtle": "rgba(251,191,36,0.10)",
    "color-danger": "#F87171",
    "color-danger-subtle": "rgba(248,113,113,0.10)",
    "color-info": "#22D3EE",
    "color-info-subtle": "rgba(34,211,238,0.10)",

    /* ── Financial status — identical to dark (§5.15) ── */
    "color-credit": "#4ADE80",
    "color-debit": "#F87171",
    "color-pending": "#FBBF24",
    "color-held": "#C084FC",
    "color-failed": "#F87171",
    "color-reversed": "#9CA3AF",
    "color-scheduled": "#22D3EE",
    "color-settled": "#4ADE80",

    /* ── Chart palette — same across all themes (§5.14) ── */
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

    /* ── Glass morphism (§6.5 — heavier opacity against true black) ── */
    "glass-bg": "rgba(10,10,10,0.80)",
    "glass-border": "rgba(255,255,255,0.06)",
    "glass-blur": "blur(20px)",
    "glass-shadow": "0 8px 32px rgba(0,0,0,0.60)",

    /* ── Elevation — strongest shadows for true black ── */
    "elevation-xs": "0 1px 2px rgba(0,0,0,0.30)",
    "elevation-sm": "0 1px 3px rgba(0,0,0,0.40), 0 1px 2px rgba(0,0,0,0.32)",
    "elevation-md": "0 4px 6px rgba(0,0,0,0.38), 0 2px 4px rgba(0,0,0,0.32)",
    "elevation-lg": "0 10px 15px rgba(0,0,0,0.45), 0 4px 6px rgba(0,0,0,0.28)",
    "elevation-xl": "0 20px 25px rgba(0,0,0,0.45), 0 10px 10px rgba(0,0,0,0.22)",
    "elevation-2xl": "0 25px 50px rgba(0,0,0,0.60)",

    /* ── Gradients — same as dark ── */
    "gradient-primary": "linear-gradient(135deg, #4D8AFF, #A78BFA)",
    "gradient-success": "linear-gradient(135deg, #22C55E, #4ADE80)",
    "gradient-warm": "linear-gradient(135deg, #FBBF24, #F87171)",
    "gradient-cool": "linear-gradient(135deg, #22D3EE, #60A5FA)",
    "gradient-surface": "linear-gradient(180deg, transparent, rgba(255,255,255,0.01))",
    "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",

    /* ── Aurora premium ── */
    "aurora-1": "#A78BFA",
    "aurora-2": "#C4B5FD",
    "aurora-3": "#DDD6FE",
    "aurora-gradient": "linear-gradient(135deg, #A78BFA, #22D3EE, #4ADE80)",
    "aurora-glow": "0 0 40px rgba(167,139,250,0.3)",

    /* ── Focus ring ── */
    "focus-ring": "0 0 0 2px #000000, 0 0 0 4px #4D8AFF",
    "focus-ring-offset": "0 0 0 2px #000000",

    /* ── Input ── */
    "input-bg": "#0D0D0D",
    "input-border": "#333333",
    "input-border-focus": "#4D8AFF",
    "input-placeholder": "#444450",
  },
};
