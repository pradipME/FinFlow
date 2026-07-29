import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { useBeneficiaries } from "../hooks";
import { BeneficiaryCard } from "../components";
import { CreateBeneficiaryDialog } from "./CreateBeneficiaryDialog";
import type { Beneficiary } from "../types";

export function BeneficiariesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const { data, isLoading, error, refetch } = useBeneficiaries({ page: 0, size: 50 });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Beneficiaries" subtitle="Manage your saved beneficiaries" />
        <ErrorState title="Failed to load beneficiaries" onRetry={refetch} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Beneficiaries" subtitle="Manage your saved beneficiaries" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-52" />
          ))}
        </div>
      </div>
    );
  }

  const beneficiaries = data?.content ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Beneficiaries"
        subtitle="Manage your saved beneficiaries"
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateDialog(true)}>
            Add Beneficiary
          </Button>
        }
      />

      {beneficiaries.length === 0 ? (
        <EmptyState
          title="No beneficiaries"
          description="Add a beneficiary to send money quickly."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateDialog(true)}>
              Add Beneficiary
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beneficiaries.map((b) => (
            <BeneficiaryCard
              key={b.id}
              beneficiary={b}
              onEdit={setEditingBeneficiary}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <CreateBeneficiaryDialog
        open={showCreateDialog || !!editingBeneficiary}
        onClose={() => { setShowCreateDialog(false); setEditingBeneficiary(null); }}
        beneficiary={editingBeneficiary}
      />
    </div>
  );
}
