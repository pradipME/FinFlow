import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { Button, EmptyState, ErrorState, Input, Modal, PasswordInput, Skeleton } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { useAdminUsers, useCreateAdminCustomer } from "../hooks";
import type { AdminUserSummary } from "../types";
import { UserManagementRow } from "../components";

function CreateCustomerModal({ onClose }: { onClose: () => void }) {
  const create = useCreateAdminCustomer();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!email || !username || !phoneNumber || !password) {
      toast.warning("Email, username, phone and password are required.");
      return;
    }
    create.mutate(
      { email, username, phoneNumber, password },
      {
        onSuccess: () => {
          toast.success("Customer created");
          onClose();
        },
        onError: (e: unknown) => {
          const msg =
            e instanceof Error && e.message ? e.message : "Could not create customer";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Modal open onClose={onClose} title="Create customer">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@finflow.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Username</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="customer_01" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Phone</label>
          <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+2348012345678" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Initial password</label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="8+ chars, upper/lower/digit/symbol"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} isLoading={create.isPending} isDisabled={create.isPending}>
            Create customer
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);
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

  const openCustomer = (user: AdminUserSummary) => {
    navigate(`${ROUTES.ADMIN}/users/${user.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage platform users"
        actions={
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => setCreating(true)}>
            Create customer
          </Button>
        }
      />
      {creating && <CreateCustomerModal onClose={() => setCreating(false)} />}

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
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Registered</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {users.map((user) => (
                    <UserManagementRow key={user.id} user={user} onView={openCustomer} />
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