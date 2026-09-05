import { CreditCard } from "lucide-react";
import { Badge, Card, CardBody, EmptyState, ErrorState, Skeleton, Table, TBody, TD, TH, THead, TR } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { useAdminCards } from "../hooks";

function statusTone(status: string): "success" | "warning" | "danger" | "neutral" | "info" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "BLOCKED":
    case "CANCELLED":
      return "danger";
    case "FROZEN":
      return "info";
    default:
      return "neutral";
  }
}

export function AdminCardsPage() {
  const { data, isLoading, error, refetch } = useAdminCards();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Card Management" subtitle="All cards issued across the platform" />
        <ErrorState title="Failed to load cards" description="Could not retrieve cards." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Card Management" subtitle="Monitor issued cards" />
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="tableRow" className="h-10" />
              ))}
            </div>
          ) : !data?.content?.length ? (
            <EmptyState icon={<CreditCard size={40} />} title="No cards" description="No cards have been issued yet." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Card</TH>
                  <TH>Type</TH>
                  <TH>Status</TH>
                  <TH>Cardholder</TH>
                  <TH>Linked account</TH>
                </TR>
              </THead>
              <TBody>
                {data.content.map((card) => (
                  <TR key={card.id}>
                    <TD className="font-medium">•••• {card.cardLastFour}</TD>
                    <TD>{card.cardType}</TD>
                    <TD>
                      <Badge variant={statusTone(card.cardStatus)} shape="pill" size="sm">
                        {card.cardStatus}
                      </Badge>
                    </TD>
                    <TD>{card.cardholderName}</TD>
                    <TD className="text-text-secondary">{card.accountId.slice(0, 8)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}