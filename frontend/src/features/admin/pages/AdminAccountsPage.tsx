import { useState } from "react";
import { toast } from "sonner";
import { Banknote } from "lucide-react";
import { Badge, Button, Card, CardBody, EmptyState, ErrorState, Input, Modal, Skeleton, Table, TBody, TD, TH, THead, TR } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { formatCurrency } from "@/shared/lib/format";
import { useAdminAccounts } from "../hooks";
import { useAdminFundAccount } from "../hooks";

function statusTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "CLOSED":
    case "SUSPENDED":
      return "danger";
    case "RESTRICTED":
      return "warning";
    default:
      return "neutral";
  }
}

function FundModal({
  accountId,
  accountNumber,
  onClose,
}: {
  accountId: string;
  accountNumber: string;
  onClose: () => void;
}) {
  const fund = useAdminFundAccount();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents <= 0) {
      toast.warning("Enter a valid positive amount.");
      return;
    }
    fund.mutate(
      { accountId, payload: { amountCents: cents, description } },
      {
        onSuccess: () => {
          toast.success("Account funded");
          onClose();
        },
        onError: () => {
          toast.error("Funding failed");
        },
      },
    );
  };

  return (
    <Modal open onClose={onClose} title={`Fund ${accountNumber}`}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Amount</label>
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional note" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} isLoading={fund.isPending} isDisabled={fund.isPending}>
            Credit funds
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function AdminAccountsPage() {
  const [funding, setFunding] = useState<{ id: string; accountNumber: string } | null>(null);
  const { data, isLoading, error, refetch } = useAdminAccounts();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Account Management" subtitle="All bank accounts across the platform" />
        <ErrorState title="Failed to load accounts" description="Could not retrieve accounts." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Management"
        subtitle="View and fund customer accounts"
      />
      {funding && <FundModal accountId={funding.id} accountNumber={funding.accountNumber} onClose={() => setFunding(null)} />}

      <Card>
        <CardBody>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="tableRow" className="h-10" />
              ))}
            </div>
          ) : !data?.content?.length ? (
            <EmptyState icon={<Banknote size={40} />} title="No accounts" description="No accounts have been created yet." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Account</TH>
                  <TH>Owner</TH>
                  <TH>Type</TH>
                  <TH>Status</TH>
                  <TH>Available</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {data.content.map((acc) => (
                  <TR key={acc.id}>
                    <TD className="font-medium">{acc.accountNumber}</TD>
                    <TD className="text-text-secondary">{acc.ownerId.slice(0, 8)}</TD>
                    <TD>{acc.accountType}</TD>
                    <TD>
                      <Badge variant={statusTone(acc.accountStatus)} shape="pill" size="sm">
                        {acc.accountStatus}
                      </Badge>
                    </TD>
                    <TD className="font-medium">{formatCurrency(acc.availableBalanceCents / 100, acc.currency)}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setFunding({ id: acc.id, accountNumber: acc.accountNumber })}>
                          Fund
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}