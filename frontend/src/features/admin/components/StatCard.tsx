import type { ReactNode } from "react";

const TONES = [
  { chip: "bg-brand-primary-subtle", icon: "text-brand-primary" },
  { chip: "bg-info-subtle", icon: "text-chart-3" },
  { chip: "bg-warning-subtle", icon: "text-chart-4" },
  { chip: "bg-danger-subtle", icon: "text-danger" },
] as const;

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  tone?: number;
}

export function StatCard({ title, value, description, icon, tone = 0 }: StatCardProps) {
  const palette = TONES[tone % TONES.length];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-default bg-surface-primary p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-elevation-md">
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, var(--ff-brand-primary, #2fd6a3) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-2 font-tabular text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
          {description && <p className="mt-1 text-xs text-text-tertiary">{description}</p>}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${palette.chip} ${palette.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}