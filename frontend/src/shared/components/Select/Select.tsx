import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  leftIcon?: ReactNode;
}

/**
 * Select — styled native select with consistent input chrome.
 * Keeps native accessibility/behavior; appearance is themed.
 */
export function Select({
  label,
  error,
  hint,
  options,
  leftIcon,
  className,
  id,
  ...rest
}: SelectProps): ReactNode {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {leftIcon}
          </span>
        )}
        <select
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none rounded-input border border-input-border bg-input-bg px-3 text-sm text-text-primary",
            "transition-colors duration-150 outline-none",
            "placeholder:text-input-placeholder",
            "focus:border-input-border-focus focus:ring-2 focus:ring-brand-primary/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-9",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-text-tertiary">{hint}</p>}
    </div>
  );
}