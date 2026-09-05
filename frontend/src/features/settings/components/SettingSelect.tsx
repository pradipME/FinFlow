import { Select } from "@/shared/components";
import { useUpdateSetting } from "../hooks";
import { SettingRow } from "./SettingRow";
import type { SettingKey } from "../types";

interface SettingSelectProps {
  settingKey: SettingKey;
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
}

export function SettingSelect({
  settingKey,
  label,
  description,
  value,
  options,
}: SettingSelectProps) {
  const { mutate, isPending } = useUpdateSetting();

  return (
    <SettingRow
      label={label}
      description={description}
      control={
        <Select
          className="w-full"
          value={value}
          disabled={isPending}
          options={options}
          onChange={(e) =>
            mutate({
              key: settingKey,
              payload: { settingValue: e.target.value },
            })
          }
        />
      }
    />
  );
}