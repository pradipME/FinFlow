/**
 * Theme Engine — Utilities
 *
 * Pure functions for theme detection, resolution, and DOM application.
 * Zero React dependency — safe to import in any context (workers, SSR, tests).
 */
import type { ThemeName, ThemeMode, ThemeConfig } from "./types";
import { THEME_CLASS_PREFIX, DARK_MODE_MEDIA } from "./constants";
import { TOKEN_REGISTRY } from "./tokens";

/**
 * Read OS dark-mode preference.
 * Returns "dark" if the user's system is in dark mode, "light" otherwise.
 */
export function detectSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(DARK_MODE_MEDIA).matches ? "dark" : "light";
}

/**
 * Resolve a ThemeMode to a concrete ThemeName.
 * "system" → reads OS preference and maps to "light" | "dark".
 * Any other value is passed through directly.
 */
export function resolveMode(mode: ThemeMode): ThemeName {
  if (mode === "system") return detectSystemTheme();
  return mode;
}

/**
 * Look up the full ThemeConfig for a resolved ThemeName.
 * Returns the light config as a safe fallback if the name is unknown.
 */
export function getThemeConfig(name: ThemeName): ThemeConfig {
  return TOKEN_REGISTRY[name] ?? TOKEN_REGISTRY.light;
}

/**
 * Apply a theme to the DOM.
 *
 * 1. Sets `data-theme` attribute on <html> to the theme name
 * 2. Removes all `theme-*` classes, adds the new one
 * 3. Writes every token as a CSS custom property (--ff-*) on :root
 * 4. Sets a `color-scheme` meta property for native form controls
 *
 * This is synchronous and idempotent — safe to call on every theme change.
 */
export function applyTheme(config: ThemeConfig): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // 1. Data attribute for CSS selectors
  root.setAttribute("data-theme", config.name);

  // 2. CSS classes for Tailwind / component styling
  for (const name of ["light", "dark", "amoled"] as const) {
    root.classList.remove(`${THEME_CLASS_PREFIX}${name}`);
  }
  root.classList.add(`${THEME_CLASS_PREFIX}${config.name}`);

  // 3. Write all tokens as CSS custom properties
  const tokens = config.tokens;
  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(`--ff-${key}`, value);
  }

  // 4. Color scheme — tells browsers how to render native controls (scrollbars, form inputs)
  root.style.colorScheme = config.isDark ? "dark" : "light";
}

/**
 * Remove all theme tokens from the DOM.
 * Useful for SSR hydration or testing cleanup.
 */
export function clearTheme(): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.removeAttribute("data-theme");

  for (const name of ["light", "dark", "amoled"] as const) {
    root.classList.remove(`${THEME_CLASS_PREFIX}${name}`);
  }

  // Remove all --ff-* custom properties
  const tokens = TOKEN_REGISTRY.light.tokens;
  for (const key of Object.keys(tokens)) {
    root.style.removeProperty(`--ff-${key}`);
  }

  root.style.removeProperty("color-scheme");
}
