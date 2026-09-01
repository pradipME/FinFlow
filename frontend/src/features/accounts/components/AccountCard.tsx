import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import type { AccountSummary, AccountType } from "../types";
import { AccountStatusBadge } from "./AccountStatusBadge";

const ACCOUNT_TYPE_META: Record<AccountType, { label: string; chip: string; glow: string }> = {
  CHECKING: {
    label: "Checking",
    chip: "bg-emerald-500/15 text-emerald-400",
    glow: "rgba(16,185,129,0.14)",
  },
  SAVINGS: {
    label: "Savings",
    chip: "bg-violet-500/15 text-violet-400",
    glow: "rgba(139,92,246,0.14)",
  },
  CREDIT_CARD: {
    label: "Credit Card",
    chip: "bg-cyan-500/15 text-cyan-400",
    glow: "rgba(6,182,212,0.14)",
  },
};

function maskNumber(number: string): string {
  return `•••• ${number.slice(Math.max(0, number.length - 4))}`;
}

interface AccountCardProps {
  account: AccountSummary;
}

export function AccountCard({ account }: AccountCardProps) {
  const navigate = useNavigate();
  const meta = ACCOUNT_TYPE_META[account.accountType];

  return (
    <button
      type="button"
      onClick={() => navigate(`${ROUTES.ACCOUNTS}/${account.id}`)}
      className="group relative w-full overflow-hidden rounded-xl border border-border-default bg-surface-primary p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevation-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px 160px at 20% 0%, ${meta.glow}, transparent)` }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${meta.chip}`}>
            {account.accountType.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-medium text-text-secondary">{meta.label}</p>
            <p className="text-base font-semibold tracking-tight text-text-primary">
              {account.nickname ?? account.accountNumber}
            </p>
          </div>
        </div>
        <AccountStatusBadge status={account.accountStatus} />
      </div>

      <div className="relative mt-5">
        <p className="font-tabular text-2xl font-bold tracking-tight text-text-primary">
          {formatCurrency(account.availableBalanceCents / 100, account.currency)}
        </p>
        <p className="font-mono mt-1 text-xs tracking-wider text-text-tertiary">
          {maskNumber(account.accountNumber)}
        </p>
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <p className="text-xs text-text-tertiary">Opened {formatDate(account.createdAt)}</p>
        <span className="text-xs font-medium text-brand-primary opacity-0 transition-opacity group-hover:opacity-100">
          View →
        </span>
      </div>
    </button>
  );
}