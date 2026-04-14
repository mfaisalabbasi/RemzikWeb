"use client";

import styles from "./notification.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/app/integrations/types/notification";

// ✅ 1. Explicitly export the interface
export interface NotificationProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

// ✅ 2. Apply it to the component
export default function NotificationList({
  notifications,
  onMarkRead,
}: NotificationProps) {
  const list = Array.isArray(notifications) ? notifications : [];
  const router = useRouter();

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.read) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${n.id}/read`,
        {
          method: "PATCH",
        },
      );
      onMarkRead(n.id);
    }

    if (n.actionUrl) {
      router.push(n.actionUrl);
    }
  };

  return (
    <div className={styles.notificationWrapper}>
      {list.length === 0 && (
        <div className={styles.empty}>No notifications yet</div>
      )}

      {list.map((n) => (
        <div
          key={n.id}
          onClick={() => handleNotificationClick(n)}
          className={clsx(
            styles.notification,
            n.type && styles[n.type],
            !n.read && styles.unread,
          )}
        >
          <div className={styles.content}>
            <strong>{n.title}</strong>
            {n.message && <p>{n.message}</p>}
          </div>

          <span className={styles.date}>
            {n.createdAt
              ? new Date(n.createdAt).toLocaleDateString()
              : "Just now"}
          </span>
        </div>
      ))}
    </div>
  );
}
