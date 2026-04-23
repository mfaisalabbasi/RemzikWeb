"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/integrations/api/auth";
import { useNotifications } from "@/app/integrations/hooks/useNotifications";
import Sidebar from "./components/layout/SideBar";
import Topbar from "./components/layout/TopBar";
import styles from "./components/layout/layout.module.css";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // The hook now listens for user changes and fetches history only when ready
  const { unreadCount } = useNotifications(user?.id, user?.role);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => router.replace("/auth/login"));
  }, [router]);

  if (loading) return null;

  return (
    <div className={styles.container}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          notificationsCount={unreadCount}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
