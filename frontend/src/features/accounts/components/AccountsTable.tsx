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

interface AccountsTableProps {
  accounts: AccountSummary[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-border-default">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-default bg-surface-secondary">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
              Account
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
              Balance
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
              Opened
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {accounts.map((account) => (
            <tr
              key={account.id}
              onClick={() => navigate(`${ROUTES.ACCOUNTS}/${account.id}`)}
              className="cursor-pointer transition-colors hover:bg-surface-hover"
            >
              <td className="whitespace-nowrap px-4 py-3">
                <p className="text-sm font-medium text-text-primary">
                  {account.nickname ?? account.accountNumber}
                </p>
                <p className="text-xs text-text-tertiary">{account.accountNumber}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {ACCOUNT_TYPE_LABELS[account.accountType]}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <AccountStatusBadge status={account.accountStatus} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-text-primary">
                {formatCurrency(account.availableBalanceCents / 100, account.currency)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-text-tertiary">
                {formatDate(account.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
