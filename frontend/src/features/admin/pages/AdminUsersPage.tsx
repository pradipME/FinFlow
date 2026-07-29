import { useState } from "react";
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
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-active/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserManagementRow key={user.id} user={user} />
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
