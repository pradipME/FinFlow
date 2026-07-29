import { User, Trash2, Edit } from "lucide-react";
import type { Beneficiary } from "../types";
import { BeneficiaryStatusBadge } from "./BeneficiaryStatusBadge";

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (id: string) => void;
}

export function BeneficiaryCard({ beneficiary, onEdit, onDelete }: BeneficiaryCardProps) {
  return (
    <div className="rounded-xl border border-border-default bg-surface-primary p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-subtle">
            <User className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {beneficiary.nickname ?? beneficiary.beneficiaryName}
            </p>
            {beneficiary.nickname && (
              <p className="text-xs text-text-tertiary">{beneficiary.beneficiaryName}</p>
            )}
          </div>
        </div>
        <BeneficiaryStatusBadge status={beneficiary.beneficiaryStatus} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-mono text-xs">{beneficiary.accountNumber}</span>
          {beneficiary.bankName && (
            <span className="text-text-tertiary">· {beneficiary.bankName}</span>
          )}
        </div>
        {beneficiary.email && (
          <p className="text-xs text-text-tertiary">{beneficiary.email}</p>
        )}
        {beneficiary.routingNumber && (
          <p className="text-xs text-text-tertiary">Routing: {beneficiary.routingNumber}</p>
        )}
      </div>

      <div className="mt-4 flex gap-2 border-t border-border-subtle pt-3">
        <button
          type="button"
          onClick={() => onEdit(beneficiary)}
          className="flex items-center gap-1 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover"
        >
          <Edit className="h-3 w-3" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(beneficiary.id)}
          className="flex items-center gap-1 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger-subtle"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
