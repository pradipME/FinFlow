import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { useAccounts } from "../hooks";
import { AccountCard, AccountsTable } from "../components";
import { CreateAccountModal } from "./CreateAccountModal";

export function AccountsPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data, isLoading, error, refetch } = useAccounts({ page: 0, size: 50 });

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
            <div className="flex rounded-lg border border-border-default">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "grid"
                    ? "bg-surface-active text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "table"
                    ? "bg-surface-active text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Table
              </button>
            </div>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              New Account
            </Button>
          </div>
        }
      />

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
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <AccountsTable accounts={accounts} />
      )}

      <CreateAccountModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
