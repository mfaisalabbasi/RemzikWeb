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

  const { notifications, unreadCount, loading, markAsReadLocal } =
    useNotifications(userId);

  if (!ready) return <div className="p-10 text-center">Authenticating...</div>;
  if (loading)
    return <div className="p-10 text-center">Loading notifications...</div>;

  return (
    <div key={userId || "loading"} className="container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Notifications</h1>

        {/* Live Unread Badge */}
        {unreadCount > 0 ? (
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            {unreadCount} Unread
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
            All Read
          </span>
        )}
      </div>

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
