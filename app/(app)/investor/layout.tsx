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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={styles.container}>
      {/* Sidebar with state */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={styles.main}>
        {/* Topbar passes toggle function */}
        <Topbar toggleSidebar={toggleSidebar} />

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
