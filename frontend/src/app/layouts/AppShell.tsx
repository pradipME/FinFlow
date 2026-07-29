/**
 * AppShell — The primary authenticated layout.
 *
 * Composes: Sidebar + Header + Content + CommandPalette.
 * Used by DashboardLayout and most authenticated pages.
 */
import { useState, useCallback, type ReactNode } from "react";
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
  type LucideIcon,
} from "lucide-react";

// ── Default nav data (will be replaced by real auth data later) ──

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
      { id: "beneficiaries", label: "Beneficiaries", href: "/beneficiaries", icon: Users },
      { id: "savings", label: "Savings", href: "/budgets", icon: PiggyBank },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { id: "notifications-page", label: "Notifications", href: "/notifications", icon: Bell },
      { id: "profile-page", label: "Profile", href: "/profile", icon: Shield },
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

// ── Component ────────────────────────────────────────────────────

interface AppShellProps {
  /** Page content */
  children: ReactNode;
  /** Navigation groups override */
  navGroups?: NavGroup[];
  /** Header actions override */
  headerActions?: ReactNode;
}

export function AppShell({ children, navGroups, headerActions }: AppShellProps): ReactNode {
  const sidebar = useSidebar();
  const { width: vpWidth } = useBreakpoint();
  const [commandOpen, setCommandOpen] = useState(false);

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  // Sidebar offset for content area
  const sidebarOffset =
    sidebar.mode === "overlay" || sidebar.mode === "offscreen" || vpWidth < 768
      ? 0
      : sidebar.mode === "expanded"
        ? 240
        : 64;

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Sidebar */}
      <Sidebar
        groups={navGroups ?? defaultGroups}
        mode={sidebar.mode}
        isOpen={sidebar.isOpen}
        onToggle={sidebar.toggle}
        onClose={sidebar.close}
        logo={<span className="text-lg font-bold text-text-primary">FinFlow</span>}
        footer={
          <UserMenu
            name="John Doe"
            email="john@example.com"
            role="Account Holder"
            onLogout={() => {
              /* logout */
            }}
          />
        }
      />

      {/* Header */}
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
            <NotificationButton count={3} />
            <ThemeSwitcher />
          </>
        }
      />

      {/* Content */}
      <Content sidebarOffset={sidebarOffset}>{children}</Content>

      {/* Mobile bottom nav */}
      {vpWidth < 768 && <MobileNavigation items={mobileTabs} />}

      {/* Command palette */}
      <CommandPalette isOpen={commandOpen} onClose={closeCommand} />
    </div>
  );
}
