import { ArrowLeftRight, Wallet, Shield, Gift, Bell } from "lucide-react";
import type { NotificationType } from "../types";

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  TRANSACTION: ArrowLeftRight,
  ACCOUNT: Wallet,
  SECURITY: Shield,
  PROMOTION: Gift,
  SYSTEM: Bell,
};

const STYLE_MAP: Record<NotificationType, { icon: string; chip: string }> = {
  TRANSACTION: { icon: "text-chart-3", chip: "bg-info-subtle" },
  ACCOUNT: { icon: "text-brand-primary", chip: "bg-brand-primary-subtle" },
  SECURITY: { icon: "text-danger", chip: "bg-danger-subtle" },
  PROMOTION: { icon: "text-chart-4", chip: "bg-warning-subtle" },
  SYSTEM: { icon: "text-text-secondary", chip: "bg-surface-active" },
};

interface NotificationTypeIconProps {
  type: NotificationType;
  size?: "sm" | "md" | "lg";
}

const CONTAINER_SIZES = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
} as const;

const ICON_SIZES = {
  sm: 15,
  md: 18,
  lg: 22,
} as const;

export function NotificationTypeIcon({ type, size = "md" }: NotificationTypeIconProps) {
  const Icon = ICON_MAP[type];
  const styles = STYLE_MAP[type];

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${CONTAINER_SIZES[size]} ${styles.chip}`}
      aria-hidden="true"
    >
      <Icon size={ICON_SIZES[size]} className={styles.icon} />
    </div>
  );
}