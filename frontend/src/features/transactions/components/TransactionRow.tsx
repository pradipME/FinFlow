import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import type { TransactionSummary } from "../types";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import type { TransactionType } from "../types";

const TYPE_LABELS: Record<TransactionType, { label: string; sign: "+" | "-" | "" }> = {
  DEPOSIT: { label: "Deposit", sign: "+" },
  WITHDRAWAL: { label: "Withdrawal", sign: "-" },
  TRANSFER: { label: "Transfer", sign: "" },
  FEE: { label: "Fee", sign: "-" },
  REVERSAL: { label: "Reversal", sign: "+" },
};

interface TransactionRowProps {
  transaction: TransactionSummary;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const navigate = useNavigate();
  const typeInfo = TYPE_LABELS[transaction.transactionType] ?? { label: transaction.transactionType, sign: "" };

  return (
    <button
      type="button"
      onClick={() => navigate(`${ROUTES.TRANSACTIONS}/${transaction.id}`)}
      className="flex w-full items-center justify-between rounded-lg border border-border-subtle bg-surface-primary p-4 text-left transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary">{typeInfo.label}</p>
          <TransactionStatusBadge status={transaction.transactionStatus} />
        </div>
        <p className="mt-0.5 truncate text-xs text-text-tertiary">
          {transaction.description ?? transaction.referenceNumber ?? "No description"}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            typeInfo.sign === "+" ? "text-success" : typeInfo.sign === "-" ? "text-danger" : "text-text-primary"
          }`}
        >
          {typeInfo.sign}
          {formatCurrency(transaction.amountCents / 100, transaction.currency)}
        </p>
        <p className="text-xs text-text-tertiary">{formatDate(transaction.createdAt)}</p>
      </div>
    </button>
  );
}
