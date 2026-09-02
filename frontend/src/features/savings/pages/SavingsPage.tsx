import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, ErrorState, Skeleton, Button } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { SavingsGoalCard } from "../components";
import { useSavingsGoals, usePauseSavingsGoal, useResumeSavingsGoal, useCancelSavingsGoal } from "../hooks";
import { CreateGoalDialog } from "./CreateGoalDialog";
import { DepositGoalDialog } from "./DepositGoalDialog";
import { Plus, Pause, Play, ArrowDownCircle, XCircle } from "lucide-react";
import type { SavingsGoal } from "../types";

export function SavingsPage() {
  const { data, isLoading, error } = useSavingsGoals();
  const [createOpen, setCreateOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);

  const pauseGoal = usePauseSavingsGoal();
  const resumeGoal = useResumeSavingsGoal();
  const cancelGoal = useCancelSavingsGoal();

  async function runAction(action: () => Promise<unknown>, successMsg: string) {
    try {
      await action();
      toast.success(successMsg);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings"
        subtitle="Track and grow your savings goals"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> New Goal
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="Failed to load savings goals" />
      ) : (data?.content ?? []).length === 0 ? (
        <EmptyState
          title="No savings goals"
          description="Create a savings goal to start building toward something meaningful."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> New Goal
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.content ?? []).map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onDeposit={() => setDepositGoal(g)}
              runAction={runAction}
              onPause={pauseGoal.mutateAsync}
              onResume={resumeGoal.mutateAsync}
              onCancel={cancelGoal.mutateAsync}
            />
          ))}
        </div>
      )}

      <CreateGoalDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <DepositGoalDialog
        goalId={depositGoal?.id ?? null}
        currency={depositGoal?.currency ?? "USD"}
        open={depositGoal !== null}
        onClose={() => setDepositGoal(null)}
      />
    </div>
  );
}

function GoalCard({
  goal,
  onDeposit,
  onPause,
  onResume,
  onCancel,
  runAction,
}: {
  goal: SavingsGoal;
  onDeposit: () => void;
  onPause: (id: string) => Promise<unknown>;
  onResume: (id: string) => Promise<unknown>;
  onCancel: (id: string) => Promise<unknown>;
  runAction: (action: () => Promise<unknown>, msg: string) => Promise<void>;
}) {
  const active = goal.goalStatus === "ACTIVE";
  const paused = goal.goalStatus === "PAUSED";

  return (
    <div className="flex flex-col gap-3">
      <SavingsGoalCard goal={goal} />
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" onClick={onDeposit}>
          <ArrowDownCircle size={14} /> Add Money
        </Button>
        {active && (
          <Button size="sm" variant="neutral" onClick={() => runAction(() => onPause(goal.id), "Goal paused")}>
            <Pause size={14} /> Pause
          </Button>
        )}
        {paused && (
          <Button size="sm" variant="neutral" onClick={() => runAction(() => onResume(goal.id), "Goal resumed")}>
            <Play size={14} /> Resume
          </Button>
        )}
        {active && (
          <Button
            size="sm"
            variant="neutral"
            onClick={async () => {
              if (window.confirm(`Cancel the "${goal.goalName}" goal?`)) {
                await runAction(() => onCancel(goal.id), "Goal cancelled");
              }
            }}
          >
            <XCircle size={14} /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}