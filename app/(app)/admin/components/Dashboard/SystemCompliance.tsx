import React from "react";
import { ShieldCheck } from "lucide-react";
import styles from "./Dashbaord.module.css";

export const SystemCompliance = () => (
  <div className={styles.sectionContainer}>
    <h3 style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}>
      SYSTEM COMPLIANCE
    </h3>
    <div className={styles.dataRow}>
      <span style={{ fontWeight: 600 }}>Regulatory Health</span>
      <span style={{ color: "#059669", fontWeight: 700 }}>OPTIMAL</span>
    </div>
    <div className={styles.dataRow}>
      <span style={{ fontWeight: 600 }}>Last Audit</span>
      <span style={{ fontSize: "0.8rem" }}>14 Apr 2026</span>
    </div>
    <div style={{ marginTop: "1rem" }}>
      <button className={styles.btnAction} style={{ width: "100%" }}>
        Download Audit Report
      </button>
    </div>
  </div>
);
