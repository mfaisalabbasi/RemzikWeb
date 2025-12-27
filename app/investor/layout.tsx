"use client";

import Topbar from "./components/layout/TopBar";
import styles from "@/app/investor/styles/InvestorLayout.module.css";
import InvestorSidebar from "./components/layout/SideBar";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <InvestorSidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
