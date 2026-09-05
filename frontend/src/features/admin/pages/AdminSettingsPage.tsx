import { Settings, Bell, SlidersHorizontal } from "lucide-react";
import { Card, CardBody } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { AppearanceSection } from "@/features/settings/components";

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Admin console preferences"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardBody className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-active text-text-secondary">
              <SlidersHorizontal size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Console preferences</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                Dashboard density, default page size, and layout preferences.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-active text-text-secondary">
              <Bell size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Notifications</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                Email alerts for pending requests, suspicious activity, and system events.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-active text-text-secondary">
              <Settings size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">System configuration</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                Platform-wide settings managed by super administrators.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <AppearanceSection />

      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-text-tertiary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Bank Administration Console</p>
              <p className="text-xs text-text-tertiary">
                Settings specific to the admin console. User-level preferences are managed separately.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
