import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { Button, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { useTransaction, useCancelTransaction } from "../hooks";
import { TransactionStatusBadge } from "../components";
import { TransactionEntryList } from "../components";
import { toast } from "sonner";

const TYPE_LABELS: Record<string, string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER: "Transfer",
  FEE: "Fee",
  REVERSAL: "Reversal",
};

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: txn, isLoading, error, refetch } = useTransaction(id!);
  const cancelTransaction = useCancelTransaction();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transaction Details" />
        <ErrorState title="Failed to load transaction" onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !txn) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transaction Details" />
        <Skeleton variant="card" className="h-48" />
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  async function handleCancel() {
    if (!txn) return;
    try {
      await cancelTransaction.mutateAsync(txn.id);
      toast.success("Transaction cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={TYPE_LABELS[txn.transactionType] ?? txn.transactionType}
        subtitle={txn.referenceNumber ?? "Transaction details"}
        actions={
          <div className="flex items-center gap-3">
            {txn.transactionStatus === "PENDING" && (
              <Button
                variant="danger"
                leftIcon={<X className="h-4 w-4" />}
                onClick={handleCancel}
                isLoading={cancelTransaction.isPending}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="neutral"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.TRANSACTIONS)}
            >
              Back
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border-default bg-surface-primary p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-secondary">Amount</p>
                <p className="mt-1 text-3xl font-bold text-text-primary">
                  {formatCurrency(txn.amountCents / 100, txn.currency)}
                </p>
                {txn.feeAmountCents > 0 && (
                  <p className="mt-1 text-sm text-text-tertiary">
                    Fee: {formatCurrency(txn.feeAmountCents / 100, txn.currency)}
                  </p>
                )}
              </div>
              <TransactionStatusBadge status={txn.transactionStatus} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-surface-secondary p-3">
                <p className="text-xs text-text-tertiary">Description</p>
                <p className="text-sm font-medium text-text-primary">
                  {txn.description ?? "—"}
                </p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-3">
                <p className="text-xs text-text-tertiary">Reference</p>
                <p className="text-sm font-medium text-text-primary">
                  {txn.referenceNumber ?? "—"}
                </p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-3">
                <p className="text-xs text-text-tertiary">Created</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(txn.createdAt)}
                </p>
              </div>
              {txn.completedAt && (
                <div className="rounded-lg bg-surface-secondary p-3">
                  <p className="text-xs text-text-tertiary">Completed</p>
                  <p className="text-sm font-medium text-text-primary">
                    {formatDate(txn.completedAt)}
                  </p>
                </div>
              )}
              {txn.failedReason && (
                <div className="col-span-2 rounded-lg bg-danger-subtle p-3">
                  <p className="text-xs text-danger">Failed Reason</p>
                  <p className="text-sm font-medium text-danger">{txn.failedReason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border-default bg-surface-primary p-6">
            <h3 className="text-sm font-semibold text-text-primary">Entries</h3>
            <div className="mt-4">
              <TransactionEntryList entries={txn.entries} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border-default bg-surface-primary p-6">
            <h3 className="text-sm font-semibold text-text-primary">Details</h3>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between">
                <dt className="text-xs text-text-tertiary">Type</dt>
                <dd className="text-sm text-text-primary">
                  {TYPE_LABELS[txn.transactionType]}
                </dd>
              </div>
              {txn.sourceAccountId && (
                <div className="flex justify-between">
                  <dt className="text-xs text-text-tertiary">Source Account</dt>
                  <dd className="text-sm text-text-primary font-mono">
                    {txn.sourceAccountId.slice(0, 8)}...
                  </dd>
                </div>
              )}
              {txn.targetAccountId && (
                <div className="flex justify-between">
                  <dt className="text-xs text-text-tertiary">Target Account</dt>
                  <dd className="text-sm text-text-primary font-mono">
                    {txn.targetAccountId.slice(0, 8)}...
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
