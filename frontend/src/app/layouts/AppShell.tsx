/**
 * AppShell — The primary authenticated layout.
 *
 * Composes: Sidebar + Header + Content + CommandPalette + MobileNav.
 * Renders real profile/auth data instead of placeholder values.
 */
import { useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { NavGroup } from "@/shared/layout/types";
import {
  Sidebar,
  Header,
  Content,
  SearchBar,
  NotificationButton,
  ThemeSwitcher,
  UserMenu,
  CommandPalette,
  useSidebar,
  useBreakpoint,
} from "@/shared/layout";
import { MobileNavigation } from "@/shared/layout/components/Navigation/MobileNavigation";
import { useAuth } from "@/features/auth/hooks";
import { useProfile } from "@/features/profile/hooks";
import { useUnreadNotificationCount } from "@/features/notifications/hooks";
import {
  Home,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  PiggyBank,
  Users,
  Send,
  Bell,
  Shield,
  Settings,
  ChartPie,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

// ── Brand mark ────────────────────────────────────────────────────

export function BrandMark({ size = 28 }: { size?: number }): ReactNode {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-chart-1 via-brand-primary to-chart-3 shadow-elevation-md"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="text-[0.55em] font-bold tracking-tighter text-bg-primary">FF</span>
      <span className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/25" />
    </span>
  );
}

// ── Navigation ────────────────────────────────────────────────────

const defaultGroups: NavGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
      { id: "accounts", label: "Accounts", href: "/accounts", icon: Wallet },
      { id: "transactions", label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
      { id: "transfers", label: "Transfers", href: "/transfers", icon: Send },
      { id: "cards", label: "Cards", href: "/cards", icon: CreditCard },
      { id: "savings", label: "Savings", href: "/budgets", icon: PiggyBank },
      { id: "analytics", label: "Analytics", href: "/analytics", icon: ChartPie },
      { id: "beneficiaries", label: "Beneficiaries", href: "/beneficiaries", icon: Users },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { id: "profile-page", label: "Profile", href: "/profile", icon: Shield },
      { id: "security", label: "Security Center", href: "/security", icon: ScanSearch },
      { id: "notifications-page", label: "Notifications", href: "/notifications", icon: Bell },
      { id: "settings-page", label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const mobileTabs: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

// ── Component ─────────────────────────────────────────────────────

interface AppShellProps {
  children: ReactNode;
  navGroups?: NavGroup[];
  headerActions?: ReactNode;
}

export function AppShell({ children, navGroups, headerActions }: AppShellProps): ReactNode {
  const sidebar = useSidebar();
  const { width: vpWidth } = useBreakpoint();
  const [commandOpen, setCommandOpen] = useState(false);

  const { user, logout } = useAuth();
  const { data: profile } = useProfile();
  const { data: unreadCount } = useUnreadNotificationCount();
  const navigate = useNavigate();

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const sidebarOffset =
    sidebar.mode === "overlay" || sidebar.mode === "offscreen" || vpWidth < 768
      ? 0
      : sidebar.mode === "expanded"
        ? 240
        : 64;

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  const displayName = fullName || user?.username || "Account Holder";
  const displayEmail = user?.email ?? "";

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Sidebar
        groups={navGroups ?? defaultGroups}
        mode={sidebar.mode}
        isOpen={sidebar.isOpen}
        onToggle={sidebar.toggle}
        onClose={sidebar.close}
        logo={
          <span className="flex items-center gap-2.5">
            <BrandMark size={28} />
            <span className="text-lg font-bold tracking-tight text-text-primary">FinFlow</span>
          </span>
        }
        footer={
          <UserMenu
            name={displayName}
            email={displayEmail}
            role="Account Holder"
            onLogout={handleLogout}
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
          ) : undefined
        }
        center={<SearchBar onClick={openCommand} />}
        right={
          <>
            {headerActions}
            <NotificationButton count={unreadCount ?? 0} onClick={() => navigate("/notifications")} />
            <ThemeSwitcher />
          </>
        }
      />

      <Content sidebarOffset={sidebarOffset}>{children}</Content>

      {vpWidth < 768 && <MobileNavigation items={mobileTabs} />}

      <CommandPalette isOpen={commandOpen} onClose={closeCommand} />
    </div>
  );
}