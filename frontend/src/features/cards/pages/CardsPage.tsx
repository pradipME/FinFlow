import { EmptyState, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { CardCard } from "../components";
import { useCards } from "../hooks";

export function CardsPage() {
  const { data, isLoading, error } = useCards();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Cards" subtitle="Manage your debit and credit cards" />
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
        <PageHeader title="Cards" subtitle="Manage your debit and credit cards" />
        <ErrorState description="Failed to load cards" />
      </div>
    );
  }

  const cards = data?.content ?? [];

  return (
    <div className="space-y-4">
      <PageHeader title="Cards" subtitle="Manage your debit and credit cards" />

      {cards.length === 0 ? (
        <EmptyState
          title="No cards"
          description="You don't have any cards yet"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <CardCard key={c.id} card={c} />
          ))}
        </div>
      )}
    </div>
  );
}
