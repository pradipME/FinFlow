import { formatCurrency, formatDate } from "@/shared/lib/format";
import { TransferStatusBadge } from "./TransferStatusBadge";
import type { ScheduledTransfer } from "../types";
import { CalendarClock } from "lucide-react";

interface ScheduledTransferCardProps {
  transfer: ScheduledTransfer;
  onClick?: () => void;
}

export function ScheduledTransferCard({ transfer, onClick }: ScheduledTransferCardProps): React.ReactNode {
  return (
    <button
      onClick={onClick}
      className="group w-full overflow-hidden rounded-card border border-border-default bg-surface-primary p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevation-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-subtle text-info">
          <CalendarClock size={16} />
        </span>
        <TransferStatusBadge status={transfer.scheduleStatus} />
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-text-tertiary">
        {transfer.scheduleType === "RECURRING" ? `Recurring · ${transfer.frequency?.toLowerCase()}` : "One-time"}
      </p>
      <p className="font-tabular mt-1.5 text-2xl font-bold tracking-tight text-text-primary">
        {formatCurrency(transfer.amountCents / 100, transfer.currency)}
      </p>
      {transfer.description && <p className="mt-1 line-clamp-2 text-xs text-text-tertiary">{transfer.description}</p>}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-text-tertiary">
        <span>Next: {formatDate(transfer.nextExecution)}</span>
        <span className="font-mono">
          {transfer.executionCount}
          {transfer.maxExecutions ? `/${transfer.maxExecutions}` : ""} runs
        </span>
      </div>
    </button>
  );
}