import type { SavingsGoalStatus } from "../types";

const statusStyles: Record<SavingsGoalStatus, string> = {
  ACTIVE: "bg-success-subtle text-success",
  PAUSED: "bg-warning-subtle text-chart-4",
  COMPLETED: "bg-info-subtle text-chart-3",
  CANCELLED: "bg-surface-active text-text-secondary",
};

export function SavingsGoalStatusBadge({ status }: { status: SavingsGoalStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}