import { z } from "zod";

export const createAccountSchema = z.object({
  accountType: z.enum(["CHECKING", "SAVINGS", "CREDIT_CARD"]),
  nickname: z
    .string()
    .max(50, "Nickname must be at most 50 characters")
    .optional()
    .or(z.literal("")),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .optional()
    .or(z.literal("")),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = z.object({
  nickname: z
    .string()
    .max(50, "Nickname must be at most 50 characters")
    .optional()
    .or(z.literal("")),
  accountType: z.enum(["CHECKING", "SAVINGS", "CREDIT_CARD"]).optional(),
});

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

export const changeStatusSchema = z.object({
  newStatus: z.enum(["ACTIVE", "FROZEN", "CLOSED"]),
  reason: z
    .string()
    .max(255, "Reason must be at most 255 characters")
    .optional()
    .or(z.literal("")),
});

export type ChangeStatusFormData = z.infer<typeof changeStatusSchema>;

export const placeHoldSchema = z.object({
  amountCents: z
    .number("Amount is required")
    .min(1, "Amount must be at least 1 cent"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(255, "Reason must be at most 255 characters"),
  expiresAt: z.string().optional().or(z.literal("")),
});

export type PlaceHoldFormData = z.infer<typeof placeHoldSchema>;
