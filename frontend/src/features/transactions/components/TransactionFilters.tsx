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
    <div className="flex flex-wrap gap-3">
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as TransactionType | "")}
        className="rounded-lg border border-border-default bg-surface-primary px-3 py-1.5 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
      >
        <option value="">All Types</option>
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as TransactionStatus | "")}
        className="rounded-lg border border-border-default bg-surface-primary px-3 py-1.5 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
