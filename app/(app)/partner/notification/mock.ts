// app/(app)/investor/notification/mock.ts
import { NotificationItem } from "./types";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Trade Executed",
    message: "You bought 50 units of Riyadh Commercial.",
    type: "success",
    date: "2 mins ago",
  },
  {
    id: "n2",
    title: "Price Alert",
    message: "Makkah Hotel price dropped to SAR 9,500.",
    type: "info",
    date: "10 mins ago",
  },
  {
    id: "n3",
    title: "Portfolio Update",
    message: "Your total P&L is now SAR 12,500.",
    type: "warning",
    date: "1 hour ago",
  },
];
