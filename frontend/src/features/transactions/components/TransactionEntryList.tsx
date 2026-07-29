import { formatCurrency } from "@/shared/lib/format";
import type { TransactionEntry } from "../types";

interface TransactionEntryListProps {
  entries: TransactionEntry[];
}

export function TransactionEntryList({ entries }: TransactionEntryListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-text-tertiary">No entries recorded.</p>;
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-secondary p-3"
        >
          <div>
            <p className="text-sm font-medium text-text-primary">
              {entry.entryType === "CREDIT" ? "Credit" : "Debit"}
            </p>
            {entry.description && (
              <p className="text-xs text-text-tertiary">{entry.description}</p>
            )}
            <p className="text-xs text-text-tertiary">
              Balance: {formatCurrency(entry.balanceBeforeCents / 100)} &rarr;{" "}
              {formatCurrency(entry.balanceAfterCents / 100)}
            </p>
          </div>
          <span
            className={`text-sm font-semibold ${
              entry.entryType === "CREDIT" ? "text-success" : "text-danger"
            }`}
          >
            {entry.entryType === "CREDIT" ? "+" : "-"}
            {formatCurrency(entry.amountCents / 100)}
          </span>
        </div>
      ))}
    </div>
  );
}
