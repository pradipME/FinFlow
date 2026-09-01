import { Users, CreditCard, ArrowUpDown, Activity } from "lucide-react";
import { Badge, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { useAdminDashboard } from "../hooks";
import { StatCard } from "../components";

export function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAdminDashboard();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" subtitle="Platform overview and statistics" />
        <ErrorState
          title="Failed to load dashboard"
          description="Could not retrieve dashboard statistics."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" subtitle="Platform overview and statistics" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and statistics"
        actions={
          <Badge variant="success" shape="pill" size="sm" showDot>
            Systems operational
          </Badge>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data?.totalUsers ?? 0}
          icon={<Users size={20} />}
          tone={0}
        />
        <StatCard
          title="Total Accounts"
          value={data?.totalAccounts ?? 0}
          icon={<CreditCard size={20} />}
          tone={1}
        />
        <StatCard
          title="Total Transactions"
          value={data?.totalTransactions ?? 0}
          icon={<ArrowUpDown size={20} />}
          tone={2}
        />
        <StatCard
          title="Recent Activity"
          value={data?.recentActivity ?? 0}
          description="Events in the current period"
          icon={<Activity size={20} />}
          tone={3}
        />
      </div>
    </div>
  );
}