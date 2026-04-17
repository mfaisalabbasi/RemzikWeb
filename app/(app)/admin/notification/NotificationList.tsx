"use client";

import { useRouter } from "next/navigation";
import { NotificationItem } from "@/app/integrations/types/notification";
import styles from "./notification.module.css";
import clsx from "clsx";

interface Props {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkRead }: Props) {
  const router = useRouter();
  const list = Array.isArray(notifications) ? notifications : [];

  const handleClick = async (n: NotificationItem) => {
    if (!n.read) onMarkRead(n.id);
    if (n.actionUrl) router.push(n.actionUrl);
  };

  return (
    <div className={styles.notificationWrapper}>
      {list.map((n) => (
        <div
          key={n.id}
          onClick={() => handleClick(n)}
          className={clsx(styles.notification, !n.read && styles.unread)}
        >
          <div className={styles.content}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
          <span className={styles.date}>
            {new Date(n.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
