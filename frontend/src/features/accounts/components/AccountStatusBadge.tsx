import { Badge } from "@/shared/components";
import type { AccountStatus } from "../types";
import type { FinancialStatus } from "@/shared/components/Badge/types";

const STATUS_MAP: Record<AccountStatus, { label: string; financial: FinancialStatus }> = {
  PENDING: { label: "Pending", financial: "pending" },
  ACTIVE: { label: "Active", financial: "settled" },
  FROZEN: { label: "Frozen", financial: "held" },
  CLOSED: { label: "Closed", financial: "failed" },
  DORMANT: { label: "Dormant", financial: "pending" },
};

interface AccountStatusBadgeProps {
  status: AccountStatus;
}

export function AccountStatusBadge({ status }: AccountStatusBadgeProps) {
  const { label, financial } = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
  return (
    <Badge variant="financial" financialStatus={financial} shape="pill" size="sm">
      {label}
    </Badge>
  );
}
