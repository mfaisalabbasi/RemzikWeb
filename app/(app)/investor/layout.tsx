"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/integrations/api/auth";
import { useNotifications } from "@/app/integrations/hooks/useNotifications";
import { PrivyDashboardWrapper } from "@/app/integrations/web3/PrivyDashboardWrapper";
import { WalletProvider } from "../../integrations/context/WalletContext";
import Sidebar from "./components/layout/SideBar";
import Topbar from "./components/layout/TopBar";
import styles from "./styles/InvestorLayout.module.css";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { unreadCount } = useNotifications(user?.id, "INVESTORS");

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        // 🛡️ Role Guard: Redirect non-investors to login
        if (data?.role !== "INVESTOR") {
          router.replace("/auth/login");
        } else {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(() => router.replace("/auth/login"));
  }, [router]);

  if (loading) {
    return (
      <div
        className={styles.container}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div>Loading Investor Portal...</div>
      </div>
    );
  }

  return (
    <PrivyDashboardWrapper>
      <WalletProvider>
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
      </WalletProvider>
    </PrivyDashboardWrapper>
  );
}
