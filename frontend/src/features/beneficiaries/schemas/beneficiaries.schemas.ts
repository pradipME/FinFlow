import { z } from "zod";

export const createBeneficiarySchema = z.object({
  beneficiaryName: z.string().min(1, "Name is required").max(200, "Name too long"),
  nickname: z.string().max(100, "Nickname too long").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  bankName: z.string().max(200, "Bank name too long").optional().or(z.literal("")),
  accountNumber: z.string().min(1, "Account number is required").max(50, "Account number too long"),
  routingNumber: z.string().max(20, "Routing number too long").optional().or(z.literal("")),
  iban: z.string().max(50, "IBAN too long").optional().or(z.literal("")),
  swiftCode: z.string().max(20, "SWIFT code too long").optional().or(z.literal("")),
  currency: z.string().length(3, "Must be 3 characters").optional().or(z.literal("")),
});

export type CreateBeneficiaryFormData = z.infer<typeof createBeneficiarySchema>;

export const updateBeneficiarySchema = z.object({
  beneficiaryName: z.string().min(1, "Name is required").max(200, "Name too long").optional(),
  nickname: z.string().max(100, "Nickname too long").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  bankName: z.string().max(200, "Bank name too long").optional().or(z.literal("")),
  accountNumber: z.string().min(1, "Account number is required").max(50, "Account number too long").optional(),
  routingNumber: z.string().max(20, "Routing number too long").optional().or(z.literal("")),
  iban: z.string().max(50, "IBAN too long").optional().or(z.literal("")),
  swiftCode: z.string().max(20, "SWIFT code too long").optional().or(z.literal("")),
  currency: z.string().length(3, "Must be 3 characters").optional().or(z.literal("")),
});

export type UpdateBeneficiaryFormData = z.infer<typeof updateBeneficiarySchema>;
