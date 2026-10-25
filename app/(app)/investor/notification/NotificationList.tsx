"use client";

import styles from "./notification.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/app/integrations/types/notification";
import { BellRing, CheckCircle, ArrowRight } from "lucide-react";

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
        <div className={styles.empty}>
          <BellRing size={32} color="#94a3b8" />
          <p>No notifications yet</p>
        </div>
      )}
      {list.map((n) => (
        <div
          key={n.id}
          onClick={() => handleAction(n)}
          className={clsx(styles.notification, !n.read && styles.unread)}
        >
          <div className={styles.iconSection}>
            <div
              className={clsx(styles.iconBox, !n.read && styles.unreadIconBox)}
            >
              <BellRing size={16} />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.titleRow}>
              <strong className={styles.title}>{n.title}</strong>
              {!n.read && <span className={styles.unreadDot} />}
            </div>
            <p className={styles.message}>{n.message}</p>
            <span className={styles.date}>
              {n.createdAt
                ? new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Just now"}
            </span>
          </div>

          {n.actionUrl && (
            <div className={styles.actionArrow}>
              <ArrowRight size={16} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
