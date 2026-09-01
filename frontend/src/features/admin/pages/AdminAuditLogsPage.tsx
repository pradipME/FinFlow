import { useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
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
  const totalPages = data?.totalPages ?? 0;

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
          <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-primary">
            <header className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-brand-primary" />
                <h2 className="text-sm font-semibold text-text-primary">Admin activity</h2>
              </div>
              <span className="rounded-full bg-surface-active px-2.5 py-1 text-xs font-medium text-text-secondary">
                Page {page + 1} of {Math.max(totalPages, 1)}
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-active/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Target Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Target ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Admin User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {logs.map((log) => (
                    <AuditLogRow key={log.id} log={log} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-text-tertiary">
              {logs.length} log{logs.length === 1 ? "" : "s"} on this page
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft size={15} />}
                isDisabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ChevronRight size={15} />}
                isDisabled={totalPages <= page + 1}
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