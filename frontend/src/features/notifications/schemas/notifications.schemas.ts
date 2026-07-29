import { z } from "zod";

export const markReadSchema = z.object({
  isRead: z.boolean(),
});

export type MarkReadFormData = z.infer<typeof markReadSchema>;
