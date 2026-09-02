import { useState } from "react";
import { toast } from "sonner";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { TemplateCard } from "../components";
import { useTemplates, useDeleteTemplate } from "../hooks";
import { useBeneficiaries } from "@/features/beneficiaries/hooks";
import { CreateTemplateDialog } from "./CreateTemplateDialog";
import { useAccounts } from "@/features/accounts/hooks";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { TransferTemplate } from "../types";
import { toErrorMessage } from "@/shared/lib";

export function TransfersPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<TransferTemplate | null>(null);
  const { data, isLoading, error } = useTemplates();
  const { data: accountsData } = useAccounts();
  const { data: beneficiariesData } = useBeneficiaries();
  const deleteTemplate = useDeleteTemplate();

  const accountById = new Map(
    (accountsData?.content ?? []).map((a) => [a.id, `${a.nickname ?? a.accountNumber} (${a.currency})`]),
  );
  const beneficiaryById = new Map(
    (beneficiariesData?.content ?? []).map((b) => [
      b.id,
      `${b.nickname ?? b.beneficiaryName} (${b.currency})`,
    ]),
  );

  function targetLabel(t: TransferTemplate): string | undefined {
    if (t.targetBeneficiaryId) return `To ${beneficiaryById.get(t.targetBeneficiaryId) ?? "Beneficiary"}`;
    if (t.targetAccountId) return `To ${accountById.get(t.targetAccountId) ?? "Account"}`;
    return undefined;
  }

  async function handleDelete(t: TransferTemplate) {
    if (!window.confirm(`Delete the "${t.templateName}" template? This cannot be undone.`)) return;
    try {
      await deleteTemplate.mutateAsync(t.id);
      toast.success("Template deleted");
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Transfers" subtitle="Manage transfer templates and scheduled transfers" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="Transfers" subtitle="Manage transfer templates and scheduled transfers" />
        <ErrorState description="Failed to load transfers" />
      </div>
    );
  }

  const templates = data?.content ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Transfers"
        subtitle="Manage transfer templates and scheduled transfers"
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Template
          </Button>
        }
      />

      {templates.length === 0 ? (
        <EmptyState
          title="No transfer templates"
          description="Create a template to quickly repeat a transfer to another account or beneficiary."
          action={
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> New Template
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col gap-2">
              <TemplateCard
                template={t}
                sourceLabel={`From ${accountById.get(t.sourceAccountId) ?? "An account"}`}
                targetLabel={targetLabel(t)}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="neutral"
                  onClick={() => setEditing(t)}
                  className="flex-1"
                >
                  <Pencil size={14} /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="neutral"
                  onClick={() => handleDelete(t)}
                  className="flex-1"
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateTemplateDialog
          accounts={accountsData?.content ?? []}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editing && (
        <CreateTemplateDialog
          accounts={accountsData?.content ?? []}
          existing={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}