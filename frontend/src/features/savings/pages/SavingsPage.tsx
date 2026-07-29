import { EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { SavingsGoalCard } from "../components";
import { useSavingsGoals } from "../hooks";

export function SavingsPage() {
  const { data, isLoading, error } = useSavingsGoals();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Savings" subtitle="Track your savings goals" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="Savings" subtitle="Track your savings goals" />
        <ErrorState description="Failed to load savings goals" />
      </div>
    );
  }

  const goals = data?.content ?? [];

  return (
    <div className="space-y-4">
      <PageHeader title="Savings" subtitle="Track your savings goals" />

      {goals.length === 0 ? (
        <EmptyState
          title="No savings goals"
          description="Create a savings goal to start saving"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <SavingsGoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}
    </div>
  );
}
