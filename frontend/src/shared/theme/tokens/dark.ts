/**
 * Theme Tokens — Dark
 *
 * "FinFlow Ink" — a deep, intelligent fintech terminal palette.
 *
 * Design intent:
 *  - Cool near-black ink backgrounds with a soft blue tint (not pure gray)
 *  - Layered surfaces for hierarchy; hairline borders with a cool cast
 *  - Signature emerald accent (growth/money) with restrained violets/blues
 *  - Financial semantics: credit/settled = emerald, debit/failed = rose,
 *    pending = amber, held = violet, scheduled = cyan
 */
import type { ThemeConfig } from "../types";

export const darkTokens: ThemeConfig = {
  name: "dark",
  label: "Dark",
  isDark: true,
  tokens: {
    /* ── Background ── */
    "bg-primary": "#0A0E14",
    "bg-secondary": "#0D1219",
    "bg-tertiary": "#131A24",
    "bg-inverse": "#FFFFFF",

    /* ── Surface ── */
    "surface-primary": "#111722",
    "surface-secondary": "#161D2A",
    "surface-tertiary": "#1B2433",
    "surface-hover": "#182131",
    "surface-active": "#232E41",

    /* ── Border (hairlines with cool cast) ── */
    "border-default": "#232C3D",
    "border-subtle": "#161E2B",
    "border-strong": "#334052",

    /* ── Text ── */
    "text-primary": "#EDF1F7",
    "text-secondary": "#9AA7B8",
    "text-tertiary": "#68778C",
    "text-inverse": "#0B0F16",
    "text-disabled": "#47536A",

    /* ── Brand / Primary — signature emerald ── */
    "color-primary": "#2FD6A3",
    "color-primary-hover": "#57E2B8",
    "color-primary-active": "#1FB88B",
    "color-primary-subtle": "rgba(47,214,163,0.12)",

    /* ── Semantic ── */
    "color-success": "#34D399",
    "color-success-subtle": "rgba(52,211,153,0.12)",
    "color-warning": "#FBBF24",
    "color-warning-subtle": "rgba(251,191,36,0.12)",
    "color-danger": "#FB7185",
    "color-danger-subtle": "rgba(251,113,133,0.12)",
    "color-info": "#38BDF8",
    "color-info-subtle": "rgba(56,189,248,0.12)",

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
    "glass-bg": "rgba(17,23,34,0.72)",
    "glass-border": "rgba(255,255,255,0.08)",
    "glass-blur": "blur(18px)",
    "glass-shadow": "0 12px 40px rgba(0,0,0,0.45)",

    /* ── Elevation ── */
    "elevation-xs": "0 1px 2px rgba(0,0,0,0.25)",
    "elevation-sm": "0 1px 3px rgba(0,0,0,0.36), 0 1px 2px rgba(0,0,0,0.28)",
    "elevation-md": "0 4px 8px rgba(0,0,0,0.34), 0 2px 4px rgba(0,0,0,0.28)",
    "elevation-lg": "0 12px 24px rgba(0,0,0,0.38), 0 4px 8px rgba(0,0,0,0.24)",
    "elevation-xl": "0 24px 48px rgba(0,0,0,0.42), 0 8px 16px rgba(0,0,0,0.24)",
    "elevation-2xl": "0 32px 64px rgba(0,0,0,0.55)",

    /* ── Gradients ── */
    "gradient-primary": "linear-gradient(135deg, #1FB88B 0%, #2FD6A3 50%, #38BDF8 100%)",
    "gradient-success": "linear-gradient(135deg, #059669, #34D399)",
    "gradient-warm": "linear-gradient(135deg, #F59E0B, #FB7185)",
    "gradient-cool": "linear-gradient(135deg, #0EA5E9, #818CF8)",
    "gradient-surface": "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
    "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0))",

    /* ── Aurora premium ── */
    "aurora-1": "#10B981",
    "aurora-2": "#38BDF8",
    "aurora-3": "#818CF8",
    "aurora-gradient": "linear-gradient(135deg, #10B981, #38BDF8, #818CF8)",
    "aurora-glow": "0 0 48px rgba(16,185,129,0.25)",

    /* ── Focus ring ── */
    "focus-ring": "0 0 0 2px #0A0E14, 0 0 0 4px #2FD6A3",
    "focus-ring-offset": "0 0 0 2px #0A0E14",

    /* ── Input ── */
    "input-bg": "#0F1520",
    "input-border": "#2A3547",
    "input-border-focus": "#2FD6A3",
    "input-placeholder": "#54617A",
  },
};