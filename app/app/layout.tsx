"use client";

import Sidebar from "@/app/app/components/layout/SideBar";
import Topbar from "@/app/app/components/layout/TopBar";
import styles from "@/app/app/styles/InvestorLayout.module.css";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
