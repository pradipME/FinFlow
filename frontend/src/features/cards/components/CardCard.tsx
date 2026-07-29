import { formatCurrency } from "@/shared/lib/format";
import { CardStatusBadge } from "./CardStatusBadge";
import type { CardSummary } from "../types";

interface CardCardProps {
  card: CardSummary;
  onClick?: () => void;
}

export function CardCard({ card, onClick }: CardCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{card.cardType}</span>
        <CardStatusBadge status={card.cardStatus} />
      </div>
      <p className="mt-2 text-lg font-mono font-semibold text-gray-900">
        **** **** **** {card.cardLastFour}
      </p>
      <p className="mt-1 text-sm text-gray-700">{card.cardholderName}</p>
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>Exp {String(card.expiryMonth).padStart(2, "0")}/{card.expiryYear}</span>
        {card.creditLimitCents && (
          <span>Limit: {formatCurrency(card.creditLimitCents, card.currency)}</span>
        )}
      </div>
    </button>
  );
}
