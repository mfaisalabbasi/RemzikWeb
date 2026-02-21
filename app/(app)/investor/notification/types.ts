// app/(app)/investor/notification/types.ts
export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error";
  date?: string; // optional, e.g., "2 mins ago"
}
