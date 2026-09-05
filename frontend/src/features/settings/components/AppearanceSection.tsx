import { Palette } from "lucide-react";
import { useTheme } from "@/shared/theme";
import type { ThemeMode } from "@/shared/theme";
import { Select } from "@/shared/components";
import { SettingsSection } from "./SettingsSection";
import { SettingRow } from "./SettingRow";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "amoled", label: "AMOLED" },
];

export function AppearanceSection() {
  const { mode, setMode } = useTheme();

  return (
    <SettingsSection
      title="Appearance"
      description="Customize the look and feel of the app"
      icon={<Palette size={16} />}
    >
      <SettingRow
        label="Theme"
        description="Choose light, dark, or match your system preference"
        control={
          <Select
            className="w-full"
            value={mode}
            options={THEME_OPTIONS}
            onChange={(e) => setMode(e.target.value as ThemeMode)}
          />
        }
      />
    </SettingsSection>
  );
}