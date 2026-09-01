import { useState, type ReactNode } from "react";
import { cn } from "@/shared/utils";
import { motion, useReducedMotion } from "framer-motion";

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "underline" | "pill" | "card";
  className?: string;
}

/**
 * Tabs — accessible segmented navigation with an animated indicator.
 * Uncontrolled by default; pass `value` + `onChange` to control.
 */
export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  className,
}: TabsProps): ReactNode {
  const reducedMotion = useReducedMotion();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.value);
  const active = (isControlled ? value : internalValue) ?? tabs[0]?.value;

  const select = (tabValue: string, disabled?: boolean): void => {
    if (disabled) return;
    if (!isControlled) setInternalValue(tabValue);
    onChange?.(tabValue);
  };

  const variantClasses = {
    underline:
      "flex gap-1 border-b border-border-subtle",
    pill: "flex gap-1 rounded-lg bg-bg-tertiary p-1 w-fit",
    card: "flex gap-1 border border-border-default rounded-lg bg-surface-primary p-1 w-fit",
  } as const;

  const triggerClasses = {
    underline:
      "relative -mb-px px-3 py-2 text-sm font-medium border-b-2 border-transparent",
    pill: "relative px-4 py-1.5 text-sm font-medium rounded-md",
    card: "relative px-4 py-1.5 text-sm font-medium rounded-md",
  } as const;

  return (
    <div>
      <div role="tablist" className={cn(variantClasses[variant], className)}>
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => select(tab.value, tab.disabled)}
              className={cn(
                triggerClasses[variant],
                "flex items-center gap-2 outline-none transition-colors duration-150",
                "focus-visible:ring-2 focus-visible:ring-brand-primary",
                variant === "pill" && "text-text-tertiary hover:text-text-primary",
                variant === "card" && "text-text-tertiary hover:text-text-primary",
                (variant === "pill" || variant === "card") && isActive && "bg-surface-primary text-text-primary shadow-elevation-sm",
                variant === "underline" &&
                  (isActive
                    ? "border-brand-primary text-text-primary"
                    : "border-transparent text-text-tertiary hover:text-text-primary"),
                tab.disabled && "pointer-events-none opacity-50",
              )}
            >
              {tab.icon}
              {tab.label}
              {variant === "underline" && isActive && (
                <motion.span
                  layoutId={`ff-tab-${variant}`}
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-primary"
                  transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4">{tabs.find((t) => t.value === active)?.content}</div>
    </div>
  );
}