"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/integrations/api/auth";
import Sidebar from "@/app/(app)/investor/components/layout/SideBar";
import Topbar from "@/app/(app)/investor/components/layout/TopBar";
import styles from "@/app/(app)/investor/styles/InvestorLayout.module.css";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const data = await getCurrentUser();

        if (data.role !== "INVESTOR") {
          router.replace("/auth/login");
        }
      } catch {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
