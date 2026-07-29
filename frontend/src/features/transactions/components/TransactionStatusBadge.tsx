import { Badge } from "@/shared/components";
import type { TransactionStatus } from "../types";
import type { FinancialStatus } from "@/shared/components/Badge/types";

const STATUS_MAP: Record<TransactionStatus, { label: string; financial: FinancialStatus }> = {
  PENDING: { label: "Pending", financial: "pending" },
  COMPLETED: { label: "Completed", financial: "settled" },
  FAILED: { label: "Failed", financial: "failed" },
  CANCELLED: { label: "Cancelled", financial: "reversed" },
};

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const { label, financial } = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
  return (
    <Badge variant="financial" financialStatus={financial} shape="pill" size="sm">
      {label}
    </Badge>
  );
}
