"use client";

import { useState } from "react";
import PartnerSidebar from "./components/layout/PartnerSidebar";
import PartnerTopbar from "./components/layout/PartnerTopbar";
import styles from "./styles/PartnerLayout.module.css";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
