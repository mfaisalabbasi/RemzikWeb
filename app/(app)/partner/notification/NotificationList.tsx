"use client";

import styles from "./notification.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/app/integrations/types/notification";

export default function NotificationList({
  notifications,
  onMarkRead,
}: {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}) {
  const router = useRouter();
  const list = Array.isArray(notifications) ? notifications : [];

  const handleAction = async (n: NotificationItem) => {
    if (!n.read) {
      if (!n.isBroadcast) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications/${n.id}/read`,
            { method: "PATCH" },
          );
        } catch (e) {
          console.error(e);
        }
      }
      onMarkRead(n.id);
    }
    if (n.actionUrl) router.push(n.actionUrl);
  };

  return (
    <div className={styles.notificationWrapper}>
      {list.length === 0 && (
        <div className={styles.empty}>No notifications yet</div>
      )}
      {list.map((n) => (
        <div
          key={n.id}
          onClick={() => handleAction(n)}
          className={clsx(styles.notification, !n.read && styles.unread)}
        >
          <div className={styles.content}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
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
