import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
}

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border-default bg-surface-primary p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-text-tertiary">{description}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-surface-active p-2 text-text-secondary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
