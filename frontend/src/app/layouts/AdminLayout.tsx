/**
 * AdminLayout — Dedicated banking / bank-admin console shell.
 *
 * Deliberately separate from the customer "wallet" layout (DashboardLayout /
 * AppShell). Admins get a staff control-panel surface only:
 *   - No customer wallet navigation (Dashboard/Payments/Accounts/Wallets/
 *     Transfers/Cards/Savings/Analytics/Beneficiaries).
 *   - No customer mobile bottom-tab navigation.
 *   - No customer notification bell or command palette.
 *   - Sidebar + header focused purely on bank administration.
 *
 * Backend remains the source of truth: every /api/v1/admin/** endpoint is
 * role-gated server-side; AdminRoute gates the UI at the router level.
 */
import { useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { NavGroup } from "@/shared/layout/types";
import { useAuth } from "@/features/auth/hooks";
import { useAdminRealtimeEvents } from "@/features/admin/hooks/useAdminRealtime";
import {
  Sidebar,
  Header,
  Content,
  UserMenu,
  useSidebar,
  useBreakpoint,
} from "@/shared/layout";
import {
  BadgeCheck,
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  ClipboardList,
  ArrowLeftRight,
  ScanSearch,
  Shield,
  Settings,
} from "lucide-react";

// ── Brand mark (admin console) ──────────────────────────────────

export function AdminBrandMark({ size = 28 }: { size?: number }): ReactNode {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950 shadow-elevation-md"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="text-[0.55em] font-bold tracking-tighter text-white/90">FF</span>
      <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/25" />
    </span>
  );
}

// ── Navigation (bank administration only) ───────────────────────

const adminNav: NavGroup[] = [
  {
    id: "admin-main",
    label: "Administration",
    items: [
      { id: "am-dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { id: "am-users", label: "Customers", href: "/admin/users", icon: Users },
      { id: "am-accounts", label: "Accounts", href: "/admin/accounts", icon: Wallet },
      { id: "am-cards", label: "Cards", href: "/admin/cards", icon: CreditCard },
      { id: "am-requests", label: "Requests", href: "/admin/requests", icon: ClipboardList },
      { id: "am-transactions", label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
      { id: "am-audit", label: "Audit Logs", href: "/admin/audit-logs", icon: ScanSearch },
    ],
  },
  {
    id: "admin-console",
    label: "Console",
    items: [
      { id: "ac-security", label: "Security", href: "/admin/security", icon: Shield },
      { id: "ac-settings", label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps): ReactNode {
  const sidebar = useSidebar();
  const { width: vpWidth } = useBreakpoint();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useAdminRealtimeEvents();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const displayName = user?.username || "Administrator";
  const displayEmail = user?.email ?? "";

  const sidebarOffset =
    sidebar.mode === "overlay" || sidebar.mode === "offscreen" || vpWidth < 768
      ? 0
      : sidebar.mode === "expanded"
        ? 240
        : 64;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0a0e14]">
      <Sidebar
        groups={adminNav}
        mode={sidebar.mode}
        isOpen={sidebar.isOpen}
        onToggle={sidebar.toggle}
        onClose={sidebar.close}
        logo={
          <span className="flex items-center gap-2.5">
            <AdminBrandMark size={28} />
            <span className="text-lg font-bold tracking-tight text-text-primary">FinFlow Bank</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-100 dark:bg-white/10 dark:text-white/70">
              Admin
            </span>
          </span>
        }
        footer={
          <UserMenu
            name={displayName}
            email={displayEmail}
            role="Bank Administrator"
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        }
      />

      <Header
        left={
          sidebar.mode === "offscreen" || sidebar.mode === "overlay" ? (
            <button
              type="button"
              onClick={sidebar.open}
              className="rounded-lg p-1.5 text-text-tertiary hover:bg-bg-tertiary"
              title="Open menu"
            >
              <span className="block h-0.5 w-5 bg-current" />
            </button>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              <BadgeCheck size={16} className="text-emerald-600" />
              Bank Administration Console
            </span>
          )
        }
        center={undefined}
        right={
          <>
            <span className="hidden rounded-md border border-border-default px-2.5 py-1 text-xs font-medium text-text-tertiary sm:inline">
              STAFF
            </span>
          </>
        }
      />

      <Content sidebarOffset={sidebarOffset} width="full">
        {children}
      </Content>
    </div>
  );
}