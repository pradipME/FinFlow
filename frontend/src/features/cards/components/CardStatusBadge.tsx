import type { CardStatus } from "../types";

const statusStyles: Record<CardStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  FROZEN: "bg-blue-100 text-blue-800",
  BLOCKED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-gray-100 text-gray-800",
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
