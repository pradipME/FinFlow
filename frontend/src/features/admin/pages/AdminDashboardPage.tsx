import { Users, CreditCard, ArrowUpDown, Activity } from "lucide-react";
import { PageHeader } from "@/shared/layout";
import { ErrorState, Skeleton } from "@/shared/components";
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
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and statistics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={data?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Accounts" value={data?.totalAccounts ?? 0} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Total Transactions" value={data?.totalTransactions ?? 0} icon={<ArrowUpDown className="h-5 w-5" />} />
        <StatCard title="Recent Activity" value={data?.recentActivity ?? 0} icon={<Activity className="h-5 w-5" />} />
      </div>
    </div>
  );
}
