import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border-default bg-surface-primary",
        className,
      )}
    >
      <header className="flex items-center gap-3 border-b border-border-subtle px-6 py-5">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary-subtle text-brand-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>}
        </div>
      </header>
      <div className="divide-y divide-border-subtle px-6">{children}</div>
    </section>
  );
}