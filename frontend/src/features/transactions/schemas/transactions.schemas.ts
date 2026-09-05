import { z } from "zod";

export const depositSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  amountCents: z.number("Amount is required").min(1, "Amount must be at least 1 cent"),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
});

export type DepositFormData = z.infer<typeof depositSchema>;

export const withdrawalSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  amountCents: z.number("Amount is required").min(1, "Amount must be at least 1 cent"),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

export const transferSchema = z.object({
  sourceAccountId: z.string().min(1, "Source account is required"),
  targetAccountId: z.string().min(1, "Target account is required"),
  amountCents: z.number("Amount is required").min(1, "Amount must be at least 1 cent"),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
}).refine((data) => data.sourceAccountId !== data.targetAccountId, {
  message: "Source and target accounts must be different",
  path: ["targetAccountId"],
});

export type TransferFormData = z.infer<typeof transferSchema>;

export const mobilePaymentSchema = z.object({
  sourceAccountId: z.string().min(1, "Source account is required"),
  recipientMobile: z.string().min(3, "Recipient mobile number is required"),
  amountCents: z.number("Amount is required").min(1, "Amount must be at least 1 cent"),
  description: z.string().max(255, "Description too long").optional().or(z.literal("")),
});

export type MobilePaymentFormData = z.infer<typeof mobilePaymentSchema>;
