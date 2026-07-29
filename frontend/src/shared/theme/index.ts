/**
 * Theme Engine — Public API
 *
 * Single import path for all theme functionality.
 */

// Provider (mount once in main.tsx)
export { ThemeProvider } from "./ThemeProvider";

// Hook (use in any component)
export { useTheme } from "./useTheme";

// Types
export type { ThemeName, ThemeMode, AccentColor, ThemeConfig, ThemeTokens, ThemeContextValue } from "./types";

// Token registry (for advanced use — e.g., previewing themes in a settings panel)
export { TOKEN_REGISTRY } from "./tokens";

// Utility functions (for non-React contexts — workers, SSR, tests)
export { detectSystemTheme, resolveMode, getThemeConfig, applyTheme, clearTheme } from "./utils";

// Constants
export {
  THEME_STORAGE_KEY,
  THEME_CLASS_PREFIX,
  THEME_NAMES,
  THEME_MODES,
  DARK_MODE_MEDIA,
  REDUCED_MOTION_MEDIA,
  HIGH_CONTRAST_MEDIA,
} from "./constants";
