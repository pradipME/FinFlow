import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldCheck,
  Plus,
  ArrowLeftRight,
  LayoutGrid,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks";
import { useTransactions } from "@/features/transactions/hooks";
import { useUnreadNotificationCount } from "@/features/notifications/hooks";
import { Card, CardHeader, AreaChart, DonutChart, Sparkline, EmptyState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { formatCurrency, formatRelativeTime } from "@/shared/lib/format";
import { cn } from "@/shared/utils";

// ── Derived-data helpers (pure computations, no fake data) ────────

function isWithinDays(iso: string, days: number): boolean {
  const then = new Date(iso).getTime();
  return Date.now() - then <= days * 24 * 60 * 60 * 1000;
}

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildNetFlowSeries(transactions: { createdAt: string; transactionType: string; amountCents: number }[]) {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (!isWithinDays(t.createdAt, 30)) continue;
    const key = dayKey(t.createdAt);
    const delta =
      t.transactionType === "DEPOSIT"
        ? t.amountCents
        : t.transactionType === "WITHDRAWAL" || t.transactionType === "FEE"
          ? -t.amountCents
          : 0;
    map.set(key, (map.get(key) ?? 0) + delta);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value: Math.round(value / 100) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ── Small building blocks ─────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  positive,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  positive?: boolean;
}): React.ReactNode {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-tertiary">{label}</p>
          <p className="font-tabular mt-1.5 text-2xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary">
          <Icon size={18} />
        </span>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-credit" : trendUp ? "text-danger" : "text-text-tertiary",
            )}
          >
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </span>
          <span className="text-xs text-text-tertiary">vs previous 30 days</span>
        </div>
      )}
    </Card>
  );
}

