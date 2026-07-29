import { useState } from "react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { useAdminAuditLogs } from "../hooks";
import { AuditLogRow } from "../components";

export function AdminAuditLogsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error, refetch } = useAdminAuditLogs({ page, size: 20 });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="Review all admin actions" />
        <ErrorState
          title="Failed to load audit logs"
          description="Could not retrieve audit log data."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="Review all admin actions" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="tableRow" className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  const logs = data?.content ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" subtitle="Review all admin actions" />

      {logs.length === 0 ? (
        <EmptyState
          title="No audit logs"
          description="No admin actions have been recorded yet."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-active/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Target Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Target ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Admin User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <AuditLogRow key={log.id} log={log} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-tertiary">
              Page {page + 1} of {data?.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                isDisabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                isDisabled={(data?.totalPages ?? 1) <= page + 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
