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

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    mutate({
      key: settingKey,
      payload: { settingValue: e.target.value },
    });
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
      <select
        value={value}
        disabled={isPending}
        onChange={handleChange}
        className="ml-4 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
