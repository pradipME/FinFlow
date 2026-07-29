export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "FEE" | "REVERSAL";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type EntryType = "DEBIT" | "CREDIT";

export interface TransactionSummary {
  id: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  description: string | null;
  referenceNumber: string | null;
  amountCents: number;
  currency: string;
  sourceAccountId: string | null;
  targetAccountId: string | null;
  feeAmountCents: number;
  createdAt: string;
}

export interface TransactionEntry {
  id: string;
  accountId: string;
  entryType: EntryType;
  amountCents: number;
  currency: string;
  balanceBeforeCents: number;
  balanceAfterCents: number;
  description: string | null;
  createdAt: string;
}

export interface TransactionDetail {
  id: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  description: string | null;
  referenceNumber: string | null;
  amountCents: number;
  currency: string;
  sourceAccountId: string | null;
  targetAccountId: string | null;
  feeAmountCents: number;
  userId: string;
  completedAt: string | null;
  failedReason: string | null;
  entries: TransactionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface DepositPayload {
  accountId: string;
  amountCents: number;
  currency?: string;
  description?: string;
  idempotencyKey?: string;
}

export interface WithdrawalPayload {
  accountId: string;
  amountCents: number;
  currency?: string;
  description?: string;
  idempotencyKey?: string;
}

export interface TransferPayload {
  sourceAccountId: string;
  targetAccountId: string;
  amountCents: number;
  currency?: string;
  description?: string;
  idempotencyKey?: string;
}
