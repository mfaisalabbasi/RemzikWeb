// app/types/notification.ts
export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error";
  read: boolean;
  actionUrl?: string;
  createdAt: string; // ISO Date string from Backend
  date?: string;
  isBroadcast?: boolean;
}
