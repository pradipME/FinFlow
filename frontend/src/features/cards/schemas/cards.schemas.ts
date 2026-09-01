import { z } from "zod";

export const createCardSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  cardType: z.enum(["DEBIT", "CREDIT", "PREPAID"]),
  cardholderName: z.string().min(1, "Cardholder name is required").max(200, "Name too long"),
  creditLimitCents: z.number().positive().optional(),
  dailyLimitCents: z.number().positive().optional(),
  monthlyLimitCents: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
});

export type CreateCardFormData = z.infer<typeof createCardSchema>;
