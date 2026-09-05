import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  HandCoins,
  Wallet,
  Send,
  MoreHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks";
import { useTransactions } from "@/features/transactions/hooks";
import { useSavingsGoals } from "@/features/savings/hooks";
import { useCards } from "@/features/cards/hooks";
import { useProfile } from "@/features/profile/hooks";
import { Card, EmptyState, Skeleton } from "@/shared/components";
import { WithdrawalDialog, TransferDialog, MobilePaymentDialog } from "@/features/transactions/pages";
import { CardCard } from "@/features/cards/components/CardCard";
import { Avatar } from "@/shared/components/Avatar";
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

export function DashboardPage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts({ page: 0, size: 50 });
  const { data: txData, error: txError } = useTransactions({ page: 0, size: 200 });
  const { data: goalsData } = useSavingsGoals();
  const { data: cardsData } = useCards();
  const { data: profile } = useProfile();
  const [dialog, setDialog] = useState<"withdraw" | "transfer" | "mobile" | null>(null);

  const firstName = profile?.firstName;
  const accounts = useMemo(() => (accountsData?.content ?? []).filter((a) => a.accountStatus === "ACTIVE"), [accountsData]);
  const transactions = useMemo(() => txData?.content ?? [], [txData]);
  const goals = useMemo(() => goalsData?.content ?? [], [goalsData]);
  const cards = useMemo(() => cardsData?.content ?? [], [cardsData]);

  const primaryAccount = accounts[0];
  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Account Holder";

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

  const currencies = [...new Set(accounts.map((a) => a.currency))];

  if (accountsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar name={displayName} size={44} />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {greetingFor(new Date().getHours())}, {firstName || "there"} <Sparkles size={20} className="inline text-brand-primary" />
          </h1>
          <p className="mt-0.5 text-sm text-text-tertiary">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Large rounded gradient balance card */}
      <div
        className="relative overflow-hidden rounded-[1.75rem] shadow-elevation-lg"
        style={{ background: "linear-gradient(135deg,#0F8F62 0%,#2FD6A3 55%,#0EA5E9 100%)" }}
      >
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full opacity-30" style={{ background: "radial-gradient(closest-side,#FFFFFF,transparent)" }} aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-8 h-56 w-56 rounded-full opacity-20" style={{ background: "radial-gradient(closest-side,#0EA5E9,transparent)" }} aria-hidden="true" />

        <div className="relative p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Total balance</p>
              <p className="font-tabular mt-1 text-4xl font-bold tracking-tight sm:text-5xl">{stats.totalBalance}</p>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {accounts.length} acct
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/20 pt-4 sm:grid-cols-2">
            <BalanceStat icon={ArrowDownRight} label="Inflow · 30d" value={stats.deposits} />
            <BalanceStat icon={ArrowUpRight} label="Outflow · 30d" value={stats.withdrawals} />
          </div>
        </div>
      </div>

      {/* Circular actions: Send / Request / Transfer / More */}
      <div className="grid grid-cols-4 gap-5 sm:gap-6">
        <CircularAction icon={Send} label="Send" onClick={() => setDialog("mobile")} />
        <CircularAction icon={HandCoins} label="Request" disabled badge="Soon" />
        <CircularAction icon={ArrowLeftRight} label="Transfer" onClick={() => setDialog("transfer")} />
        <CircularAction icon={MoreHorizontal} label="More" href="/payments" />
      </div>

      {/* Recent activity as cards */}
      <div className="space-y-8">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">Recent Activity</h2>
            <Link to="/transactions" className="text-sm font-medium text-brand-primary hover:underline">See all</Link>
          </div>
          {txError ? (
            <Card><p className="px-4 py-4 text-sm text-danger">Could not load recent transactions.</p></Card>
          ) : transactions.length === 0 ? (
            <Card><EmptyState title="No transactions yet" description="Deposits and transfers will appear here." /></Card>
          ) : (
            <ul className="space-y-3">
              {transactions.slice(0, 5).map((tx) => {
                const isCredit = tx.transactionType === "DEPOSIT";
                const isOut = tx.transactionType === "WITHDRAWAL" || tx.transactionType === "FEE";
                return (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border-default bg-surface-primary px-4 py-3.5 transition-shadow hover:shadow-elevation-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                          isCredit ? "bg-success-subtle text-credit" : isOut ? "bg-danger-subtle text-debit" : "bg-info-subtle text-info",
                        )}
                      >
                        {isCredit ? <ArrowDownRight size={20} /> : isOut ? <ArrowUpRight size={20} /> : <ArrowLeftRight size={20} />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {tx.description ?? tx.transactionType.charAt(0) + tx.transactionType.slice(1).toLowerCase()}
                        </p>
                        <p className="text-xs text-text-tertiary">{formatRelativeTime(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span className={cn("font-tabular shrink-0 text-lg font-semibold", isCredit ? "text-credit" : "text-text-primary")}>
                      {isCredit ? "+" : "−"}
                      {formatCurrency(tx.amountCents / 100, tx.currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Cards & Currencies */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">Cards &amp; Currencies</h2>
          <Link to="/cards" className="text-sm font-medium text-brand-primary hover:underline">Manage</Link>
        </div>
        {cards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 2).map((card) => (
              <CardCard key={card.id} card={card} />
            ))}
          </div>
        )}
        {currencies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {currencies.map((c) => (
              <span key={c} className="rounded-full border border-border-default bg-surface-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
                {c}
              </span>
            ))}
          </div>
        )}
        {cards.length === 0 && currencies.length === 0 && accounts.length === 0 && (
          <Card><EmptyState title="No accounts or cards yet" description="Submit a request and an administrator will set them up." action={<Link to="/requests" className="text-sm font-medium text-brand-primary hover:underline">Request an account</Link>} /></Card>
        )}
      </section>

      {/* Your accounts (compact) */}
      {accounts.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">Accounts</h2>
            <Link to="/accounts" className="text-sm font-medium text-brand-primary hover:underline">View all</Link>
          </div>
          <ul className="space-y-3">
            {accounts.slice(0, 4).map((account) => (
              <li key={account.id}>
                <Link
                  to={`/accounts/${account.id}`}
                  className="flex items-center justify-between rounded-2xl border border-border-default bg-surface-primary px-4 py-3.5 transition-shadow hover:shadow-elevation-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
                      <Wallet size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{account.nickname ?? account.accountType}</p>
                      <p className="text-xs text-text-tertiary">•••• {account.accountNumber.slice(-4)}</p>
                    </div>
                  </div>
                  <span className="font-tabular shrink-0 text-sm font-bold text-text-primary">
                    {formatCurrency(account.availableBalanceCents / 100, account.currency)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Savings summary */}
      {goals.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Savings</h2>
            <Link to="/savings" className="text-sm font-medium text-brand-primary hover:underline">{goals.length} goals</Link>
          </div>
          <p className="font-tabular mt-1 text-2xl font-bold text-text-primary">{formatCurrency(totalSavingsCents / 100)}</p>
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
        </Card>
      )}

      <WithdrawalDialog open={dialog === "withdraw"} accounts={accounts} onClose={() => setDialog(null)} />
      <TransferDialog open={dialog === "transfer"} accounts={accounts} onClose={() => setDialog(null)} />
      <MobilePaymentDialog open={dialog === "mobile"} accounts={accounts} onClose={() => setDialog(null)} defaultAccountId={primaryAccount?.id ?? null} />
    </div>
  );
}

function BalanceStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/95">
      <Icon size={16} />
      <span>{label}</span>
      <span className="font-tabular font-semibold">{value}</span>
    </div>
  );
}

function CircularAction({
  icon: Icon,
  label,
  onClick,
  href,
  disabled,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  badge?: string;
}) {
  const circle = (
    <span
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full shadow-elevation-md",
        disabled ? "bg-bg-tertiary text-text-tertiary" : "bg-white text-brand-primary",
      )}
    >
      <Icon size={28} />
    </span>
  );
  const labelNode = (
    <span className="flex items-center gap-1 text-sm font-medium text-text-primary">
      {label}
      {badge && <span className="rounded-full bg-warning-subtle px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-warning">{badge}</span>}
    </span>
  );
  if (href && !disabled) {
    return (
      <Link to={href} className="group flex flex-col items-center gap-2 text-center">
        {circle}
        {labelNode}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cn("group flex flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed", disabled ? "opacity-60" : "hover:scale-105 transition-transform")}>
      {circle}
      {labelNode}
    </button>
  );
}