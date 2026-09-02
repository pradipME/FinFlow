import { useMemo, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Skeleton, Tabs } from "@/shared/components";
import { useAccounts } from "../hooks";
import { AccountCard, AccountsTable } from "../components";
import { CreateAccountModal } from "./CreateAccountModal";
import { formatCurrency } from "@/shared/lib/format";

export function AccountsPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data, isLoading, error, refetch } = useAccounts({ page: 0, size: 50 });

  const summary = useMemo(() => {
    const accounts = data?.content ?? [];
    const active = accounts.filter((a) => a.accountStatus === "ACTIVE");
    const totalCents = active.reduce((sum, a) => sum + a.availableBalanceCents, 0);
    return {
      count: active.length,
      total: formatCurrency(Math.abs(totalCents) / 100),
    };
  }, [data]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Accounts" subtitle="Manage your bank accounts" />
        <ErrorState title="Failed to load accounts" onRetry={refetch} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Accounts" subtitle="Manage your bank accounts" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-52" />
          ))}
        </div>
      </div>
    );
  }

  const accounts = data?.content ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="Manage your bank accounts"
        actions={
          <div className="flex items-center gap-3">
            <Tabs
              variant="pill"
              defaultValue={view}
              onChange={(v) => setView(v as "grid" | "table")}
              tabs={[
                { value: "grid", label: "Grid" },
                { value: "table", label: "Table" },
              ]}
            />
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
              New Account
            </Button>
          </div>
        }
      />

      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border-default bg-gradient-to-r from-bg-secondary to-bg-tertiary px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-subtle text-brand-primary">
            <Wallet size={20} />
          </span>
          <div>
            <p className="text-xs text-text-tertiary">Total available across active accounts</p>
            <p className="font-tabular text-xl font-bold tracking-tight text-text-primary">{summary.total}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-text-secondary">
          <span className="rounded-full bg-bg-tertiary px-3 py-1 text-xs font-medium">
            {summary.count} active
          </span>
        </div>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          description="Create your first account to get started."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
              Create Account
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} accounts={accounts} />
          ))}
        </div>
      ) : (
        <AccountsTable accounts={accounts} />
      )}

      <CreateAccountModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}