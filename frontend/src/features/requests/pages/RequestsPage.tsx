import { useState } from "react";
import { toast } from "sonner";
import { ClipboardList, Plus } from "lucide-react";
import { Badge, Button, Card, CardBody, EmptyState, ErrorState, Input, Modal, Select, Skeleton, Table, TBody, TD, TH, THead, TR } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { useAccounts } from "@/features/accounts/hooks";
import { useCreateRequest, useMyRequests } from "../hooks";

function statusTone(status: string): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "danger";
    default:
      return "neutral";
  }
}

function NewRequestModal({ onClose }: { onClose: () => void }) {
  const create = useCreateRequest();
  const { data: accountsData } = useAccounts();
  const accounts = accountsData?.content ?? [];

  const [type, setType] = useState<"ACCOUNT_REQUEST" | "CARD_REQUEST">("ACCOUNT_REQUEST");
  const [accountType, setAccountType] = useState("SAVINGS");
  const [nickname, setNickname] = useState("");
  const [targetAccountId, setTargetAccountId] = useState(accounts[0]?.id ?? "");
  const [cardType, setCardType] = useState("DEBIT");
  const [cardholderName, setCardholderName] = useState("");

  const submit = () => {
    if (type === "CARD_REQUEST" && !targetAccountId) {
      toast.warning("Select an account for the card.");
      return;
    }
    if (type === "CARD_REQUEST" && !cardholderName.trim()) {
      toast.warning("Enter the cardholder name.");
      return;
    }
    create.mutate(
      {
        requestType: type,
        targetAccountId: type === "CARD_REQUEST" ? targetAccountId : undefined,
        details:
          type === "ACCOUNT_REQUEST"
            ? { accountType, nickname: nickname || null, currency: "USD" }
            : { cardType, cardholderName, currency: "USD" },
      },
      {
        onSuccess: () => {
          toast.success(type === "ACCOUNT_REQUEST" ? "Account request submitted" : "Card request submitted");
          onClose();
        },
        onError: () => toast.error("Could not submit the request."),
      },
    );
  };

  return (
    <Modal open onClose={onClose} title="New request">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Request type</label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as "ACCOUNT_REQUEST" | "CARD_REQUEST")}
            options={[
              { value: "ACCOUNT_REQUEST", label: "New bank account" },
              { value: "CARD_REQUEST", label: "New card" },
            ]}
          />
        </div>

        {type === "ACCOUNT_REQUEST" ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Account type</label>
              <Select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                options={[
                  { value: "CHECKING", label: "Checking" },
                  { value: "SAVINGS", label: "Savings" },
                  { value: "CREDIT", label: "Credit" },
                  { value: "INVESTMENT", label: "Investment" },
                ]}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Nickname (optional)</label>
              <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="My Savings" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Card type</label>
              <Select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                options={[
                  { value: "DEBIT", label: "Debit" },
                  { value: "CREDIT", label: "Credit" },
                  { value: "PREPAID", label: "Prepaid" },
                ]}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Cardholder name</label>
              <Input value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Linked account</label>
              <Select
                value={targetAccountId}
                onChange={(e) => setTargetAccountId(e.target.value)}
                options={accounts.map((acc) => ({
                  value: acc.id,
                  label: `${acc.nickname ?? acc.accountType} · ${acc.accountNumber}`,
                }))}
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} isLoading={create.isPending} isDisabled={create.isPending}>
            Submit request
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function RequestsPage() {
  const [creating, setCreating] = useState(false);
  const { data, isLoading, error, refetch } = useMyRequests();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests"
        subtitle="Request a new account or card — an administrator will review it"
        actions={
          <Button onClick={() => setCreating(true)} leftIcon={<Plus size={16} />}>
            New request
          </Button>
        }
      />
      {creating && <NewRequestModal onClose={() => setCreating(false)} />}

      <Card>
        <CardBody>
          {error ? (
            <ErrorState title="Failed to load requests" description="Could not retrieve your requests." onRetry={refetch} />
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="tableRow" className="h-10" />
              ))}
            </div>
          ) : !data?.content?.length ? (
            <EmptyState icon={<ClipboardList size={40} />} title="No requests" description="You haven't submitted any requests yet." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Type</TH>
                  <TH>Status</TH>
                  <TH>Details</TH>
                  <TH>Submitted</TH>
                </TR>
              </THead>
              <TBody>
                {data.content.map((req) => (
                  <TR key={req.id}>
                    <TD>
                      <Badge variant="info" shape="pill" size="sm">
                        {req.requestType === "ACCOUNT_REQUEST" ? "Account" : "Card"}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge variant={statusTone(req.requestStatus)} shape="pill" size="sm">
                        {req.requestStatus}
                      </Badge>
                    </TD>
                    <TD className="text-text-secondary">
                      {req.requestStatus === "REJECTED" && req.rejectionReason
                        ? req.rejectionReason
                        : req.requestType === "ACCOUNT_REQUEST"
                          ? String(req.details?.accountType ?? "Account")
                          : `${String(req.details?.cardType ?? "Card")}`}
                    </TD>
                    <TD className="text-text-secondary">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—"}</TD>
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