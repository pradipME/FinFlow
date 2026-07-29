/**
 * Theme Tokens — Light
 *
 * Warm white background, subtle gray surfaces.
 * Source: DESIGN_SYSTEM.md §6.1
 */
import type { ThemeConfig } from "../types";

export const lightTokens: ThemeConfig = {
  name: "light",
  label: "Light",
  isDark: false,
  tokens: {
    /* ── Background (§6.1) ── */
    "bg-primary": "#FFFFFF",
    "bg-secondary": "#F9FAFB",
    "bg-tertiary": "#F3F4F6",
    "bg-inverse": "#111827",

    /* ── Surface (§6.1) ── */
    "surface-primary": "#FFFFFF",
    "surface-secondary": "#F9FAFB",
    "surface-tertiary": "#F3F4F6",
    "surface-hover": "#F3F4F6",
    "surface-active": "#E5E7EB",

    /* ── Border (§6.1) ── */
    "border-default": "#E5E7EB",
    "border-subtle": "#F3F4F6",
    "border-strong": "#D1D5DB",

    /* ── Text (§6.1) ── */
    "text-primary": "#111827",
    "text-secondary": "#4B5563",
    "text-tertiary": "#6B7280",
    "text-inverse": "#FFFFFF",
    "text-disabled": "#9CA3AF",

    /* ── Brand / Primary (§6.1) ── */
    "color-primary": "#2563EB",
    "color-primary-hover": "#1D4ED8",
    "color-primary-active": "#1E40AF",
    "color-primary-subtle": "#EFF6FF",

    /* ── Semantic (§6.4) ── */
    "color-success": "#16A34A",
    "color-success-subtle": "#F0FDF4",
    "color-warning": "#D97706",
    "color-warning-subtle": "#FFFBEB",
    "color-danger": "#DC2626",
    "color-danger-subtle": "#FEF2F2",
    "color-info": "#0891B2",
    "color-info-subtle": "#ECFEFF",

    /* ── Financial status (§5.15) ── */
    "color-credit": "#16A34A",
    "color-debit": "#DC2626",
    "color-pending": "#D97706",
    "color-held": "#9333EA",
    "color-failed": "#DC2626",
    "color-reversed": "#6B7280",
    "color-scheduled": "#0891B2",
    "color-settled": "#16A34A",

    /* ── Chart palette (§5.14) ── */
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
    "glass-bg": "rgba(255,255,255,0.72)",
    "glass-border": "rgba(255,255,255,0.20)",
    "glass-blur": "blur(16px)",
    "glass-shadow": "0 8px 32px rgba(0,0,0,0.08)",

    /* ── Elevation (§5.5) ── */
    "elevation-xs": "0 1px 2px rgba(0,0,0,0.05)",
    "elevation-sm": "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    "elevation-md": "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)",
    "elevation-lg": "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
    "elevation-xl": "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
    "elevation-2xl": "0 25px 50px rgba(0,0,0,0.25)",

    /* ── Gradients (§6.6) ── */
    "gradient-primary": "linear-gradient(135deg, #2563EB, #7C3AED)",
    "gradient-success": "linear-gradient(135deg, #059669, #22C55E)",
    "gradient-warm": "linear-gradient(135deg, #F59E0B, #EF4444)",
    "gradient-cool": "linear-gradient(135deg, #06B6D4, #3B82F6)",
    "gradient-surface": "linear-gradient(180deg, transparent, rgba(0,0,0,0.02))",
    "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",

    /* ── Aurora premium (§6.7) ── */
    "aurora-1": "#7C3AED",
    "aurora-2": "#A78BFA",
    "aurora-3": "#C4B5FD",
    "aurora-gradient": "linear-gradient(135deg, #7C3AED, #06B6D4, #22C55E)",
    "aurora-glow": "0 0 40px rgba(124,58,237,0.3)",

    /* ── Focus ring ── */
    "focus-ring": "0 0 0 2px #FFFFFF, 0 0 0 4px #2563EB",
    "focus-ring-offset": "0 0 0 2px #FFFFFF",

    /* ── Input (§6.1 borders + surface) ── */
    "input-bg": "#FFFFFF",
    "input-border": "#D1D5DB",
    "input-border-focus": "#2563EB",
    "input-placeholder": "#9CA3AF",
  },
};
