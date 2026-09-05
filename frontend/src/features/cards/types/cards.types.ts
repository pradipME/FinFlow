export type CardType = "DEBIT" | "CREDIT" | "PREPAID";
export type CardStatus = "PENDING" | "ACTIVE" | "FROZEN" | "BLOCKED" | "EXPIRED" | "CANCELLED";

export interface CardSummary {
  id: string;
  accountId: string;
  cardLastFour: string;
  cardType: CardType;
  cardStatus: CardStatus;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  creditLimitCents: number | null;
  dailyLimitCents: number | null;
  monthlyLimitCents: number | null;
  currency: string;
  pinSet: boolean;
  createdAt: string;
}

export interface UpdateCardPayload {
  cardholderName?: string;
  dailyLimitCents?: number;
  monthlyLimitCents?: number;
}