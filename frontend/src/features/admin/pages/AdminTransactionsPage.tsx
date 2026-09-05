import { ArrowUpDown } from "lucide-react";
import { Badge, Card, CardBody, EmptyState, ErrorState, Skeleton, Table, TBody, TD, TH, THead, TR } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { formatCurrency } from "@/shared/lib/format";
import { useAdminTransactions } from "../hooks";

function statusTone(status: string): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    default:
      return "neutral";
  }
}

export function AdminTransactionsPage() {
  const { data, isLoading, error, refetch } = useAdminTransactions();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Transaction Ledger" subtitle="All transactions across the platform" />
        <ErrorState title="Failed to load transactions" description="Could not retrieve transactions." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Transaction Ledger" subtitle="Platform-wide transaction history" />
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="tableRow" className="h-10" />
              ))}
            </div>
          ) : !data?.content?.length ? (
            <EmptyState icon={<ArrowUpDown size={40} />} title="No transactions" description="No transactions have been processed yet." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Reference</TH>
                  <TH>Type</TH>
                  <TH>Status</TH>
                  <TH>Amount</TH>
                  <TH>Source</TH>
                  <TH>Target</TH>
                </TR>
              </THead>
              <TBody>
                {data.content.map((tx) => (
                  <TR key={tx.id}>
                    <TD className="font-medium">{tx.referenceNumber ?? tx.id.slice(0, 8)}</TD>
                    <TD>{tx.transactionType}</TD>
                    <TD>
                      <Badge variant={statusTone(tx.transactionStatus)} shape="pill" size="sm">
                        {tx.transactionStatus}
                      </Badge>
                    </TD>
                    <TD className="font-medium">{formatCurrency(tx.amountCents / 100, tx.currency)}</TD>
                    <TD className="text-text-secondary">{tx.sourceAccountId?.slice(0, 8) ?? "—"}</TD>
                    <TD className="text-text-secondary">{tx.targetAccountId?.slice(0, 8) ?? "—"}</TD>
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