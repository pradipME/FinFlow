/**
 * Theme Engine — Type Definitions
 *
 * Defines the full type vocabulary for the FinFlow theme system.
 * Every theme file, hook, and consumer imports types from here.
 */

/** Available theme palettes */
export type ThemeName = "light" | "dark" | "amoled";

/** User selection — "system" defers to OS preference */
export type ThemeMode = ThemeName | "system";

/** Accent color slot — extensible for future custom accents */
export interface AccentColor {
  /** Unique identifier */
  name: string;
  /** Primary hue — used for buttons, links, active states */
  primary: string;
  /** Primary hover state */
  primaryHover: string;
  /** Primary active/pressed state */
  primaryActive: string;
  /** Tinted background for primary (e.g., 8% opacity fill) */
  primarySubtle: string;
  /** CSS color value for focus ring glow */
  glow: string;
}

/**
 * Complete token map for a single theme.
 * Every key maps to a CSS custom property name (without the -- prefix).
 * Values are raw CSS values (hex, rgba, blur, url, etc.).
 */
export interface ThemeTokens {
  /* ── Background ── */
  "bg-primary": string;
  "bg-secondary": string;
  "bg-tertiary": string;
  "bg-inverse": string;

  /* ── Surface ── */
  "surface-primary": string;
  "surface-secondary": string;
  "surface-tertiary": string;
  "surface-hover": string;
  "surface-active": string;

  /* ── Border ── */
  "border-default": string;
  "border-subtle": string;
  "border-strong": string;

  /* ── Text ── */
  "text-primary": string;
  "text-secondary": string;
  "text-tertiary": string;
  "text-inverse": string;
  "text-disabled": string;

  /* ── Brand / Primary ── */
  "color-primary": string;
  "color-primary-hover": string;
  "color-primary-active": string;
  "color-primary-subtle": string;

  /* ── Semantic ── */
  "color-success": string;
  "color-success-subtle": string;
  "color-warning": string;
  "color-warning-subtle": string;
  "color-danger": string;
  "color-danger-subtle": string;
  "color-info": string;
  "color-info-subtle": string;

  /* ── Financial status ── */
  "color-credit": string;
  "color-debit": string;
  "color-pending": string;
  "color-held": string;
  "color-failed": string;
  "color-reversed": string;
  "color-scheduled": string;
  "color-settled": string;

  /* ── Chart palette (12-color) ── */
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  "chart-6": string;
  "chart-7": string;
  "chart-8": string;
  "chart-9": string;
  "chart-10": string;
  "chart-11": string;
  "chart-12": string;

  /* ── Glass morphism ── */
  "glass-bg": string;
  "glass-border": string;
  "glass-blur": string;
  "glass-shadow": string;

  /* ── Elevation / shadow ── */
  "elevation-xs": string;
  "elevation-sm": string;
  "elevation-md": string;
  "elevation-lg": string;
  "elevation-xl": string;
  "elevation-2xl": string;

  /* ── Gradients ── */
  "gradient-primary": string;
  "gradient-success": string;
  "gradient-warm": string;
  "gradient-cool": string;
  "gradient-surface": string;
  "gradient-glass": string;

  /* ── Aurora (premium) ── */
  "aurora-1": string;
  "aurora-2": string;
  "aurora-3": string;
  "aurora-gradient": string;
  "aurora-glow": string;

  /* ── Focus ring ── */
  "focus-ring": string;
  "focus-ring-offset": string;

  /* ── Input ── */
  "input-bg": string;
  "input-border": string;
  "input-border-focus": string;
  "input-placeholder": string;
}

/** Full configuration for a theme — metadata + token values + accent */
export interface ThemeConfig {
  /** Unique name matching ThemeName */
  name: ThemeName;
  /** Display label ("Light", "Dark", "AMOLED") */
  label: string;
  /** Whether this is a dark-family theme (dark or amoled) */
  isDark: boolean;
  /** The complete token map */
  tokens: ThemeTokens;
}

/** Shape of the React context value exposed by ThemeProvider */
export interface ThemeContextValue {
  /** User's selected mode (light | dark | amoled | system) */
  mode: ThemeMode;
  /** Resolved palette after system detection (light | dark | amoled) */
  resolved: ThemeName;
  /** Set the user's mode preference */
  setMode: (mode: ThemeMode) => void;
  /** Whether the current resolved theme is dark-family */
  isDark: boolean;
}
