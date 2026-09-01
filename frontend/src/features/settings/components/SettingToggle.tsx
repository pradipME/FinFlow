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
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        disabled={isPending}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary disabled:cursor-not-allowed disabled:opacity-50 ${
          isEnabled ? "bg-brand-primary" : "bg-bg-tertiary"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
            isEnabled ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}