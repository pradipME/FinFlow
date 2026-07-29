import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import type { AccountSummary } from "../types";
import { AccountStatusBadge } from "./AccountStatusBadge";
import type { AccountType } from "../types";

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: "Checking",
  SAVINGS: "Savings",
  CREDIT_CARD: "Credit Card",
};

interface AccountCardProps {
  account: AccountSummary;
}

export function AccountCard({ account }: AccountCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`${ROUTES.ACCOUNTS}/${account.id}`)}
      className="w-full text-left rounded-xl border border-border-default bg-surface-primary p-5 transition-all hover:border-brand-primary/40 hover:shadow-elevation-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            {ACCOUNT_TYPE_LABELS[account.accountType]}
          </p>
          <p className="mt-1 text-lg font-semibold text-text-primary">
            {account.nickname ?? account.accountNumber}
          </p>
        </div>
        <AccountStatusBadge status={account.accountStatus} />
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-text-primary">
          {formatCurrency(account.availableBalanceCents / 100, account.currency)}
        </p>
        <p className="mt-1 text-xs text-text-tertiary">
          {account.accountNumber} &middot; {account.currency}
        </p>
      </div>

      <div className="mt-3 border-t border-border-subtle pt-3">
        <p className="text-xs text-text-tertiary">
          Opened {formatDate(account.createdAt)}
        </p>
      </div>
    </button>
  );
}
