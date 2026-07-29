/**
 * Theme Engine — Hook
 *
 * Public API for consuming theme state in any component.
 * Throws a descriptive error if used outside <ThemeProvider>.
 *
 * Usage:
 *   const { mode, resolved, setMode, isDark } = useTheme();
 */
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      "[FinFlow] useTheme() must be used within a <ThemeProvider>. " +
        "Wrap your component tree with <ThemeProvider> in main.tsx.",
    );
  }
  return ctx;
}
