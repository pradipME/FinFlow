import { formatDate } from "@/shared/lib/format";
import { Badge } from "@/shared/components";
import type { StatusHistoryEntry } from "../types";

interface StatusHistoryProps {
  entries: StatusHistoryEntry[];
}

export function StatusHistory({ entries }: StatusHistoryProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-text-tertiary">No status changes recorded.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-3 rounded-lg border border-border-subtle p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {entry.previousStatus && (
                <>
                  <Badge variant="neutral" size="sm">{entry.previousStatus}</Badge>
                  <span className="text-text-tertiary">&rarr;</span>
                </>
              )}
              <Badge variant="primary" size="sm">{entry.newStatus}</Badge>
            </div>
            {entry.reason && (
              <p className="mt-1 text-xs text-text-tertiary">{entry.reason}</p>
            )}
            <p className="mt-1 text-xs text-text-tertiary">
              {formatDate(entry.changedAt)} by {entry.changedBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
