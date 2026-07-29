/**
 * Token Registry
 *
 * Maps each ThemeName to its full ThemeConfig.
 * Used by utils.applyTheme() to look up the correct token set.
 */
import type { ThemeName, ThemeConfig } from "../types";
import { lightTokens } from "./light";
import { darkTokens } from "./dark";
import { amoledTokens } from "./amoled";

export const TOKEN_REGISTRY: Record<ThemeName, ThemeConfig> = {
  light: lightTokens,
  dark: darkTokens,
  amoled: amoledTokens,
};

export { lightTokens, darkTokens, amoledTokens };
