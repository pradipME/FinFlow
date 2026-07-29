/**
 * Breadcrumbs — Hierarchical navigation trail.
 *
 * Renders as a list of links with "/" separators.
 * The last item is the current page (not a link).
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils";
import type { BreadcrumbItem } from "../../types";

interface BreadcrumbsProps {
  /** Breadcrumb items (last item = current page) */
  items: BreadcrumbItem[];
  /** Additional class names */
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps): ReactNode {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight size={14} className="text-text-tertiary" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span className="font-medium text-text-secondary" aria-current="page">
                  {item.icon && <item.icon size={14} className="mr-1 inline-block" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-text-tertiary transition-colors hover:text-text-primary"
                >
                  {item.icon && <item.icon size={14} className="mr-1 inline-block" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
