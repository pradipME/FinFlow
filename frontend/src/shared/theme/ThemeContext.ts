/**
 * Theme Engine — Context
 *
 * Typed React context for theme state.
 * Defaults to null — useTheme() throws if consumed outside the provider.
 */
import { createContext } from "react";
import type { ThemeContextValue } from "./types";

export const ThemeContext = createContext<ThemeContextValue | null>(null);
