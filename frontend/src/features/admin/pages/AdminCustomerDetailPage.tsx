import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Banknote, CreditCard } from "lucide-react";
import { Badge, Button, Card, CardBody, EmptyState, ErrorState, Skeleton, Table, Tabs, TBody, TD, TH, THead, TR } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { ROUTES } from "@/shared/constants";
import { formatDate } from "@/shared/lib/format";
import { useAdminUserCards, useAdminUserDetails } from "../hooks";

function statusTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "SUSPENDED":
    case "CLOSED":
    case "BLOCKED":
    case "CANCELLED":
      return "danger";
    case "RESTRICTED":
    case "FROZEN":
      return "warning";
    default:
      return "neutral";
  }
}

export function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"accounts" | "cards">("accounts");

  const { data: detail, isLoading, error, refetch } = useAdminUserDetails(id);
  const { data: cards } = useAdminUserCards(id, { page: 0, size: 50 });

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={15} />} onClick={() => navigate(`${ROUTES.ADMIN}/users`)}>
          Back to customers
        </Button>
        <ErrorState title="Failed to load customer" description="Could not retrieve customer details." onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !detail) {
    return (
      <div className="space-y-6">
        <PageHeader title="Customer details" subtitle="Loading customer…" />
        <Skeleton variant="card" className="h-40" />
        <Skeleton variant="card" className="h-72" />
      </div>
    );
  }

  const accountCards = cards?.content ?? [];

  const renderAccounts = () => (
    <Card>
      <CardBody>
        <EmptyState
          icon={<Banknote size={40} />}
          title="Accounts managed in admin console"
          description="Accounts for this customer can be viewed in the Account Management section."
        />
      </CardBody>
    </Card>
  );

  const renderCards = () =>
    accountCards.length === 0 ? (
      <Card>
        <CardBody>
          <EmptyState
            icon={<CreditCard size={40} />}
            title="No cards yet"
            description="This customer has no cards linked to their profile."
          />
        </CardBody>
      </Card>
    ) : (
      <Card>
        <CardBody>
          <Table>
            <THead>
              <TR>
                <TH>Card</TH>
                <TH>Holder</TH>
                <TH>Type</TH>
                <TH>Status</TH>
                <TH>Created</TH>
              </TR>
            </THead>
            <TBody>
              {accountCards.map((c) => (
                <TR key={c.id}>
                  <TD className="font-medium">•••• {c.cardLastFour}</TD>
                  <TD className="text-text-secondary">{c.cardholderName}</TD>
                  <TD>{c.cardType}</TD>
                  <TD>
                    <Badge variant={statusTone(c.cardStatus)} shape="pill" size="sm">
                      {c.cardStatus}
                    </Badge>
                  </TD>
                  <TD className="text-text-tertiary">{formatDate(c.createdAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardBody>
      </Card>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer details"
        subtitle={detail.email}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft size={15} />}
            onClick={() => navigate(`${ROUTES.ADMIN}/users`)}
          >
            Back to customers
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <p className="text-sm text-text-secondary">Account count</p>
            <p className="mt-1 font-tabular text-2xl font-bold text-text-primary">{detail.accountCount}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-text-secondary">Cards</p>
            <p className="mt-1 font-tabular text-2xl font-bold text-text-primary">{detail.cardCount}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-text-secondary">Pending requests</p>
            <p className="mt-1 font-tabular text-2xl font-bold text-text-primary">{detail.pendingRequestCount}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-text-secondary">Status</p>
            <div className="mt-2">
              <Badge variant={statusTone(detail.status)} shape="pill" size="sm" showDot>
                {detail.status}
              </Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as "accounts" | "cards")}
        tabs={[
          { value: "accounts", label: "Accounts" },
          { value: "cards", label: `Cards (${detail.cardCount})` },
        ]}
      />

      {tab === "accounts" ? renderAccounts() : renderCards()}
    </div>
  );
}