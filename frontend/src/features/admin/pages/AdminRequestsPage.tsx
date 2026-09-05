import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import { Badge, Button, Card, CardBody, EmptyState, ErrorState, Skeleton, Table, TBody, TD, TH, THead, TR } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { useAdminRequests } from "../hooks";
import { useAdminReviewRequest } from "../hooks";

function statusTone(status: string): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "danger";
    default:
      return "neutral";
  }
}

export function AdminRequestsPage() {
  const review = useAdminReviewRequest();
  const { data, isLoading, error, refetch } = useAdminRequests({ status: "PENDING" });

  const approve = (id: string) => {
    review.mutate(
      { requestId: id, action: "approve" },
      {
        onSuccess: () => toast.success("Request approved"),
        onError: () => toast.error("Approval failed"),
      },
    );
  };

  const reject = (id: string) => {
    review.mutate(
      { requestId: id, action: "reject", rejectionReason: "Rejected by administrator" },
      {
        onSuccess: () => toast.success("Request rejected"),
        onError: () => toast.error("Rejection failed"),
      },
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Customer Requests" subtitle="Pending account and card requests" />
        <ErrorState title="Failed to load requests" description="Could not retrieve requests." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Requests" subtitle="Review account and card requests" />
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="tableRow" className="h-10" />
              ))}
            </div>
          ) : !data?.content?.length ? (
            <EmptyState icon={<ClipboardList size={40} />} title="No pending requests" description="There are no requests waiting for review." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Customer</TH>
                  <TH>Type</TH>
                  <TH>Status</TH>
                  <TH>Details</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {data.content.map((req) => (
                  <TR key={req.id}>
                    <TD className="text-text-secondary">{req.customerId.slice(0, 8)}</TD>
                    <TD>
                      <Badge variant="info" shape="pill" size="sm">
                        {req.requestType === "ACCOUNT_REQUEST" ? "Account" : "Card"}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge variant={statusTone(req.requestStatus)} shape="pill" size="sm">
                        {req.requestStatus}
                      </Badge>
                    </TD>
                    <TD className="max-w-xs truncate text-text-secondary">
                      {req.requestType === "ACCOUNT_REQUEST"
                        ? String(req.details?.accountType ?? "Account")
                        : `${String(req.details?.cardType ?? "Card")} · ${String(req.details?.cardholderName ?? "")}`}
                    </TD>
                    <TD>
                      {req.requestStatus === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="success" onClick={() => approve(req.id)} isLoading={review.isPending}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => reject(req.id)}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-text-tertiary">{req.rejectionReason ?? "Reviewed"}</span>
                      )}
                    </TD>
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