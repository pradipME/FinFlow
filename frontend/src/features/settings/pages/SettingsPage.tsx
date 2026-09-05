import { Bell, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { ErrorState, Skeleton } from "@/shared/components";
import { useSettings } from "../hooks";
import {
  SettingToggle,
  SettingSelect,
  SettingsSection,
  AppearanceSection,
} from "../components";
import type { SettingKey } from "../types";

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const CURRENCY_OPTIONS = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
];

const DEFAULTS: Record<SettingKey, string> = {
  notification_email: "true",
  notification_sms: "false",
  two_factor_enabled: "false",
  language: "en",
  currency_display: "USD",
};

export function SettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" subtitle="Manage your account preferences" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" subtitle="Manage your account preferences" />
        <ErrorState
          description="Failed to load settings"
          onRetry={refetch}
        />
      </div>
    );
  }

  const settingsMap = new Map(
    (settings ?? []).map((s) => [s.settingKey, s.settingValue]),
  );

  function getValue(key: SettingKey): string {
    return settingsMap.get(key) ?? DEFAULTS[key];
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      <SettingsSection
        title="Notifications"
        description="Choose how you want to be notified"
        icon={<Bell size={16} />}
      >
        <SettingToggle
          settingKey="notification_email"
          label="Email notifications"
          description="Receive transaction alerts and updates via email"
          value={getValue("notification_email")}
        />
        <SettingToggle
          settingKey="notification_sms"
          label="SMS notifications"
          description="Receive important alerts via text message"
          value={getValue("notification_sms")}
        />
      </SettingsSection>

      <SettingsSection
        title="Security"
        description="Protect your account"
        icon={<ShieldCheck size={16} />}
      >
        <SettingToggle
          settingKey="two_factor_enabled"
          label="Two-factor authentication"
          description="Add an extra layer of security to your account"
          value={getValue("two_factor_enabled")}
        />
      </SettingsSection>

      <SettingsSection
        title="Preferences"
        description="Customize your experience"
        icon={<SlidersHorizontal size={16} />}
      >
        <SettingSelect
          settingKey="language"
          label="Language"
          description="Select your preferred language"
          value={getValue("language")}
          options={LANGUAGE_OPTIONS}
        />
        <SettingSelect
          settingKey="currency_display"
          label="Display currency"
          description="Currency used throughout the app"
          value={getValue("currency_display")}
          options={CURRENCY_OPTIONS}
        />
      </SettingsSection>

      <AppearanceSection />
    </div>
  );
}
