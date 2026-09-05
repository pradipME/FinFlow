export type SettingKey =
  | "notification_email"
  | "notification_sms"
  | "two_factor_enabled"
  | "language"
  | "currency_display";

export type BooleanSettingValue = "true" | "false";
export type LanguageValue = "en" | "es" | "fr" | "de";
export type CurrencyDisplayValue = "USD" | "EUR" | "GBP";

export interface UserSetting {
  id: string;
  settingKey: SettingKey;
  settingValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingPayload {
  settingValue: string;
}

export interface BulkUpdateSettingsPayload {
  settings: Record<string, string>;
}
