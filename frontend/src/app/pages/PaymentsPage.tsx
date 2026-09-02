import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Send,
  HandCoins,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
  Users,
  Scissors,
} from "lucide-react";
import { Card, EmptyState, Badge, Skeleton } from "@/shared/components";
import { useAccounts } from "@/features/accounts/hooks";
import { useTransactions } from "@/features/transactions/hooks";
import { DepositDialog, WithdrawalDialog, TransferDialog } from "@/features/transactions/pages";
import { formatCurrency, formatRelativeTime } from "@/shared/lib/format";
import { cn } from "@/shared/utils";

export function PaymentsPage() {
  const { data: accountsData, isLoading } = useAccounts({ page: 0, size: 50 });
  const { data: txData, isLoading: txLoading } = useTransactions({ page: 0, size: 10 });
  const accounts = (accountsData?.content ?? []).filter((a) => a.accountStatus === "ACTIVE");
  const txns = txData?.content ?? [];

  const [dialog, setDialog] = useState<"deposit" | "withdraw" | "transfer" | null>(null);

  function handleUnavailable() {
    toast.info("Request Money isn't available yet — check back soon.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Payments</h1>
        <p className="mt-1 text-sm text-text-tertiary">Send and manage money quickly.</p>
      </div>

      {/* Hero balance */}
      <Card className="relative overflow-hidden p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-30"
          style={{ background: "radial-gradient(closest-side, #2fd6a3, transparent)" }}
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-text-tertiary">Total balance</p>
        <p className="font-tabular mt-1 text-4xl font-bold tracking-tight text-text-primary">
          {isLoading
            ? "…"
            : formatCurrency(
                accounts.reduce((s, a) => s + a.availableBalanceCents, 0) / 100,
              )}
        </p>
      </Card>

      {/* Primary money actions (PhonePe-style grid) */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        <ActionButton icon={Send} label="Send Money" onClick={() => setDialog("transfer")} />
        <ActionButton
          icon={HandCoins}
          label="Request Money"
          onClick={handleUnavailable}
          disabled
          badge="Soon"
        />
        <ActionButton icon={ArrowDownToLine} label="Add Money" onClick={() => setDialog("deposit")} />
        <ActionButton icon={ArrowUpFromLine} label="Withdraw" onClick={() => setDialog("withdraw")} />
        <ActionButton icon={Scissors} label="Transfers" href="/transfers" />
      </div>

      {/* More services */}
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">More services</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <ServiceLink icon={CreditCard} label="Cards" href="/cards" />
          <ServiceLink icon={PiggyBank} label="Savings" href="/savings" />
          <ServiceLink icon={Users} label="Beneficiaries" href="/beneficiaries" />
          <ServiceLink icon={ArrowLeftRight} label="Accounts" href="/accounts" />
        </div>
        {accounts.length === 0 && (
          <EmptyState
            className="mt-4"
            title="No active accounts"
            description="Create an account to start using payments."
          />
        )}
      </Card>

      <DepositDialog open={dialog === "deposit"} accounts={accounts} onClose={() => setDialog(null)} />
      <WithdrawalDialog open={dialog === "withdraw"} accounts={accounts} onClose={() => setDialog(null)} />
      <TransferDialog open={dialog === "transfer"} accounts={accounts} onClose={() => setDialog(null)} />

      {/* Recent transactions */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Recent transactions</h2>
            <p className="mt-0.5 text-sm text-text-tertiary">Latest activity across your accounts</p>
          </div>
          {txns.length > 0 && (
            <Link to="/transactions" className="text-sm font-medium text-brand-primary hover:underline">
              View all
            </Link>
          )}
        </div>
        {txLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : txns.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Deposits, withdrawals and transfers will appear here."
            className="py-6"
          />
        ) : (
          <ul className="space-y-1">
            {txns.slice(0, 6).map((tx) => {
              const isCredit = tx.transactionType === "DEPOSIT";
              const isOut = tx.transactionType === "WITHDRAWAL" || tx.transactionType === "FEE";
              return (
                <li key={tx.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-bg-secondary">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        isCredit ? "bg-success-subtle text-credit" : isOut ? "bg-danger-subtle text-debit" : "bg-info-subtle text-info",
                      )}
                    >
                      {isCredit ? <ArrowDownRight size={16} /> : isOut ? <ArrowUpRight size={16} /> : <ArrowLeftRight size={16} />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {tx.description ?? tx.transactionType.charAt(0) + tx.transactionType.slice(1).toLowerCase()}
                      </p>
                      <p className="text-xs text-text-tertiary">{formatRelativeTime(tx.createdAt)}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "font-tabular shrink-0 text-sm font-semibold",
                      isCredit ? "text-credit" : isOut ? "text-text-primary" : "text-text-secondary",
                    )}
                  >
                    {isCredit ? "+" : ""}
                    {formatCurrency(tx.amountCents / 100, tx.currency)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  href,
  disabled,
  badge,
}: {
  icon: typeof Send;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  badge?: string;
}) {
  const inner = (
    <div
      className={
        "flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-5 text-center " +
        (disabled
          ? "cursor-not-allowed border-border-subtle bg-surface-secondary/40 text-text-tertiary"
          : "border-border-default bg-surface-primary text-text-secondary transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:text-text-primary")
      }
    >
      <span
        className={
          "flex h-11 w-11 items-center justify-center rounded-full " +
          (disabled ? "bg-bg-tertiary text-text-tertiary" : "text-white")
        }
        style={disabled ? undefined : { background: "linear-gradient(135deg, #2fd6a3, #0aa57f)" }}
      >
        <Icon size={20} />
      </span>
      <span className="flex items-center gap-1 text-xs font-semibold">
        {label}
        {badge && (
          <Badge variant="warning" size="sm">{badge}</Badge>
        )}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-2xl">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-2xl disabled:pointer-events-none">
      {inner}
    </button>
  );
}

function ServiceLink({ icon: Icon, label, href }: { icon: typeof Send; label: string; href: string }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-secondary/60 px-3 py-3 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary">
        <Icon size={17} />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}