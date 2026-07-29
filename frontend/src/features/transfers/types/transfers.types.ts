export type ScheduleStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED" | "FAILED";
export type ScheduleType = "ONE_TIME" | "RECURRING";
export type TransferFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface TransferTemplate {
  id: string;
  templateName: string;
  sourceAccountId: string;
  targetAccountId: string | null;
  targetBeneficiaryId: string | null;
  amountCents: number;
  currency: string;
  description: string | null;
  templateStatus: ScheduleStatus;
  createdAt: string;
}

export interface ScheduledTransfer {
  id: string;
  templateId: string | null;
  sourceAccountId: string;
  targetAccountId: string | null;
  targetBeneficiaryId: string | null;
  amountCents: number;
  currency: string;
  description: string | null;
  scheduleType: ScheduleType;
  frequency: TransferFrequency | null;
  nextExecution: string;
  lastExecution: string | null;
  endDate: string | null;
  executionCount: number;
  maxExecutions: number | null;
  scheduleStatus: ScheduleStatus;
  createdAt: string;
}

export interface CreateTemplatePayload {
  templateName: string;
  sourceAccountId: string;
  targetAccountId?: string;
  targetBeneficiaryId?: string;
  amountCents: number;
  currency?: string;
  description?: string;
}

export interface UpdateTemplatePayload {
  templateName?: string;
  sourceAccountId?: string;
  targetAccountId?: string;
  targetBeneficiaryId?: string;
  amountCents?: number;
  currency?: string;
  description?: string;
}

export interface CreateScheduledTransferPayload {
  templateId?: string;
  sourceAccountId: string;
  targetAccountId?: string;
  targetBeneficiaryId?: string;
  amountCents: number;
  currency?: string;
  description?: string;
  scheduleType: ScheduleType;
  frequency?: TransferFrequency;
  nextExecution: string;
  endDate?: string;
  maxExecutions?: number;
}
