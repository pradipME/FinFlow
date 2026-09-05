import { Users, UserCheck, CreditCard, Wallet, Clock, ArrowUpDown, LifeBuoy, Receipt, AlertCircle } from "lucide-react";
import { Badge, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout";
import { ROUTES } from "@/shared/constants";
import { useAdminDashboard } from "../hooks";
import { StatCard } from "../components";

function formatFunds(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 13 }).map((_, i) => (
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Total Users" value={data?.totalUsers ?? 0} description="All registered users" icon={<Users size={20} />} tone={0} href={ROUTES.ADMIN_USERS} />
        <StatCard title="Active Users" value={data?.activeUsers ?? 0} description="Users with active accounts" icon={<UserCheck size={20} />} tone={1} href={ROUTES.ADMIN_USERS} />
        <StatCard title="Total Accounts" value={data?.totalAccounts ?? 0} description="All platform accounts" icon={<CreditCard size={20} />} tone={2} href={ROUTES.ADMIN_ACCOUNTS} />
        <StatCard title="Active Accounts" value={data?.activeAccounts ?? 0} description="Accounts in active status" icon={<CreditCard size={20} />} tone={3} href={ROUTES.ADMIN_ACCOUNTS} />
        <StatCard title="Total Cards" value={data?.totalCards ?? 0} description="Cards issued across the platform" icon={<CreditCard size={20} />} tone={0} href={ROUTES.ADMIN_CARDS} />
        <StatCard title="Active Cards" value={data?.activeCards ?? 0} description="Cards in active status" icon={<Wallet size={20} />} tone={1} href={ROUTES.ADMIN_CARDS} />
        <StatCard title="Total Funds" value={formatFunds(data?.totalFundsCents ?? 0)} description="Sum of all customer balances" icon={<ArrowUpDown size={20} />} tone={2} href={ROUTES.ADMIN_ACCOUNTS} />
        <StatCard title="Pending Account Requests" value={data?.pendingAccountRequests ?? 0} description="Account requests awaiting review" icon={<AlertCircle size={20} />} tone={3} href={`${ROUTES.ADMIN_REQUESTS}?type=ACCOUNT_REQUEST`} />
        <StatCard title="Pending Card Requests" value={data?.pendingCardRequests ?? 0} description="Card requests awaiting review" icon={<AlertCircle size={20} />} tone={4} href={`${ROUTES.ADMIN_REQUESTS}?type=CARD_REQUEST`} />
        <StatCard title="Pending Requests (Total)" value={data?.pendingRequests ?? 0} description="All pending requests" icon={<Clock size={20} />} tone={0} href={ROUTES.ADMIN_REQUESTS} />
        <StatCard title="Recent Customer Requests" value={data?.recentCustomerRequests ?? 0} description="New requests in the last 7 days" icon={<Receipt size={20} />} tone={1} href={ROUTES.ADMIN_REQUESTS} />
        <StatCard title="Total Transactions" value={data?.totalTransactions ?? 0} description="All transactions in the system" icon={<ArrowUpDown size={20} />} tone={2} href={ROUTES.ADMIN_TRANSACTIONS} />
        <StatCard title="Recent Transactions" value={data?.recentTransactions ?? 0} description="Transactions in the last 7 days" icon={<LifeBuoy size={20} />} tone={3} href={ROUTES.ADMIN_TRANSACTIONS} />
      </div>
    </div>
  );
}