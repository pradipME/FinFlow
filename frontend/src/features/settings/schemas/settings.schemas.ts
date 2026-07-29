import { z } from "zod";

export const updateSettingSchema = z.object({
  settingValue: z.string().min(1, "Value is required"),
});

export type UpdateSettingFormData = z.infer<typeof updateSettingSchema>;