function QuickAction({ label, href, icon: Icon }: { label: string; href: string; icon: LucideIcon }): React.ReactNode {
  return (
    <Link
      to={href}
      className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-surface-secondary/60 px-3 py-3 text-text-secondary transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:text-text-primary"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-tertiary text-brand-primary">
        <Icon size={18} />
      </span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────

export function DashboardPage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts({ page: 0, size: 50 });
  const { data: txData, isLoading: txLoading } = useTransactions({ page: 0, size: 200 });
  const { data: unreadCount } = useUnreadNotificationCount();
  const prefersReduced = useReducedMotion();

  const accounts = useMemo(() => (accountsData?.content ?? []).filter((a) => a.accountStatus === "ACTIVE"), [accountsData]);
  const transactions = useMemo(() => txData?.content ?? [], [txData]);

  const stats = useMemo(() => {
    const totalBalanceCents = accounts.reduce((sum, a) => sum + a.availableBalanceCents, 0);
    const thirtyDays = transactions.filter((t) => isWithinDays(t.createdAt, 30));
    const deposits = thirtyDays.filter((t) => t.transactionType === "DEPOSIT");
    const withdrawals = thirtyDays.filter((t) => t.transactionType === "WITHDRAWAL" || t.transactionType === "FEE");
    const depositsCents = deposits.reduce((s, t) => s + t.amountCents, 0);
    const withdrawalsCents = withdrawals.reduce((s, t) => s + t.amountCents, 0);

    const netCents = depositsCents - withdrawalsCents;
    const netPct = withdrawalsCents > 0 ? Math.round((netCents / withdrawalsCents) * 100) : 0;

    return {
      totalBalance: formatCurrency(totalBalanceCents / 100),
      deposits: formatCurrency(depositsCents / 100),
      withdrawals: formatCurrency(withdrawalsCents / 100),
      net: formatCurrency(netCents / 100),
      netPct,
      netFlow: buildNetFlowSeries(transactions),
      netCents,
    };
  }, [accounts, transactions]);

  const spendByType = useMemo(() => {
    const totals = new Map<string, { label: string; value: number }>();
    const labels: Record<string, string> = {
      WITHDRAWAL: "Withdrawals",
      FEE: "Fees",
      TRANSFER: "Transfers",
      REVERSAL: "Reversals",
    };
    for (const t of transactions) {
      if (t.transactionType === "DEPOSIT" || t.transactionType === "REVERSAL") continue;
      const current = totals.get(t.transactionType)?.value ?? 0;
      totals.set(t.transactionType, { label: labels[t.transactionType] ?? t.transactionType, value: current + t.amountCents });
    }
    return Array.from(totals.values())
      .map((d) => ({ ...d, value: Math.round(d.value / 100) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  if (accountsLoading && txLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        actions={
          <div className="flex gap-2">
            <Link
              to="/transactions"
              className="inline-flex h-10 items-center gap-2 rounded-button border border-border-default bg-bg-tertiary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
            >
              <ArrowLeftRight size={16} /> New transaction
            </Link>
            <Link
              to="/accounts"
              className="inline-flex h-10 items-center gap-2 rounded-button bg-brand-primary px-4 text-sm font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
            >
              <Plus size={16} /> New account
            </Link>
          </div>
        }
      />

      {/* Hero: net position */}
      <motion.section
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border-default"
        style={{
          background:
            "linear-gradient(135deg, #0C1219 0%, #0A0F16 55%, #0E1A22 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30"
            style={{ background: "radial-gradient(closest-side, var(--ff-color-primary, #2fd6a3), transparent)" }}
          />
          <div
            className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(closest-side, var(--ff-chart-3, #38bdf8), transparent)" }}
          />
        </div>

        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-tertiary/60 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-credit opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-credit" />
              </span>
              <span className="text-xs font-medium text-text-secondary">Live — balances reflect in real time</span>
            </div>

            <p className="text-sm font-medium text-text-secondary">Total net position</p>
            <p className="font-tabular mt-1 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              {stats.totalBalance}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm">
                <span className={cn("font-medium", stats.netCents >= 0 ? "text-credit" : "text-debit")}>
                  {stats.netCents >= 0 ? "+" : ""}
                  {stats.net}
                </span>
                <span className="text-text-tertiary">net · 30 days</span>
              </span>
              <span className="text-xs text-text-tertiary">
                <span className="font-mono">{accounts.length}</span> active account{accounts.length === 1 ? "" : "s"}
              </span>
            </div>

            {stats.netFlow.length > 2 ? (
              <div className="mt-6 max-w-md">
                <Sparkline data={stats.netFlow} width={440} height={56} />
              </div>
            ) : (
              <p className="mt-6 text-sm text-text-tertiary">
                Not enough transaction history to chart yet.
              </p>
            )}
          </div>

          {/* FinFlow Intelligence */}
          <div className="rounded-xl border border-border-subtle bg-surface-secondary/50 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-3 text-bg-primary">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary">FinFlow Intelligence</p>
                <p className="text-xs text-text-tertiary">Automated daily brief</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-credit" />
                <span className="text-text-secondary">
                  Your accounts are <span className="font-medium text-text-primary">fully active</span> and operating normally.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Activity size={16} className="mt-0.5 shrink-0 text-info" />
                <span className="text-text-secondary">
                  {unreadCount === 0
                    ? "All caught up — no unread notifications."
                    : `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"} waiting.`}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowUpRight size={16} className={cn("mt-0.5 shrink-0", stats.netCents >= 0 ? "text-credit" : "text-debit")} />
                <span className="text-text-secondary">
                  Net cash flow {stats.netCents >= 0 ? "is positive" : "is negative"} at{" "}
                  <span className="font-mono font-medium text-text-primary">{stats.netPct >= 0 ? "+" : ""}{stats.netPct}%</span>{" "}
                  of outflows this period.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total balance"
          value={stats.totalBalance}
          icon={Wallet}
          trend={`${stats.netPct > 0 ? "+" : ""}${stats.netPct}%`}
          trendUp={stats.netPct > 0}
          positive={stats.netPct >= 0}
        />
        <StatCard
          label="Inflow · 30 days"
          value={stats.deposits}
          icon={ArrowDownRight}
          trend="from deposits"
        />
        <StatCard
          label="Outflow · 30 days"
          value={stats.withdrawals}
          icon={ArrowUpRight}
          trend="withdrawals + fees"
        />
        <StatCard label="Active accounts" value={`${accounts.length}`} icon={LayoutGrid} />
      </div>

      {/* Charts + recent activity */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Net cash flow"
            subtitle="Deposits minus withdrawals, last 30 days"
          />
          <div className="px-2">
            {stats.netFlow.length > 2 ? (
              <AreaChart data={stats.netFlow} height={240} />
            ) : (
              <EmptyState title="No cash flow yet" description="Your net flow will appear once you have transaction history." />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Spend breakdown" subtitle="By transaction type" />
          {spendByType.length > 0 ? (
            <DonutChart data={spendByType} centerValue={stats.withdrawals} centerLabel="30-day outflow" />
          ) : (
            <EmptyState title="No spending yet" description="Withdrawals and fees will show up here." />
          )}
        </Card>
      </div>

      {/* Quick actions + recent transactions */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <CardHeader title="Quick actions" />
          <div className="grid grid-cols-3 gap-3">
            <QuickAction label="Transfer" href="/transfers" icon={ArrowLeftRight} />
            <QuickAction label="Accounts" href="/accounts" icon={Wallet} />
            <QuickAction label="Savings" href="/budgets" icon={Plus} />
          </div>
          {accounts.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-text-primary">Your accounts</p>
              <div className="space-y-2">
                {accounts.slice(0, 4).map((account) => (
                  <Link
                    key={account.id}
                    to={`/accounts/${account.id}`}
                    className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-secondary px-3 py-2.5 transition-colors hover:border-border-strong"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-tertiary text-brand-primary">
                        <Wallet size={15} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {account.nickname ?? account.accountNumber}
                        </p>
                        <p className="font-mono text-[11px] text-text-tertiary">{account.accountNumber}</p>
                      </div>
                    </div>
                    <span className="font-tabular text-sm font-semibold text-text-primary">
                      {formatCurrency(account.availableBalanceCents / 100, account.currency)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

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
      </div>
    </div>
  );
}