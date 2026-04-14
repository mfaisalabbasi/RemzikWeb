"use client";

import { useEffect, useState } from "react";
import NotificationList from "./NotificationList";
import { useNotifications } from "@/app/integrations/hooks/useNotifications";
import { getCurrentUser } from "@/app/integrations/api/auth";

export default function NotificationPage() {
  const [userId, setUserId] = useState<string>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user?.id) setUserId(user.id);
      setReady(true);
    });
  }, []);

  const { notifications, loading, markAsReadLocal } = useNotifications(userId);

  if (!ready) return <div className="p-10 text-center">Authenticating...</div>;
  if (loading)
    return <div className="p-10 text-center">Loading notifications...</div>;

  return (
    // Add key={userId || 'loading'} here.
    // This forces a complete DOM re-render when the account switches.
    <div key={userId || "loading"} className="container py-6">
      <h1 className="mb-4 text-xl font-bold">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkRead={markAsReadLocal}
        />
      )}
    </div>
  );
}
