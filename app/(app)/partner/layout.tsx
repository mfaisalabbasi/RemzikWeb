"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/integrations/api/auth";

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

  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const data = await getCurrentUser();

        console.log("AUTH USER:", data);

        if (data.role !== "PARTNER") {
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
    <div className={styles.layout}>
      <PartnerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.main}>
        <PartnerTopbar onMenuClick={() => setSidebarOpen(true)} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
