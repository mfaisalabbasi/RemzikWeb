"use client";

import { useEffect, useState } from "react";
import NotificationList from "./NotificationList";
import { useNotifications } from "@/app/integrations/hooks/useNotifications";
import { getCurrentUser } from "@/app/integrations/api/auth";
import { Bell, ShieldCheck } from "lucide-react";

export default function NotificationPage() {
  const [userId, setUserId] = useState<string>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user?.id) setUserId(user.id);
      setReady(true);
    });
  }, []);

  const { notifications, loading, markAsReadLocal } = useNotifications(
    userId,
    "INVESTORS",
  );

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 600,
        }}
      >
        Authenticating session...
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 600,
        }}
      >
        Loading notifications...
      </div>
    );
  }

  return (
    <div
      key={userId || "loading"}
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      {/* Header Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "9999px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#059669",
          fontSize: "0.725rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "1rem",
        }}
      >
        <ShieldCheck size={13} color="#059669" />
        <span>Activity Feed</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Notifications
        </h1>
      </div>

      <NotificationList
        notifications={notifications}
        onMarkRead={markAsReadLocal}
      />
    </div>
  );
}
