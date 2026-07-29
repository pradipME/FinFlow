import { z } from "zod";

export const createSavingsGoalSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  goalName: z.string().min(1, "Goal name is required").max(100, "Name too long"),
  targetAmountCents: z.number("Target amount is required").min(1, "Amount must be positive"),
  deadline: z.string().optional().or(z.literal("")),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
});

export type CreateSavingsGoalFormData = z.infer<typeof createSavingsGoalSchema>;

export const depositToGoalSchema = z.object({
  amountCents: z.number("Amount is required").min(1, "Amount must be positive"),
});

export type DepositToGoalFormData = z.infer<typeof depositToGoalSchema>;
