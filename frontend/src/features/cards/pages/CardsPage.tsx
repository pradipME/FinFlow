import { Link } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState, ErrorState, Skeleton, Button } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { CardCard } from "../components";
import { useCards, useFreezeCard, useUnfreezeCard, useBlockCard } from "../hooks";
import { useAccounts } from "@/features/accounts/hooks";
import { Snowflake, Sun, Ban, Plus } from "lucide-react";
import type { CardSummary } from "../types";

export function CardsPage() {
  const { data, isLoading, error } = useCards();
  const { data: accountsData } = useAccounts();

  const freezeCard = useFreezeCard();
  const unfreezeCard = useUnfreezeCard();
  const blockCard = useBlockCard();

  const accountLabelById = new Map(
    (accountsData?.content ?? []).map((a) => [
      a.id,
      `${a.nickname ?? a.accountNumber} · ${a.currency}`,
    ]),
  );

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
        title="Cards"
        subtitle="Manage your debit and credit cards"
        actions={
          <Link to="/requests">
            <Button>
              <Plus size={16} /> Request Card
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="Failed to load cards" />
      ) : (data?.content ?? []).length === 0 ? (
        <EmptyState
          title="No cards yet"
          description="Submit a card request and an administrator will issue one linked to your account."
          action={
            <Link to="/requests">
              <Button>
                <Plus size={16} /> Request Card
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.content ?? []).map((c) => (
            <CardActions
              key={c.id}
              card={c}
              accountLabel={accountLabelById.get(c.accountId)}
              onFreeze={freezeCard.mutateAsync}
              onUnfreeze={unfreezeCard.mutateAsync}
              onBlock={blockCard.mutateAsync}
              runAction={runAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardActions({
  card,
  accountLabel,
  onFreeze,
  onUnfreeze,
  onBlock,
  runAction,
}: {
  card: CardSummary;
  accountLabel?: string;
  onFreeze: (id: string) => Promise<unknown>;
  onUnfreeze: (id: string) => Promise<unknown>;
  onBlock: (id: string) => Promise<unknown>;
  runAction: (action: () => Promise<unknown>, msg: string) => Promise<void>;
}) {
  const active = card.cardStatus === "ACTIVE";
  const frozen = card.cardStatus === "FROZEN";

  return (
    <div className="flex flex-col gap-3">
      <CardCard card={card} accountLabel={accountLabel} />
      <div className="flex items-center gap-2">
        {active && (
          <Button size="sm" variant="neutral" onClick={() => runAction(() => onFreeze(card.id), "Card frozen")}>
            <Snowflake size={14} /> Freeze
          </Button>
        )}
        {frozen && (
          <Button size="sm" variant="neutral" onClick={() => runAction(() => onUnfreeze(card.id), "Card unfrozen")}>
            <Sun size={14} /> Unfreeze
          </Button>
        )}
        {!["BLOCKED"].includes(card.cardStatus) && (
          <Button size="sm" variant="neutral" onClick={() => runAction(() => onBlock(card.id), "Card blocked")}>
            <Ban size={14} /> Block
          </Button>
        )}
      </div>
    </div>
  );
}