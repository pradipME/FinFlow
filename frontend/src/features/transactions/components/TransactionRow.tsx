import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { formatCurrency, formatRelativeTime } from "@/shared/lib/format";
import type { TransactionSummary, TransactionType } from "../types";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, RotateCcw, Receipt } from "lucide-react";
import { cn } from "@/shared/utils";

const TYPE_META: Record<TransactionType, { label: string; sign: "+" | "-" | ""; icon: typeof Receipt; tone: string }> = {
  DEPOSIT: { label: "Deposit", sign: "+", icon: ArrowDownToLine, tone: "bg-success-subtle text-credit" },
  WITHDRAWAL: { label: "Withdrawal", sign: "-", icon: ArrowUpFromLine, tone: "bg-danger-subtle text-debit" },
  TRANSFER: { label: "Transfer", sign: "", icon: ArrowRightLeft, tone: "bg-info-subtle text-info" },
  FEE: { label: "Fee", sign: "-", icon: Receipt, tone: "bg-warning-subtle text-pending" },
  REVERSAL: { label: "Reversal", sign: "+", icon: RotateCcw, tone: "bg-info-subtle text-info" },
};

interface TransactionRowProps {
  transaction: TransactionSummary;
}

export function TransactionRow({ transaction }: TransactionRowProps): React.ReactNode {
  const navigate = useNavigate();
  const meta = TYPE_META[transaction.transactionType] ?? {
    label: transaction.transactionType,
    sign: "",
    icon: Receipt,
    tone: "bg-bg-tertiary text-text-secondary",
  };
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => navigate(`${ROUTES.TRANSACTIONS}/${transaction.id}`)}
      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.tone)}>
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-text-primary">{meta.label}</p>
            <TransactionStatusBadge status={transaction.transactionStatus} />
          </div>
          <p className="mt-0.5 truncate text-xs text-text-tertiary">
            {transaction.description ?? transaction.referenceNumber ?? "No description"}
            <span className="text-text-disabled"> · {formatRelativeTime(transaction.createdAt)}</span>
          </p>
        </div>
      </div>
      <span
        className={cn(
          "font-tabular shrink-0 text-sm font-semibold",
          meta.sign === "+" ? "text-credit" : meta.sign === "-" ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {meta.sign}
        {formatCurrency(transaction.amountCents / 100, transaction.currency)}
      </span>
    </button>
  );
}