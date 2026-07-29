import { useUpdateSetting } from "../hooks";
import type { SettingKey } from "../types";

interface SettingToggleProps {
  settingKey: SettingKey;
  label: string;
  description?: string;
  value: string;
}

export function SettingToggle({
  settingKey,
  label,
  description,
  value,
}: SettingToggleProps) {
  const { mutate, isPending } = useUpdateSetting();
  const isEnabled = value === "true";

  function handleToggle() {
    mutate({
      key: settingKey,
      payload: { settingValue: isEnabled ? "false" : "true" },
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
      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        disabled={isPending}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          isEnabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
            isEnabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
