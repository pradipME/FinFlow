import { z } from "zod";

export const auditLogFilterSchema = z.object({
  action: z.string().optional().or(z.literal("")),
  targetType: z.string().optional().or(z.literal("")),
});

export type AuditLogFilterFormData = z.infer<typeof auditLogFilterSchema>;
