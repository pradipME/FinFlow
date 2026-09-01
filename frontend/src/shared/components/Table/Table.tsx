import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ className, children, ...rest }: TableProps): ReactNode {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>): ReactNode {
  return (
    <thead className={cn("border-b border-border-default", className)} {...rest}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>): ReactNode {
  return (
    <tbody className={cn("divide-y divide-border-subtle", className)} {...rest}>
      {children}
    </tbody>
  );
}

export function TR({ className, children, ...rest }: HTMLAttributes<HTMLTableRowElement>): ReactNode {
  return (
    <tr className={cn("transition-colors hover:bg-bg-secondary", className)} {...rest}>
      {children}
    </tr>
  );
}

export function TH({ className, children, ...rest }: ThHTMLAttributes<HTMLTableCellElement>): ReactNode {
  return (
    <th
      className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary", className)}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TD({ className, children, ...rest }: TdHTMLAttributes<HTMLTableCellElement>): ReactNode {
  return (
    <td className={cn("px-4 py-3 align-middle text-text-secondary", className)} {...rest}>
      {children}
    </td>
  );
}