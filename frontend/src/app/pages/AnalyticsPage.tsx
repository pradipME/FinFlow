import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Scale, Wallet } from "lucide-react";
import { Card, CardHeader, AreaChart, BarChart, DonutChart, EmptyState, Skeleton, Tabs } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { useTransactions } from "@/features/transactions/hooks";
import { useAccounts } from "@/features/accounts/hooks";
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/utils";

type Period = "7d" | "30d" | "all";

const PERIOD_DAYS: Record<Period, number | null> = { "7d": 7, "30d": 30, all: null };

function isWithinDays(iso: string, days: number | null): boolean {
  if (days === null) return true;
  return Date.now() - new Date(iso).getTime() <= days * 24 * 60 * 60 * 1000;
}

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function monthKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

interface DerivedTxn {
  createdAt: string;
  transactionType: string;
  amountCents: number;
  currency: string;
}

function useAnalytics(transactions: DerivedTxn[], period: Period) {
  return useMemo(() => {
    const days = PERIOD_DAYS[period];
    const filtered = transactions.filter((t) => isWithinDays(t.createdAt, days));

    const inflow = filtered.filter((t) => t.transactionType === "DEPOSIT" || t.transactionType === "REVERSAL");
    const outflow = filtered.filter((t) => t.transactionType === "WITHDRAWAL" || t.transactionType === "FEE");
    const inflowCents = inflow.reduce((s, t) => s + t.amountCents, 0);
    const outflowCents = outflow.reduce((s, t) => s + t.amountCents, 0);

    // Daily deposits vs withdrawals — stacked comparison
    const daily = new Map<string, { deposits: number; withdrawals: number }>();
    for (const t of filtered) {
      const key = dayKey(t.createdAt);
      const row = daily.get(key) ?? { deposits: 0, withdrawals: 0 };
      if (t.transactionType === "DEPOSIT" || t.transactionType === "REVERSAL") row.deposits += Math.round(t.amountCents / 100);
      if (t.transactionType === "WITHDRAWAL" || t.transactionType === "FEE") row.withdrawals += Math.round(t.amountCents / 100);
      daily.set(key, row);
    }
    const dailySeries = Array.from(daily.entries())
      .map(([label, v]) => ({ label, deposits: v.deposits, withdrawals: v.withdrawals, net: v.deposits - v.withdrawals }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Monthly net flow
    const monthly = new Map<string, number>();
    for (const t of filtered) {
      const key = monthKey(t.createdAt);
      const delta =
        t.transactionType === "DEPOSIT" || t.transactionType === "REVERSAL"
          ? t.amountCents
          : t.transactionType === "WITHDRAWAL" || t.transactionType === "FEE"
            ? -t.amountCents
            : 0;
      monthly.set(key, (monthly.get(key) ?? 0) + delta);
    }
    const monthlySeries = Array.from(monthly.entries())
      .map(([label, value]) => ({ label, value: Math.round(value / 100) }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Spend by type
    const spend = new Map<string, { label: string; value: number }>();
    const labels: Record<string, string> = {
      WITHDRAWAL: "Withdrawals",
      FEE: "Fees",
      TRANSFER: "Transfers",
    };
    for (const t of outflow) {
      const row = spend.get(t.transactionType) ?? { label: labels[t.transactionType] ?? t.transactionType, value: 0 };
      row.value += Math.round(t.amountCents / 100);
      spend.set(t.transactionType, row);
    }
    const spendByType = Array.from(spend.values()).sort((a, b) => b.value - a.value).slice(0, 6);

    // Portfolio distribution by account type
    return {
      filteredCount: filtered.length,
      inflow: formatCurrency(inflowCents / 100),
      outflow: formatCurrency(outflowCents / 100),
      net: formatCurrency((inflowCents - outflowCents) / 100),
      netPositive: inflowCents - outflowCents >= 0,
      dailySeries: dailySeries.slice(0, 30),
      depositsSeries: dailySeries.map((d) => ({ label: d.label, value: d.deposits })),
      withdrawalsSeries: dailySeries.map((d) => ({ label: d.label, value: d.withdrawals })),
      monthlySeries,
      spendByType,
    };
  }, [transactions, period]);
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data: txData, isLoading, error } = useTransactions({ page: 0, size: 1000 });
  const { data: accountsData } = useAccounts({ page: 0, size: 200 });

  const transactions = useMemo(() => txData?.content ?? [], [txData]);
  const stats = useAnalytics(transactions, period);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" subtitle="Understand your money movement" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Real insights built from your transaction history"
        actions={
          <Tabs
            variant="pill"
            defaultValue={period}
            onChange={(v) => setPeriod(v as Period)}
            tabs={[
              { value: "7d", label: "7 days" },
              { value: "30d", label: "30 days" },
              { value: "all", label: "All time" },
            ]}
          />
        }
      />

      {error ? (
        <Card>
          <EmptyState title="Couldn't load analytics" description="We couldn't fetch your transaction data." />
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-subtle text-credit">
                <ArrowDownRight size={20} />
              </span>
              <div>
                <p className="text-sm text-text-tertiary">Inflow</p>
                <p className="font-tabular text-2xl font-bold tracking-tight text-text-primary">{stats.inflow}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger-subtle text-debit">
                <ArrowUpRight size={20} />
              </span>
              <div>
                <p className="text-sm text-text-tertiary">Outflow</p>
                <p className="font-tabular text-2xl font-bold tracking-tight text-text-primary">{stats.outflow}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", stats.netPositive ? "bg-brand-primary-subtle text-brand-primary" : "bg-warning-subtle text-pending")}>
                <Scale size={20} />
              </span>
              <div>
                <p className="text-sm text-text-tertiary">Net flow</p>
                <p className="font-tabular text-2xl font-bold tracking-tight text-text-primary">{stats.net}</p>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader title="Daily deposits vs withdrawals" subtitle={`Up to the last 30 days · ${stats.filteredCount} transactions analyzed`} />
              {stats.depositsSeries.length > 2 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-center text-xs font-medium text-credit">Deposits</p>
                    <BarChart data={stats.depositsSeries.slice(-15)} height={180} color="var(--ff-chart-1, #34d399)" />
                  </div>
                  <div>
                    <p className="mb-2 text-center text-xs font-medium text-debit">Withdrawals</p>
                    <BarChart data={stats.withdrawalsSeries.slice(-15)} height={180} color="var(--ff-chart-5, #fb7185)" />
                  </div>
                </div>
              ) : (
                <EmptyState title="Not enough data" description="More transactions will unlock your daily comparison chart." />
              )}
            </Card>

            <Card className="overflow-hidden">
              <CardHeader title="Spend by type" subtitle="Where your outflow goes" />
              {stats.spendByType.length > 0 ? (
                <DonutChart data={stats.spendByType} centerValue={stats.outflow} centerLabel="Total outflow" />
              ) : (
                <EmptyState title="No outflow yet" description="Withdrawals and fees will appear here." />
              )}
            </Card>

            <Card className="overflow-hidden">
              <CardHeader title="Monthly net flow" subtitle="Deposits minus withdrawals, bucketed by month" />
              {stats.monthlySeries.length > 1 ? (
                <AreaChart data={stats.monthlySeries} height={240} />
              ) : (
                <EmptyState title="Not enough history" description="Collect a couple of months of activity to see trends." />
              )}
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader title="Accounts breakdown" subtitle="Active accounts in your portfolio" />
              <div>
                {accountsData?.content && accountsData.content.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-primary-subtle text-brand-primary">
                      <Wallet size={24} />
                    </span>
                    <div>
                      <p className="font-tabular text-2xl font-bold tracking-tight text-text-primary">
                        {formatCurrency(
                          accountsData.content.reduce((s, a) => s + (a.accountStatus === "ACTIVE" ? a.availableBalanceCents : 0), 0) / 100,
                        )}
                      </p>
                      <p className="text-sm text-text-tertiary">
                        Total balance across {accountsData.content.filter((a) => a.accountStatus === "ACTIVE").length} active account(s)
                      </p>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No accounts" description="Open an account to see your portfolio value." />
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}