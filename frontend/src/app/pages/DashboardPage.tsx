import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Send,
  HandCoins,
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks";
import { useTransactions } from "@/features/transactions/hooks";
import { useSavingsGoals } from "@/features/savings/hooks";
import { useCards } from "@/features/cards/hooks";
import { useProfile } from "@/features/profile/hooks";
import { Card, CardHeader, EmptyState, Skeleton, Button } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { DepositDialog, WithdrawalDialog, TransferDialog } from "@/features/transactions/pages";
import { formatCurrency, formatRelativeTime } from "@/shared/lib/format";
import { cn } from "@/shared/utils";

function isWithinDays(iso: string, days: number): boolean {
  const then = new Date(iso).getTime();
  return Date.now() - then <= days * 24 * 60 * 60 * 1000;
}

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function SummaryItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-text-tertiary">{label}</p>
        <p className="truncate font-tabular text-base font-semibold tracking-tight text-text-primary">{value}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts({ page: 0, size: 50 });
  const { data: txData } = useTransactions({ page: 0, size: 200 });
  const { data: goalsData } = useSavingsGoals();
  const { data: cardsData } = useCards();
  const { data: profile } = useProfile();
  const [dialog, setDialog] = useState<"deposit" | "withdraw" | "transfer" | null>(null);

  const firstName = profile?.firstName;
  const accounts = useMemo(() => (accountsData?.content ?? []).filter((a) => a.accountStatus === "ACTIVE"), [accountsData]);
  const transactions = useMemo(() => txData?.content ?? [], [txData]);
  const goals = useMemo(() => goalsData?.content ?? [], [goalsData]);
  const cards = useMemo(() => cardsData?.content ?? [], [cardsData]);

  const stats = useMemo(() => {
    const totalBalanceCents = accounts.reduce((sum, a) => sum + a.availableBalanceCents, 0);
    const thirtyDays = transactions.filter((t) => isWithinDays(t.createdAt, 30));
    const depositsCents = thirtyDays.filter((t) => t.transactionType === "DEPOSIT").reduce((s, t) => s + t.amountCents, 0);
    const withdrawalsCents = thirtyDays
      .filter((t) => t.transactionType === "WITHDRAWAL" || t.transactionType === "FEE")
      .reduce((s, t) => s + t.amountCents, 0);
    return {
      totalBalance: formatCurrency(totalBalanceCents / 100),
      deposits: formatCurrency(depositsCents / 100),
      withdrawals: formatCurrency(withdrawalsCents / 100),
    };
  }, [accounts, transactions]);

  const totalSavingsCents = goals
    .filter((g) => g.goalStatus === "ACTIVE" || g.goalStatus === "PAUSED")
    .reduce((s, g) => s + g.currentAmountCents, 0);

  if (accountsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greetingFor(new Date().getHours())}${firstName ? `, ${firstName}` : ""}`}
        subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      />

      {/* Money actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ActionButton icon={Send} label="Send Money" onClick={() => setDialog("transfer")} />
        <ActionButton icon={HandCoins} label="Request Money" disabled badge="Soon" />
        <ActionButton icon={ArrowDownToLine} label="Add Money" onClick={() => setDialog("deposit")} />
        <ActionButton icon={ArrowUpFromLine} label="Withdraw" onClick={() => setDialog("withdraw")} />
      </div>

      {/* Balance */}
      <div className="relative overflow-hidden rounded-card border border-border-default bg-surface-primary p-6">
        <div
          className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full opacity-20"
          style={{ background: "radial-gradient(closest-side, #2fd6a3, transparent)" }}
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-text-tertiary">Total net balance</p>
        <p className="font-tabular mt-1 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          {stats.totalBalance}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border-subtle pt-4 sm:grid-cols-3">
          <SummaryItem icon={ArrowDownRight} label="Inflow · 30 days" value={stats.deposits} />
          <SummaryItem icon={ArrowUpRight} label="Outflow · 30 days" value={stats.withdrawals} />
          <SummaryItem icon={Wallet} label="Active accounts" value={`${accounts.length}`} />
        </div>
      </div>

      {/* Accounts + shortcuts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Your accounts"
            actions={
              <Link to="/accounts" className="text-sm font-medium text-brand-primary hover:underline">
                View all
              </Link>
            }
          />
          {accounts.length === 0 ? (
            <EmptyState
              title="No accounts yet"
              description="Create an account to start moving money."
              action={
                <Link to="/accounts">
                  <Button size="sm" variant="primary">
                    <Wallet size={16} /> New Account
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {accounts.slice(0, 4).map((account) => (
                <Link
                  key={account.id}
                  to={`/accounts/${account.id}`}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-secondary px-3.5 py-3 transition-colors hover:border-border-strong"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary">
                      <Wallet size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {account.nickname ?? account.accountNumber}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        •••• {account.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <span className="font-tabular shrink-0 text-sm font-semibold text-text-primary">
                    {formatCurrency(account.availableBalanceCents / 100, account.currency)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Savings + cards summary */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <SummaryItem icon={PiggyBank} label="Savings so far" value={goals.length > 0 ? formatCurrency(totalSavingsCents / 100) : "—"} />
              <Link to="/savings" className="shrink-0 text-sm font-medium text-brand-primary hover:underline">
                {goals.length > 0 ? `${goals.length} goal${goals.length === 1 ? "" : "s"}` : "Start"}
              </Link>
            </div>
            {goals.length > 0 && (
              <div className="mt-4 space-y-2">
                {goals.slice(0, 2).map((goal) => (
                  <div key={goal.id} className="rounded-lg border border-border-subtle bg-bg-secondary px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-text-primary">{goal.goalName}</p>
                      <span className="font-tabular text-xs font-semibold text-brand-primary">{goal.progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
                      <div className="h-full rounded-full bg-gradient-to-r from-chart-1 to-chart-3" style={{ width: `${Math.min(100, goal.progressPercent)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <SummaryItem icon={CreditCard} label="Cards" value={cards.length > 0 ? `${cards.length} active` : "—"} />
              <Link to="/cards" className="shrink-0 text-sm font-medium text-brand-primary hover:underline">
                Manage
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader
          title="Recent activity"
          subtitle="Latest transactions across your accounts"
          actions={
            <Link to="/transactions" className="text-sm font-medium text-brand-primary hover:underline">
              View all
            </Link>
          }
        />
        {transactions.length === 0 ? (
          <EmptyState title="No transactions yet" description="Deposits and transfers will appear here." />
        ) : (
          <ul className="space-y-1">
            {transactions.slice(0, 6).map((tx) => {
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

      <DepositDialog open={dialog === "deposit"} accounts={accounts} onClose={() => setDialog(null)} />
      <WithdrawalDialog open={dialog === "withdraw"} accounts={accounts} onClose={() => setDialog(null)} />
      <TransferDialog open={dialog === "transfer"} accounts={accounts} onClose={() => setDialog(null)} />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 rounded-card border p-4 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none",
        disabled
          ? "cursor-not-allowed border-border-subtle bg-surface-secondary/40 opacity-70"
          : "border-border-default bg-surface-primary hover:-translate-y-0.5 hover:border-brand-primary/40",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          disabled ? "bg-bg-tertiary text-text-tertiary" : "bg-brand-primary text-white",
        )}
      >
        <Icon size={20} />
      </span>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
        {label}
        {badge && <span className="rounded-full bg-warning-subtle px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-warning">{badge}</span>}
      </span>
    </button>
  );
}