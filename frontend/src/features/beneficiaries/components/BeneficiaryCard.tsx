import { User, Trash2, Edit, Landmark } from "lucide-react";
import type { Beneficiary } from "../types";
import { BeneficiaryStatusBadge } from "./BeneficiaryStatusBadge";

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (id: string) => void;
}

function hashAccent(input: string): { bg: string; text: string } {
  const colors = [
    { bg: "bg-brand-primary-subtle", text: "text-brand-primary" },
    { bg: "bg-info-subtle", text: "text-chart-3" },
    { bg: "bg-warning-subtle", text: "text-chart-4" },
    { bg: "bg-danger-subtle", text: "text-danger" },
  ];
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function BeneficiaryCard({ beneficiary, onEdit, onDelete }: BeneficiaryCardProps) {
  const accent = hashAccent(beneficiary.id);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-default bg-surface-primary p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-elevation-md">
      <div
        className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-primary via-chart-3 to-transparent opacity-60`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg}`}>
            <User className={`h-5 w-5 ${accent.text}`} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {beneficiary.nickname ?? beneficiary.beneficiaryName}
            </p>
            {beneficiary.nickname && (
              <p className="truncate text-xs text-text-tertiary">{beneficiary.beneficiaryName}</p>
            )}
          </div>
        </div>
        <BeneficiaryStatusBadge status={beneficiary.beneficiaryStatus} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="rounded-md bg-bg-tertiary px-2 py-1 font-mono text-xs text-text-primary">
            {beneficiary.accountNumber}
          </span>
          {beneficiary.bankName && (
            <span className="flex items-center gap-1 text-xs text-text-tertiary">
              <Landmark size={12} />
              {beneficiary.bankName}
            </span>
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
          className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-brand-primary/40 hover:bg-brand-primary-subtle hover:text-brand-primary"
        >
          <Edit size={13} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(beneficiary.id)}
          className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:border-danger/40 hover:bg-danger-subtle"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}