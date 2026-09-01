import type { ScheduleStatus } from "../types";

const statusStyles: Record<ScheduleStatus, string> = {
  ACTIVE: "bg-success-subtle text-success",
  PAUSED: "bg-warning-subtle text-chart-4",
  COMPLETED: "bg-info-subtle text-chart-3",
  CANCELLED: "bg-surface-active text-text-secondary",
  FAILED: "bg-danger-subtle text-danger",
};

export function TransferStatusBadge({ status }: { status: ScheduleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}