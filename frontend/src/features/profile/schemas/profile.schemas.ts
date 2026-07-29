import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().max(100, "First name too long").optional().or(z.literal("")),
  lastName: z.string().max(100, "Last name too long").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  addressLine1: z.string().max(255, "Address too long").optional().or(z.literal("")),
  addressLine2: z.string().max(255, "Address too long").optional().or(z.literal("")),
  city: z.string().max(100, "City too long").optional().or(z.literal("")),
  state: z.string().max(100, "State too long").optional().or(z.literal("")),
  postalCode: z.string().max(20, "Postal code too long").optional().or(z.literal("")),
  country: z.string().length(2, "Country must be 2 characters").optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
