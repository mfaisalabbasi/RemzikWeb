// app/(app)/investor/notification/NotificationList.tsx
"use client";

import styles from "./notification.module.css";
import clsx from "clsx";
import { NotificationItem } from "./types";

interface NotificationProps {
  notifications?: NotificationItem[];
}

export default function NotificationList({ notifications }: NotificationProps) {
  const list = notifications ?? [];

  return (
    <div className={styles.notificationWrapper}>
      {list.length === 0 && (
        <div className={styles.empty}>No notifications yet</div>
      )}

      {list.map((n) => (
        <div
          key={n.id}
          className={clsx(styles.notification, n.type && styles[n.type])}
        >
          <div className={styles.content}>
            <strong>{n.title}</strong>
            {n.message && <p>{n.message}</p>}
          </div>
          {n.date && <span className={styles.date}>{n.date}</span>}
        </div>
      ))}
    </div>
  );
}
