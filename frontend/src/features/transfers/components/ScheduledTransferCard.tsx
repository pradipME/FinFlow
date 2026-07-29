import { formatCurrency, formatDate } from "@/shared/lib/format";
import { TransferStatusBadge } from "./TransferStatusBadge";
import type { ScheduledTransfer } from "../types";

interface ScheduledTransferCardProps {
  transfer: ScheduledTransfer;
  onClick?: () => void;
}

export function ScheduledTransferCard({ transfer, onClick }: ScheduledTransferCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">
            {transfer.scheduleType} {transfer.frequency ? `(${transfer.frequency})` : ""}
          </span>
          <TransferStatusBadge status={transfer.scheduleStatus} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">
        {formatCurrency(transfer.amountCents, transfer.currency)}
      </p>
      {transfer.description && (
        <p className="mt-1 text-xs text-gray-500">{transfer.description}</p>
      )}
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>Next: {formatDate(transfer.nextExecution)}</span>
        <span>
          Runs: {transfer.executionCount}
          {transfer.maxExecutions ? `/${transfer.maxExecutions}` : ""}
        </span>
      </div>
    </button>
  );
}
