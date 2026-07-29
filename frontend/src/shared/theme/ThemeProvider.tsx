/**
 * Theme Engine — Provider
 *
 * Production-grade theme provider that:
 *  - Reads persisted mode from localStorage (default: "system")
 *  - Resolves "system" to OS preference via matchMedia
 *  - Applies all CSS custom properties to :root via applyTheme()
 *  - Listens for OS preference changes in real-time (useSyncExternalStore)
 *  - Persists user choice to localStorage
 *  - Exposes mode, resolved theme, setter, and isDark flag via context
 */
import { useCallback, useEffect, useMemo, useSyncExternalStore, useState } from "react";
import type { ThemeMode, ThemeName } from "./types";
import { ThemeContext } from "./ThemeContext";
import { THEME_STORAGE_KEY, DARK_MODE_MEDIA } from "./constants";
import { getThemeConfig, applyTheme } from "./utils";

// ── OS media query subscription (useSyncExternalStore) ────────────

function getSystemSnapshot(): "light" | "dark" {
  return window.matchMedia(DARK_MODE_MEDIA).matches ? "dark" : "light";
}

function subscribeToSystemTheme(callback: () => void): () => void {
  const mq = window.matchMedia(DARK_MODE_MEDIA);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

// ── Helpers ──────────────────────────────────────────────────────

/** Safe localStorage read — returns null on SSR, private browsing, or corrupt data */
function readPersistedMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && isThemeMode(raw)) return raw;
  } catch {
    // localStorage unavailable (SSR, private mode, quota exceeded)
  }
  return "system";
}

/** Type guard — ensures the string is a valid ThemeMode */
function isThemeMode(value: string): value is ThemeMode {
  return (["light", "dark", "amoled", "system"] as const).includes(value as ThemeMode);
}

// ── Component ───────────────────────────────────────────────────

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Optional override — skips localStorage read. Useful for e2e tests. */
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => defaultMode ?? readPersistedMode());

  // Subscribe to OS dark-mode preference via useSyncExternalStore.
  // This is synchronous, avoids cascading renders, and automatically
  // re-renders when the OS preference changes.
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemSnapshot, getSystemSnapshot);

  // ── Derived resolved theme ──────────────────────────────────────
  const resolved: ThemeName = useMemo(
    () => (mode === "system" ? systemTheme : mode),
    [mode, systemTheme],
  );

  // ── Apply theme to DOM ──────────────────────────────────────────
  useEffect(() => {
    applyTheme(getThemeConfig(resolved));
  }, [resolved]);

  // ── Persist to localStorage ─────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // localStorage write failed — silent degrade, next visit will use default
    }
  }, [mode]);

  // ── Setter ──────────────────────────────────────────────────────
  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  // ── Context value (memoized) ────────────────────────────────────
  const value = useMemo(
    () => ({
      mode,
      resolved,
      setMode,
      isDark: getThemeConfig(resolved).isDark,
    }),
    [mode, resolved, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
