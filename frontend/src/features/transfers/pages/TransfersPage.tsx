import { useState } from "react";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { TemplateCard } from "../components";
import { useTemplates } from "../hooks";
import { CreateTemplateDialog } from "./CreateTemplateDialog";
import { useAccounts } from "@/features/accounts/hooks";

export function TransfersPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading, error } = useTemplates();
  const { data: accountsData } = useAccounts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Transfers" subtitle="Manage transfer templates and scheduled transfers" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
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
          <Button onClick={() => setShowCreate(true)}>New Template</Button>
        }
      />

      {templates.length === 0 ? (
        <EmptyState
          title="No transfer templates"
          description="Create a template to quickly repeat transfers"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateTemplateDialog
          accounts={accountsData?.content ?? []}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
