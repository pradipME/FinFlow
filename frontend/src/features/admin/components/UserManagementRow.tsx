import { formatDate } from "@/shared/lib/format";
import { Badge } from "@/shared/components";
import type { AdminUserSummary } from "../types";

interface UserManagementRowProps {
  user: AdminUserSummary;
}

export function UserManagementRow({ user }: UserManagementRowProps) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-active/50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-text-primary">{user.fullName}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{user.role}</td>
      <td className="px-4 py-3">
        <Badge
          variant={user.status === "ACTIVE" ? "success" : user.status === "SUSPENDED" ? "danger" : "secondary"}
          size="sm"
        >
          {user.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-text-tertiary">{formatDate(user.createdAt)}</td>
    </tr>
  );
}
