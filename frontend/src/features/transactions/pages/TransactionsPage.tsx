import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { useTransactions as useTxnList } from "../hooks";
import { TransactionRow } from "../components";
import { TransactionFilters } from "../components";
import { DepositDialog } from "./DepositDialog";
import { WithdrawalDialog } from "./WithdrawalDialog";
import { TransferDialog } from "./TransferDialog";
import type { TransactionType, TransactionStatus } from "../types";

export function TransactionsPage() {
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const { data: accountsData } = useAccounts({ page: 0, size: 100 });
  const accounts = accountsData?.content ?? [];

  const { data, isLoading, error, refetch } = useTxnList({
    page,
    size: 20,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transactions" subtitle="View and manage your transactions" />
        <ErrorState title="Failed to load transactions" onRetry={refetch} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transactions" subtitle="View and manage your transactions" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="listItem" className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  const transactions = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="View and manage your transactions"
        actions={
          <div className="flex items-center gap-2">
            <Button leftIcon={<ArrowDownToLine className="h-4 w-4" />} onClick={() => setShowDeposit(true)}>
              Deposit
            </Button>
            <Button leftIcon={<ArrowUpFromLine className="h-4 w-4" />} variant="secondary" onClick={() => setShowWithdrawal(true)}>
              Withdraw
            </Button>
            <Button leftIcon={<ArrowRightLeft className="h-4 w-4" />} variant="secondary" onClick={() => setShowTransfer(true)}>
              Transfer
            </Button>
          </div>
        }
      />

      <TransactionFilters
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
      />

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions"
          description="No transactions found matching your filters."
        />
      ) : (
        <div className="space-y-2">
          {transactions.map((txn) => (
            <TransactionRow key={txn.id} transaction={txn} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-tertiary">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              isDisabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              isDisabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DepositDialog open={showDeposit} onClose={() => setShowDeposit(false)} accounts={accounts} />
      <WithdrawalDialog open={showWithdrawal} onClose={() => setShowWithdrawal(false)} accounts={accounts} />
      <TransferDialog open={showTransfer} onClose={() => setShowTransfer(false)} accounts={accounts} />
    </div>
  );
}
