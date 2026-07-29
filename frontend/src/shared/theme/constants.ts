/**
 * Theme Engine — Constants
 *
 * Single source of truth for storage keys, CSS class names,
 * media queries, and the ordered list of available themes.
 */
import type { ThemeName, ThemeMode } from "./types";

/** localStorage key for persisting the user's theme mode */
export const THEME_STORAGE_KEY = "finflow-theme-mode" as const;

/** CSS class applied to <html> — matches the resolved ThemeName */
export const THEME_CLASS_PREFIX = "theme-" as const;

/** All resolved theme names (each gets a corresponding CSS class) */
export const THEME_NAMES: readonly ThemeName[] = ["light", "dark", "amoled"] as const;

/** Allowed user-facing modes (includes "system" which defers to OS) */
export const THEME_MODES: readonly ThemeMode[] = ["light", "dark", "amoled", "system"] as const;

/** OS media query for dark mode preference */
export const DARK_MODE_MEDIA = "(prefers-color-scheme: dark)" as const;

/** OS media query for reduced motion preference */
export const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)" as const;

/** OS media query for high contrast preference */
export const HIGH_CONTRAST_MEDIA = "(prefers-contrast: high)" as const;
