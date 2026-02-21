// app/(app)/investor/notification/page.tsx
"use client";

import NotificationList from "./NotificationList";
import { MOCK_NOTIFICATIONS } from "./mock";

export default function NotificationPage() {
  // You can later replace MOCK_NOTIFICATIONS with API fetch
  const notifications = MOCK_NOTIFICATIONS;

  return <NotificationList notifications={notifications} />;
}
