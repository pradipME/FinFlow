export type CustomerRequestType = "ACCOUNT_REQUEST" | "CARD_REQUEST";
export type CustomerRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface RequestDetails {
  accountType?: string | null;
  nickname?: string | null;
  currency?: string | null;
  cardType?: string | null;
  cardholderName?: string | null;
  creditLimitCents?: number | null;
  dailyLimitCents?: number | null;
  monthlyLimitCents?: number | null;
}

export interface CustomerRequest {
  id: string;
  customerId: string;
  requestType: CustomerRequestType;
  requestStatus: CustomerRequestStatus;
  targetAccountId: string | null;
  details: RequestDetails | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string | null;
}

export interface CreateCustomerRequestPayload {
  requestType: CustomerRequestType;
  targetAccountId?: string;
  details: RequestDetails;
}