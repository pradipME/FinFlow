import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

interface SettingRowProps {
  label: string;
  description?: string;
  control?: ReactNode;
  controlClassName?: string;
}

/**
 * SettingRow — shared label/description + control row for settings sections.
 * Two-column grid on desktop: flexible left track (`minmax(0, 1fr)`) and the
 * control sized to its own width on the right, so text never collapses into a
 * narrow column or overlaps the control. Stacks vertically on mobile with a
 * full-width control.
 */
export function SettingRow({
  label,
  description,
  control,
  controlClassName,
}: SettingRowProps) {
  return (
    <div className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>
        )}
      </div>
      {control && (
        <div className={cn("w-full min-w-0 sm:w-56", controlClassName)}>
          {control}
        </div>
      )}
    </div>
  );
}