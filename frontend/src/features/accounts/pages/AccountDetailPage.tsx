import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield, Clock } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { Button, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { useAccount, useStatusHistory, useReleaseHold } from "../hooks";
import { AccountStatusBadge } from "../components";
import { ActiveHolds } from "../components";
import { StatusHistory } from "./StatusHistory";

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: "Checking",
  SAVINGS: "Savings",
  CREDIT_CARD: "Credit Card",
};

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: account, isLoading, error, refetch } = useAccount(id!);
  const { data: history } = useStatusHistory(id!);
  const releaseHold = useReleaseHold(id!);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Account Details" />
        <ErrorState title="Failed to load account" onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !account) {
    return (
      <div className="space-y-6">
        <PageHeader title="Account Details" />
        <Skeleton variant="card" className="h-48" />
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={account.nickname ?? "Account Details"}
        subtitle={`${ACCOUNT_TYPE_LABELS[account.accountType] ?? account.accountType} · ${account.accountNumber}`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.ACCOUNTS)}
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
                <p className="text-sm font-medium text-text-secondary">Available Balance</p>
                <p className="mt-1 text-3xl font-bold text-text-primary">
                  {formatCurrency(account.availableBalanceCents / 100, account.currency)}
                </p>
                {account.ledgerBalanceCents !== account.availableBalanceCents && (
                  <p className="mt-1 text-sm text-text-tertiary">
                    Ledger: {formatCurrency(account.ledgerBalanceCents / 100, account.currency)}
                  </p>
                )}
              </div>
              <AccountStatusBadge status={account.accountStatus} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-3">
                <CreditCard className="h-5 w-5 text-text-tertiary" />
                <div>
                  <p className="text-xs text-text-tertiary">Account Number</p>
                  <p className="text-sm font-medium text-text-primary">{account.accountNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-3">
                <Shield className="h-5 w-5 text-text-tertiary" />
                <div>
                  <p className="text-xs text-text-tertiary">Currency</p>
                  <p className="text-sm font-medium text-text-primary">{account.currency}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-3">
                <Clock className="h-5 w-5 text-text-tertiary" />
                <div>
                  <p className="text-xs text-text-tertiary">Opened</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(account.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-secondary p-3">
                <Clock className="h-5 w-5 text-text-tertiary" />
                <div>
                  <p className="text-xs text-text-tertiary">Last Updated</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(account.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-default bg-surface-primary p-6">
            <h3 className="text-sm font-semibold text-text-primary">Active Holds</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              {account.activeHoldCount} hold{account.activeHoldCount !== 1 ? "s" : ""}
            </p>
            <div className="mt-4">
              <ActiveHolds
                holds={account.activeHolds}
                onRelease={(holdId) => releaseHold.mutate(holdId)}
                isReleasing={releaseHold.isPending}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {history && (
            <div className="rounded-xl border border-border-default bg-surface-primary p-6">
              <h3 className="text-sm font-semibold text-text-primary">Status History</h3>
              <div className="mt-4">
                <StatusHistory entries={history} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
