import { formatDate } from "@/shared/lib/format";
import { Badge } from "@/shared/components";
import type { AdminAuditLog } from "../types";

interface AuditLogRowProps {
  log: AdminAuditLog;
}

export function AuditLogRow({ log }: AuditLogRowProps) {
  return (
    <tr className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-active/50">
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-text-primary">{log.action}</span>
      </td>
      <td className="px-4 py-3">
        <Badge variant="neutral" size="sm" shape="pill">
          {log.targetType}
        </Badge>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-text-secondary">{log.targetId}</td>
      <td className="px-4 py-3 font-mono text-xs text-text-tertiary">{log.adminUserId}</td>
      <td className="px-4 py-3 text-xs text-text-tertiary">{formatDate(log.createdAt)}</td>
    </tr>
  );
}