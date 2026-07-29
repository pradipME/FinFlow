export type BeneficiaryStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface Beneficiary {
  id: string;
  nickname: string | null;
  beneficiaryName: string;
  email: string | null;
  bankName: string | null;
  accountNumber: string;
  routingNumber: string | null;
  iban: string | null;
  swiftCode: string | null;
  currency: string;
  beneficiaryStatus: BeneficiaryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryPayload {
  beneficiaryName: string;
  nickname?: string;
  email?: string;
  bankName?: string;
  accountNumber: string;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
  currency?: string;
}

export interface UpdateBeneficiaryPayload {
  beneficiaryName?: string;
  nickname?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
  currency?: string;
}
