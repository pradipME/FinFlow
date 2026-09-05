export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAccounts: number;
  activeAccounts: number;
  totalCards: number;
  activeCards: number;
  totalFundsCents: number;
  pendingAccountRequests: number;
  pendingCardRequests: number;
  pendingRequests: number;
  recentCustomerRequests: number;
  totalTransactions: number;
  recentTransactions: number;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface AdminUserDetails extends AdminUserSummary {
  accountCount: number;
  cardCount: number;
  pendingRequestCount: number;
}

export interface CreateCustomerPayload {
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
}

export type AccountStatus = "PENDING" | "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "CLOSED";
export type AccountType = "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT";
export type CardType = "DEBIT" | "CREDIT" | "PREPAID";
export type CardStatus = "PENDING" | "ACTIVE" | "FROZEN" | "BLOCKED" | "CANCELLED";
export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "REVERSAL";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface AdminAccountSummary extends Record<string, unknown> {
  id: string;
  ownerId: string;
  accountNumber: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  nickname: string | null;
  currency: string;
  ledgerBalanceCents: number;
  availableBalanceCents: number;
  createdAt: string;
}

export interface AdminCardSummary extends Record<string, unknown> {
  id: string;
  accountId: string;
  cardLastFour: string;
  cardType: CardType;
  cardStatus: CardStatus;
  cardholderName: string;
  currency: string;
  createdAt: string;
}

export interface AdminTransactionSummary extends Record<string, unknown> {
  id: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  description: string | null;
  referenceNumber: string | null;
  amountCents: number;
  currency: string;
  sourceAccountId: string | null;
  targetAccountId: string | null;
  createdAt: string | null;
}

export type AccountRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AccountRequestType = "ACCOUNT_REQUEST" | "CARD_REQUEST";

export interface AdminRequestDetails extends Record<string, unknown> {
  accountType?: AccountType | null;
  nickname?: string | null;
  currency?: string | null;
  cardType?: CardType | null;
  cardholderName?: string | null;
  creditLimitCents?: number | null;
  dailyLimitCents?: number | null;
  monthlyLimitCents?: number | null;
}

export interface AdminRequest extends Record<string, unknown> {
  id: string;
  customerId: string;
  requestType: AccountRequestType;
  requestStatus: AccountRequestStatus;
  targetAccountId: string | null;
  details: AdminRequestDetails | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string | null;
}

export interface FundAccountPayload {
  amountCents: number;
  description?: string;
}
