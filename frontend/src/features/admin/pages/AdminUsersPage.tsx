import { useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { useAdminUsers } from "../hooks";
import { UserManagementRow } from "../components";

export function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error, refetch } = useAdminUsers({ page, size: 20 });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Management" subtitle="Manage platform users" />
        <ErrorState
          title="Failed to load users"
          description="Could not retrieve user data."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Management" subtitle="Manage platform users" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="tableRow" className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="Manage platform users" />

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No users are currently registered on the platform."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-primary">
            <header className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Users size={16} className="text-brand-primary" />
                <h2 className="text-sm font-semibold text-text-primary">Registered users</h2>
              </div>
              <span className="rounded-full bg-surface-active px-2.5 py-1 text-xs font-medium text-text-secondary">
                Page {page + 1} of {Math.max(totalPages, 1)}
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-active/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {users.map((user) => (
                    <UserManagementRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-text-tertiary">
              {users.length} user{users.length === 1 ? "" : "s"} on this page
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