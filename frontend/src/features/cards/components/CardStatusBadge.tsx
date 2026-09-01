import type { CardStatus } from "../types";

const statusStyles: Record<CardStatus, string> = {
  PENDING: "bg-warning-subtle text-chart-4",
  ACTIVE: "bg-success-subtle text-success",
  FROZEN: "bg-info-subtle text-chart-3",
  BLOCKED: "bg-danger-subtle text-danger",
  EXPIRED: "bg-surface-active text-text-secondary",
  CANCELLED: "bg-surface-active text-text-secondary",
};

export function CardStatusBadge({ status }: { status: CardStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}