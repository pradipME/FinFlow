import { formatCurrency, formatDate } from "@/shared/lib/format";
import { SavingsGoalStatusBadge } from "./SavingsGoalStatusBadge";
import type { SavingsGoal } from "../types";
import { PiggyBank } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onClick?: () => void;
}

export function SavingsGoalCard({ goal, onClick }: SavingsGoalCardProps): React.ReactNode {
  const reduced = useReducedMotion();
  const progress = Math.min(100, Math.max(0, goal.progressPercent));
  const complete = progress >= 100;

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-card border border-border-default bg-surface-primary p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevation-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary transition-colors">
          <PiggyBank size={16} />
        </span>
        <SavingsGoalStatusBadge status={goal.goalStatus} />
      </div>
      <h3 className="mt-3 truncate text-base font-semibold tracking-tight text-text-primary">
        {goal.goalName}
      </h3>

      <p className="font-tabular mt-2 text-2xl font-bold tracking-tight text-text-primary">
        {formatCurrency(goal.currentAmountCents / 100, goal.currency)}
        <span className="text-sm font-medium text-text-tertiary">
          {" "}/ {formatCurrency(goal.targetAmountCents / 100, goal.currency)}
        </span>
      </p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-bg-tertiary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-chart-1 to-chart-3"
          initial={{ width: reduced ? `${progress}%` : 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-text-secondary">
          <span className={complete ? "font-semibold text-credit" : "font-semibold text-brand-primary"}>
            {progress.toFixed(0)}%
          </span>{" "}
          complete
        </span>
        {goal.deadline && (
          <span className="text-text-tertiary">by {formatDate(goal.deadline)}</span>
        )}
      </div>
    </button>
  );
}