/**
 * Section — Vertical spacing block for content sections.
 *
 * §8.5: Section spacing = 48px desktop, 32px mobile.
 */
import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

interface SectionProps {
  /** Section heading (optional) */
  title?: string;
  /** Description below heading (optional) */
  description?: string;
  /** Section children */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

export function Section({ title, description, children, className }: SectionProps): ReactNode {
  return (
    <section className={cn("py-8 first:pt-0 last:pb-0", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
          {description && <p className="mt-1 text-sm text-text-tertiary">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
