import { AlertCircle } from "lucide-react";
import styles from "./Dashbaord.module.css";

export const UrgentQueue = () => (
  <div className={styles.sectionContainer}>
    <h3 style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}>
      ACTION REQUIRED
    </h3>
    <div className={styles.dataRow}>
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>KYC Approval: Faisal A.</p>
      </div>
      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>2m ago</span>
      <button className={styles.btnAction}>Process</button>
    </div>
  </div>
);
