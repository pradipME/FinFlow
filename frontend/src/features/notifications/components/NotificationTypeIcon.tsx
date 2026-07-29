import { ArrowLeftRight, Wallet, Shield, Gift, Bell } from "lucide-react";
import type { NotificationType } from "../types";

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  TRANSACTION: ArrowLeftRight,
  ACCOUNT: Wallet,
  SECURITY: Shield,
  PROMOTION: Gift,
  SYSTEM: Bell,
};

const COLOR_MAP: Record<NotificationType, string> = {
  TRANSACTION: "text-blue-500",
  ACCOUNT: "text-green-500",
  SECURITY: "text-red-500",
  PROMOTION: "text-purple-500",
  SYSTEM: "text-gray-500",
};

interface NotificationTypeIconProps {
  type: NotificationType;
  size?: number;
}

export function NotificationTypeIcon({ type, size = 20 }: NotificationTypeIconProps) {
  const Icon = ICON_MAP[type];
  const colorClass = COLOR_MAP[type];

  return <Icon size={size} className={colorClass} />;
}
