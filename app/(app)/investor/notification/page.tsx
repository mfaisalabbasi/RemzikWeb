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

  // CRITICAL FIX: You MUST pass "INVESTORS" here so the hook joins the room
  const { notifications, loading, markAsReadLocal } = useNotifications(
    userId,
    "INVESTORS",
  );

  if (!ready) return <div className="p-10 text-center">Authenticating...</div>;
  if (loading)
    return <div className="p-10 text-center">Loading notifications...</div>;

  return (
    <div key={userId || "loading"} className="container py-6">
      <h1 className="mb-4 text-xl font-bold">Notifications</h1>
      <NotificationList
        notifications={notifications}
        onMarkRead={markAsReadLocal}
      />
    </div>
  );
}
