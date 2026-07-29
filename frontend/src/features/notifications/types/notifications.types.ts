export type NotificationType = "TRANSACTION" | "ACCOUNT" | "SECURITY" | "PROMOTION" | "SYSTEM";

export interface Notification {
  id: string;
  ownerId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}
