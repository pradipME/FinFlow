/**
 * Theme Tokens — Light
 *
 * "FinFlow Daylight" — a crisp, premium fintech light palette.
 *
 * Cool white base with subtle gray-blue surfaces, hairline borders,
 * and the same emerald signature accent as the dark theme.
 */
import type { ThemeConfig } from "../types";

export const lightTokens: ThemeConfig = {
  name: "light",
  label: "Light",
  isDark: false,
  tokens: {
    /* ── Background ── */
    "bg-primary": "#FFFFFF",
    "bg-secondary": "#F6F8FA",
    "bg-tertiary": "#EDF0F4",
    "bg-inverse": "#0B0F16",

    /* ── Surface ── */
    "surface-primary": "#FFFFFF",
    "surface-secondary": "#F8FAFB",
    "surface-tertiary": "#EEF1F5",
    "surface-hover": "#F1F4F8",
    "surface-active": "#E6EAF0",

    /* ── Border ── */
    "border-default": "#E2E7EE",
    "border-subtle": "#EEF2F6",
    "border-strong": "#C9D2DD",

    /* ── Text ── */
    "text-primary": "#0C1220",
    "text-secondary": "#465463",
    "text-tertiary": "#67788A",
    "text-inverse": "#FFFFFF",
    "text-disabled": "#9AA7B5",

    /* ── Brand / Primary — signature emerald ── */
    "color-primary": "#0C9B6B",
    "color-primary-hover": "#0A8159",
    "color-primary-active": "#086B4B",
    "color-primary-subtle": "#E7F6F0",

    /* ── Semantic ── */
    "color-success": "#128A5D",
    "color-success-subtle": "#E3F5EE",
    "color-warning": "#B76E0B",
    "color-warning-subtle": "#FCF4E3",
    "color-danger": "#D6385A",
    "color-danger-subtle": "#FDECEF",
    "color-info": "#0D88C4",
    "color-info-subtle": "#E3F4FC",

    /* ── Financial status ── */
    "color-credit": "#0C9B6B",
    "color-debit": "#D6385A",
    "color-pending": "#B76E0B",
    "color-held": "#7C5CD6",
    "color-failed": "#D6385A",
    "color-reversed": "#7A8796",
    "color-scheduled": "#0D88C4",
    "color-settled": "#0C9B6B",

    /* ── Chart palette ── */
    "chart-1": "#0C9B6B",
    "chart-2": "#6366F1",
    "chart-3": "#0EA5E9",
    "chart-4": "#F59E0B",
    "chart-5": "#F43F5E",
    "chart-6": "#8B5CF6",
    "chart-7": "#06B6D4",
    "chart-8": "#D97706",
    "chart-9": "#139A6E",
    "chart-10": "#FB7185",
    "chart-11": "#94A3B8",
    "chart-12": "#64748B",

    /* ── Glass morphism ── */
    "glass-bg": "rgba(255,255,255,0.78)",
    "glass-border": "rgba(255,255,255,0.55)",
    "glass-blur": "blur(18px)",
    "glass-shadow": "0 12px 40px rgba(9,25,40,0.12)",

    /* ── Elevation ── */
    "elevation-xs": "0 1px 2px rgba(9,25,40,0.05)",
    "elevation-sm": "0 1px 3px rgba(9,25,40,0.08), 0 1px 2px rgba(9,25,40,0.04)",
    "elevation-md": "0 4px 8px rgba(9,25,40,0.07), 0 2px 4px rgba(9,25,40,0.04)",
    "elevation-lg": "0 12px 24px rgba(9,25,40,0.10), 0 4px 8px rgba(9,25,40,0.05)",
    "elevation-xl": "0 24px 48px rgba(9,25,40,0.12), 0 8px 16px rgba(9,25,40,0.06)",
    "elevation-2xl": "0 32px 64px rgba(9,25,40,0.18)",

    /* ── Gradients ── */
    "gradient-primary": "linear-gradient(135deg, #0A8159 0%, #0C9B6B 50%, #0EA5E9 100%)",
    "gradient-success": "linear-gradient(135deg, #059669, #34D399)",
    "gradient-warm": "linear-gradient(135deg, #F59E0B, #F43F5E)",
    "gradient-cool": "linear-gradient(135deg, #0EA5E9, #6366F1)",
    "gradient-surface": "linear-gradient(180deg, rgba(9,25,40,0.03), rgba(9,25,40,0))",
    "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0))",

    /* ── Aurora premium ── */
    "aurora-1": "#34D399",
    "aurora-2": "#38BDF8",
    "aurora-3": "#818CF8",
    "aurora-gradient": "linear-gradient(135deg, #34D399, #38BDF8, #818CF8)",
    "aurora-glow": "0 0 48px rgba(16,185,129,0.2)",

    /* ── Focus ring ── */
    "focus-ring": "0 0 0 2px #FFFFFF, 0 0 0 4px #0C9B6B",
    "focus-ring-offset": "0 0 0 2px #FFFFFF",

    /* ── Input ── */
    "input-bg": "#FFFFFF",
    "input-border": "#CBD5E1",
    "input-border-focus": "#0C9B6B",
    "input-placeholder": "#94A3B8",
  },
};