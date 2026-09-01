import { formatDate } from "@/shared/lib/format";
import { Badge } from "@/shared/components";
import type { AdminUserSummary } from "../types";

interface UserManagementRowProps {
  user: AdminUserSummary;
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0)?.toUpperCase()).join("") || "?";
}

export function UserManagementRow({ user }: UserManagementRowProps) {
  return (
    <tr className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-active/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-xs font-semibold text-brand-primary">
            {getInitials(user.fullName ?? user.email)}
          </span>
          <span className="text-sm font-medium text-text-primary">{user.fullName || "\u2014"}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
      <td className="px-4 py-3">
        <Badge variant="outline" size="sm" shape="pill">
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={user.status === "ACTIVE" ? "success" : user.status === "SUSPENDED" ? "danger" : "neutral"}
          size="sm"
          showDot
        >
          {user.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs text-text-tertiary">{formatDate(user.createdAt)}</td>
    </tr>
  );
}