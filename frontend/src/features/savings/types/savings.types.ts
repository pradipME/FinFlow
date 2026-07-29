export type SavingsGoalStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

export interface SavingsGoal {
  id: string;
  accountId: string;
  goalName: string;
  targetAmountCents: number;
  currentAmountCents: number;
  currency: string;
  goalStatus: SavingsGoalStatus;
  deadline: string | null;
  description: string | null;
  progressPercent: number;
  createdAt: string;
}

export interface CreateSavingsGoalPayload {
  accountId: string;
  goalName: string;
  targetAmountCents: number;
  currency?: string;
  deadline?: string;
  description?: string;
}

export interface UpdateSavingsGoalPayload {
  goalName?: string;
  targetAmountCents?: number;
  deadline?: string;
  description?: string;
}

export interface DepositPayload {
  amountCents: number;
}
