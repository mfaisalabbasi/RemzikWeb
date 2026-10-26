"use client";

import styles from "./notification.module.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/app/integrations/types/notification";
import { Building2, ArrowRight, BellRing } from "lucide-react";

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
    const isBroadcast = n.isBroadcast || n.id.toString().startsWith("bcast-");

    if (!n.read) {
      if (!isBroadcast) {
        try {
          // 🛡️ FIXED: Added credentials: "include" for proper cookie-based session auth
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications/${n.id}/read`,
            {
              method: "PATCH",
              credentials: "include",
            },
          );
        } catch (e) {
          console.error("Failed to mark notification as read:", e);
        }
      }
      onMarkRead(n.id);
    }

    if (n.actionUrl) {
      router.push(n.actionUrl);
    }
  };

  return (
    <div className={styles.notificationWrapper}>
      {list.length === 0 && (
        <div className={styles.empty}>
          <BellRing size={32} color="#94a3b8" />
          <p>No partner notifications yet</p>
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
              <Building2 size={16} />
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
