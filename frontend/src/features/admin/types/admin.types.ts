export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  recentActivity: number;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}
