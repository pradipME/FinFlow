export type AccountType = "CHECKING" | "SAVINGS" | "CREDIT_CARD";
export type AccountStatus = "PENDING" | "ACTIVE" | "FROZEN" | "CLOSED" | "DORMANT";
export type HoldStatus = "ACTIVE" | "RELEASED" | "EXPIRED";

export interface AccountSummary {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  nickname: string | null;
  currency: string;
  availableBalanceCents: number;
  createdAt: string;
}

export interface Hold {
  id: string;
  amountCents: number;
  reason: string;
  sourceType: string | null;
  sourceId: string | null;
  holdStatus: HoldStatus;
  releasedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface AccountDetail {
  id: string;
  ownerId: string;
  accountNumber: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  nickname: string | null;
  currency: string;
  ledgerBalanceCents: number;
  availableBalanceCents: number;
  activeHoldCount: number;
  activeHolds: Hold[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  id: number;
  previousStatus: string | null;
  newStatus: string;
  reason: string | null;
  changedBy: string;
  changedAt: string;
}

export interface UpdateAccountPayload {
  nickname?: string;
  accountType?: AccountType;
}

export interface ChangeStatusPayload {
  newStatus: AccountStatus;
  reason?: string;
}

export interface PlaceHoldPayload {
  amountCents: number;
  reason: string;
  sourceType?: string;
  sourceId?: string;
  expiresAt?: string;
}
