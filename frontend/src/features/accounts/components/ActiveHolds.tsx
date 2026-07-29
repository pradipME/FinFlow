import type { Hold } from "../types";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import { Badge } from "@/shared/components";

interface ActiveHoldsProps {
  holds: Hold[];
  onRelease?: (holdId: string) => void;
  isReleasing?: boolean;
}

export function ActiveHolds({ holds, onRelease, isReleasing }: ActiveHoldsProps) {
  if (holds.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">No active holds.</p>
    );
  }

  return (
    <div className="space-y-3">
      {holds.map((hold) => (
        <div
          key={hold.id}
          className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-secondary p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">{hold.reason}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="financial" financialStatus="held" size="sm">
                {formatCurrency(hold.amountCents / 100)}
              </Badge>
              {hold.sourceType && (
                <span className="text-xs text-text-tertiary">
                  {hold.sourceType}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-text-tertiary">
              Placed {formatDate(hold.createdAt)}
              {hold.expiresAt && ` · Expires ${formatDate(hold.expiresAt)}`}
            </p>
          </div>
          {onRelease && (
            <button
              type="button"
              onClick={() => onRelease(hold.id)}
              disabled={isReleasing}
              className="ml-4 shrink-0 rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
            >
              Release
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
