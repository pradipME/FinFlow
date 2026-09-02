import { formatCurrency } from "@/shared/lib/format";
import type { CardSummary, CardType } from "../types";
import { CardStatusBadge } from "./CardStatusBadge";
import { Nfc, CreditCard as CreditCardIcon } from "lucide-react";

const CARD_GRADIENTS: Record<CardType, string> = {
  DEBIT: "linear-gradient(135deg, #101C16 0%, #0B1411 55%, #122A20 100%)",
  CREDIT: "linear-gradient(135deg, #151A2C 0%, #0D1122 55%, #1A1B3E 100%)",
  PREPAID: "linear-gradient(135deg, #0F1A26 0%, #0A121C 55%, #102333 100%)",
};

const CARD_GLOW: Record<CardType, string> = {
  DEBIT: "rgba(16,185,129,0.35)",
  CREDIT: "rgba(129,140,248,0.35)",
  PREPAID: "rgba(6,182,212,0.35)",
};

function maskNumber(lastFour: string): string {
  return `•••• •••• •••• ${lastFour}`;
}

interface CardCardProps {
  card: CardSummary;
  onClick?: () => void;
  /** Human label for the linked account, e.g. nickname + currency. */
  accountLabel?: string;
}

export function CardCard({ card, onClick, accountLabel }: CardCardProps): React.ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-xl text-left transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      <div className="relative aspect-[1.6] rounded-xl border border-border-default p-5" style={{ background: CARD_GRADIENTS[card.cardType] }}>
        {/* Glow */}
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-60"
          style={{ background: `radial-gradient(closest-side, ${CARD_GLOW[card.cardType]}, transparent)` }}
          aria-hidden="true"
        />

        {/* Top row: chip + contactless */}
        <div className="relative flex items-start justify-between">
          <div className="h-8 w-11 rounded-md border border-white/10 bg-gradient-to-br from-amber-200/80 to-amber-500/60" aria-hidden="true">
            <div className="h-full w-full rounded-md border border-amber-900/10" />
          </div>
          <div className="flex items-center gap-2">
            <Nfc size={16} className="text-white/50" />
            <CreditCardIcon size={16} className="text-white/40" />
          </div>
        </div>

        {/* PAN */}
        <p className="font-tabular relative mt-4 font-mono text-base tracking-[0.12em] text-white/90 sm:text-lg">
          {maskNumber(card.cardLastFour)}
        </p>

        {/* Cardholder + expiry */}
        <div className="relative mt-4 flex items-end justify-between">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">Cardholder</p>
            <p className="truncate text-sm font-medium text-white/90">{card.cardholderName}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">Expires</p>
            <p className="font-mono text-sm text-white/90">
              {String(card.expiryMonth).padStart(2, "0")}/{card.expiryYear}
            </p>
          </div>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
            {card.cardType}
          </span>
        </div>
      </div>

      {/* Status strip */}
      <div className="flex items-center justify-between gap-2 border border-t-0 border-border-default bg-surface-secondary px-4 py-2.5">
        <CardStatusBadge status={card.cardStatus} />
        <div className="flex shrink-0 items-center gap-3">
          {accountLabel && (
            <span className="truncate text-xs text-text-tertiary">
              <span className="hidden sm:inline">Linked · </span>
              <span className="text-text-primary">{accountLabel}</span>
            </span>
          )}
          {card.cardType === "CREDIT" && card.creditLimitCents != null && (
            <span className="text-xs text-text-tertiary">
              Limit <span className="font-tabular font-medium text-text-primary">{formatCurrency(card.creditLimitCents / 100, card.currency)}</span>
            </span>
          )}
        </div>
      </div>
    </button>
  );
}