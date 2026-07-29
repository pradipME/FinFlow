import { useAuth } from "@/features/auth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
      <p className="mt-2 text-text-secondary">
        Welcome back, {user?.username ?? "User"}!
      </p>
      <p className="mt-4 text-sm text-text-tertiary">
        Dashboard content will be implemented in future stories.
      </p>
    </div>
  );
}