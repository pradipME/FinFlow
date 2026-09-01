import { Select } from "@/shared/components";
import type { TransactionType, TransactionStatus } from "../types";

interface TransactionFiltersProps {
  typeFilter: TransactionType | "";
  statusFilter: TransactionStatus | "";
  onTypeChange: (type: TransactionType | "") => void;
  onStatusChange: (status: TransactionStatus | "") => void;
}

const TYPES: { value: TransactionType; label: string }[] = [
  { value: "DEPOSIT", label: "Deposits" },
  { value: "WITHDRAWAL", label: "Withdrawals" },
  { value: "TRANSFER", label: "Transfers" },
  { value: "FEE", label: "Fees" },
  { value: "REVERSAL", label: "Reversals" },
];

const STATUSES: { value: TransactionStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function TransactionFilters({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as TransactionType | "")}
        className="w-44"
        options={[
          { value: "", label: "All types" },
          ...TYPES.map((t) => ({ value: t.value, label: t.label })),
        ]}
      />
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as TransactionStatus | "")}
        className="w-44"
        options={[
          { value: "", label: "All statuses" },
          ...STATUSES.map((s) => ({ value: s.value, label: s.label })),
        ]}
      />
    </div>
  );
}