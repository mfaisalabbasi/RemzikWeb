import React from "react";
import styles from "./Details.module.css";

interface AssetStatsBarProps {
  roi: string;
  tenure: string;
  minInvest: string;
  type: string;
  risk: "Low" | "Moderate" | "High";
}

export default function AssetStatsBar({
  roi,
  tenure,
  minInvest,
  type,
  risk,
}: AssetStatsBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.label}>ROI</span>
        <span className={styles.value}>{roi}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Tenure</span>
        <span className={styles.value}>{tenure}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Minimum Investment</span>
        <span className={styles.value}>{minInvest}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Type</span>
        <span className={styles.value}>{type}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Risk</span>
        <span className={styles.value}>{risk}</span>
      </div>
    </div>
  );
}
