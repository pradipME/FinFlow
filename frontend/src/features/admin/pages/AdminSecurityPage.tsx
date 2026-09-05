import { Shield, ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { Card, CardBody } from "@/shared/components";
import { PageHeader } from "@/shared/layout";

export function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security"
        subtitle="Admin console security and access management"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardBody className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Admin access</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                Role-based access control enforced on all /api/v1/admin/** endpoints.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950">
              <Clock size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Audit logging</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                All admin actions are logged with timestamp, actor, and target.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950">
              <ShieldAlert size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Session management</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                JWT tokens with short expiry. Refresh tokens revoked on logout.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-text-tertiary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Bank Administration Console</p>
              <p className="text-xs text-text-tertiary">
                Access restricted to ADMIN and SUPER_ADMIN roles only. All actions are logged.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
