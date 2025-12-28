"use client";

import { useState } from "react";
import Sidebar from "@/app/(app)/investor/components/layout/SideBar";
import Topbar from "@/app/(app)/investor/components/layout/TopBar";
import styles from "@/app/(app)/investor/styles/InvestorLayout.module.css";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
