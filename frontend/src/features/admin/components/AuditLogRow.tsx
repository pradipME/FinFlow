import { formatDate } from "@/shared/lib/format";
import type { AdminAuditLog } from "../types";

interface AuditLogRowProps {
  log: AdminAuditLog;
}

export function AuditLogRow({ log }: AuditLogRowProps) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-active/50 transition-colors">
      <td className="px-4 py-3 text-sm text-text-primary">{log.action}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{log.targetType}</td>
      <td className="px-4 py-3 text-sm text-text-secondary font-mono">{log.targetId}</td>
      <td className="px-4 py-3 text-sm text-text-tertiary">{log.adminUserId}</td>
      <td className="px-4 py-3 text-sm text-text-tertiary">{formatDate(log.createdAt)}</td>
    </tr>
  );
}
