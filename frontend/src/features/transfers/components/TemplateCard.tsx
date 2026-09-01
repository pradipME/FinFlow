import { formatCurrency, formatDate } from "@/shared/lib/format";
import { TransferStatusBadge } from "./TransferStatusBadge";
import type { TransferTemplate } from "../types";
import { Repeat, FileText } from "lucide-react";

interface TemplateCardProps {
  template: TransferTemplate;
  onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps): React.ReactNode {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-card border border-border-default bg-surface-primary p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevation-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary">
          <FileText size={16} />
        </span>
        <TransferStatusBadge status={template.templateStatus} />
      </div>
      <h3 className="mt-3 truncate text-base font-semibold tracking-tight text-text-primary">
        {template.templateName}
      </h3>
      <p className="font-tabular mt-2 text-2xl font-bold tracking-tight text-text-primary">
        {formatCurrency(template.amountCents / 100, template.currency)}
      </p>
      {template.description && (
        <p className="mt-1 line-clamp-2 text-xs text-text-tertiary">{template.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-text-tertiary">
        <span>Created {formatDate(template.createdAt)}</span>
        <Repeat size={14} className="text-text-disabled" />
      </div>
    </button>
  );
}