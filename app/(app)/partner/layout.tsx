"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/integrations/api/auth";
import { useNotifications } from "@/app/integrations/hooks/useNotifications";
import PartnerSidebar from "./components/layout/PartnerSidebar";
import PartnerTopbar from "./components/layout/PartnerTopbar";
import styles from "./styles/PartnerLayout.module.css";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const { unreadCount } = useNotifications(user?.id);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        if (data.role !== "PARTNER") router.replace("/auth/login");
        else {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(() => router.replace("/auth/login"));
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.layout}>
      <PartnerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <PartnerTopbar
          onMenuClick={() => setSidebarOpen(true)}
          notificationsCount={unreadCount}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
