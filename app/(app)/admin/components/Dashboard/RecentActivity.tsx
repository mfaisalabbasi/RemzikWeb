import { Activity } from "lucide-react";
import styles from "./Dashbaord.module.css";

export const RecentActivity = () => (
  <div className={styles.sectionContainer}>
    <h3 style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}>
      SYSTEM ACTIVITY
    </h3>
    <div className={styles.dataRow}>
      <span style={{ fontWeight: 500 }}>Riyadh Tower Minted</span>
      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>10:42 AM</span>
      <span className={styles.statusPill}>Minted</span>
    </div>
  </div>
);
