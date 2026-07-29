/**
 * ThemeSwitcher — Cycles through Light → Dark → AMOLED → System.
 *
 * Icon-only button, no dropdown. Clicking cycles to the next theme.
 * Uses the ThemeEngine's ThemeMode API.
 */
import type { ReactNode } from "react";
import { Sun, Moon, Zap, Monitor } from "lucide-react";
import { useTheme } from "@/shared/theme";
import type { ThemeMode } from "@/shared/theme";
import { cn } from "@/shared/utils";

const themeIcons: Record<ThemeMode, ReactNode> = {
  light: <Sun size={20} />,
  dark: <Moon size={20} />,
  amoled: <Zap size={20} />,
  system: <Monitor size={20} />,
};

const themeOrder: ThemeMode[] = ["light", "dark", "amoled", "system"];

export function ThemeSwitcher(): ReactNode {
  const { mode, setMode } = useTheme();

  const cycleTheme = (): void => {
    const idx = themeOrder.indexOf(mode);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    setMode(next);
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        "flex items-center justify-center rounded-lg p-2",
        "text-text-tertiary",
        "hover:bg-bg-tertiary hover:text-text-primary",
        "transition-colors duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
      )}
      title={`Theme: ${mode} (click to cycle)`}
    >
      {themeIcons[mode]}
    </button>
  );
}
