/**
 * PageHeader — Reusable page title bar with breadcrumbs, title, and actions.
 *
 * Typically rendered at the top of each page inside Content.
 */
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";
import type { BreadcrumbItem } from "../../types";
import { Breadcrumbs } from "../Navigation/Breadcrumbs";

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons (rendered on the right) */
  actions?: ReactNode;
  /** Additional class names */
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps): ReactNode {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-tertiary">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
