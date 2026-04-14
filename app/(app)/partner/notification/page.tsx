"use client";

import { useEffect, useState } from "react";
import NotificationList from "@/app/(app)/investor/notification/NotificationList";
import { useNotifications } from "@/app/integrations/hooks/useNotifications";
import { getCurrentUser } from "@/app/integrations/api/auth";

export default function PartnerNotificationPage() {
  const [userId, setUserId] = useState<string>();
  const { notifications, markAsReadLocal, loading } = useNotifications(userId);

  useEffect(() => {
    getCurrentUser().then((user) => setUserId(user.id));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // Adding the key here is vital for data isolation
    <div key={userId || "loading"} className="container py-6">
      <h1 className="text-2xl font-bold mb-6 text-emerald-900">
        Partner Notifications
      </h1>
      <NotificationList
        notifications={notifications}
        onMarkRead={markAsReadLocal}
      />
    </div>
  );
}
