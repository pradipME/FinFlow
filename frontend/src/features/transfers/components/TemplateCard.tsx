import { formatCurrency, formatDate } from "@/shared/lib/format";
import { TransferStatusBadge } from "./TransferStatusBadge";
import type { TransferTemplate } from "../types";

interface TemplateCardProps {
  template: TransferTemplate;
  onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{template.templateName}</h3>
        <TransferStatusBadge status={template.templateStatus} />
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">
        {formatCurrency(template.amountCents, template.currency)}
      </p>
      {template.description && (
        <p className="mt-1 text-xs text-gray-500">{template.description}</p>
      )}
      <p className="mt-2 text-xs text-gray-400">Created {formatDate(template.createdAt)}</p>
    </button>
  );
}
