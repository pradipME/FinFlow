import { z } from "zod";

export const templateSchema = z.object({
  templateName: z.string().min(1, "Template name is required").max(100, "Name too long"),
  sourceAccountId: z.string().min(1, "Source account is required"),
  targetAccountId: z.string().optional().or(z.literal("")),
  targetBeneficiaryId: z.string().optional().or(z.literal("")),
  amountCents: z.number("Amount is required").min(1, "Amount must be at least 1 cent"),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
});

export type TemplateFormData = z.infer<typeof templateSchema>;

export const scheduledTransferSchema = z.object({
  sourceAccountId: z.string().min(1, "Source account is required"),
  targetAccountId: z.string().optional().or(z.literal("")),
  targetBeneficiaryId: z.string().optional().or(z.literal("")),
  amountCents: z.number("Amount is required").min(1, "Amount must be at least 1 cent"),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
  scheduleType: z.enum(["ONE_TIME", "RECURRING"], { required_error: "Schedule type is required" }),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).optional(),
  nextExecution: z.string().min(1, "Next execution date is required"),
  endDate: z.string().optional().or(z.literal("")),
  maxExecutions: z.number().int().positive().optional(),
}).refine(
  (data) => {
    if (data.scheduleType === "RECURRING") return !!data.frequency;
    return true;
  },
  { message: "Frequency is required for recurring transfers", path: ["frequency"] },
).refine(
  (data) => data.sourceAccountId !== data.targetAccountId,
  { message: "Source and target accounts must be different", path: ["targetAccountId"] },
);

export type ScheduledTransferFormData = z.infer<typeof scheduledTransferSchema>;
