import { Badge } from "@/shared/components";
import type { BeneficiaryStatus } from "../types";
import type { FinancialStatus } from "@/shared/components/Badge/types";

const STATUS_MAP: Record<BeneficiaryStatus, { label: string; financial: FinancialStatus }> = {
  ACTIVE: { label: "Active", financial: "settled" },
  INACTIVE: { label: "Inactive", financial: "pending" },
  BLOCKED: { label: "Blocked", financial: "failed" },
};

interface BeneficiaryStatusBadgeProps {
  status: BeneficiaryStatus;
}

export function BeneficiaryStatusBadge({ status }: BeneficiaryStatusBadgeProps) {
  const { label, financial } = STATUS_MAP[status] ?? STATUS_MAP.ACTIVE;
  return (
    <Badge variant="financial" financialStatus={financial} shape="pill" size="sm">
      {label}
    </Badge>
  );
}
