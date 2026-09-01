import { Select } from "@/shared/components";
import { useUpdateSetting } from "../hooks";
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
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>}
      </div>
      <Select
        className="w-full sm:w-52"
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
    </div>
  );
}