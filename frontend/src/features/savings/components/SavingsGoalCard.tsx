import { formatCurrency } from "@/shared/lib/format";
import { SavingsGoalStatusBadge } from "./SavingsGoalStatusBadge";
import type { SavingsGoal } from "../types";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onClick?: () => void;
}

export function SavingsGoalCard({ goal, onClick }: SavingsGoalCardProps) {
  const progress = Math.min(100, goal.progressPercent);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{goal.goalName}</h3>
        <SavingsGoalStatusBadge status={goal.goalStatus} />
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">
        {formatCurrency(goal.currentAmountCents, goal.currency)}
        <span className="text-sm font-normal text-gray-500">
          {" "}/ {formatCurrency(goal.targetAmountCents, goal.currency)}
        </span>
      </p>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">{progress.toFixed(0)}% complete</p>
      {goal.deadline && (
        <p className="mt-1 text-xs text-gray-400">Deadline: {goal.deadline}</p>
      )}
    </button>
  );
}
