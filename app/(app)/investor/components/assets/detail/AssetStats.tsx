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
  const getRiskClass = (r: string) => {
    switch (r) {
      case "Low":
        return styles.riskLow;
      case "High":
        return styles.riskHigh;
      default:
        return styles.riskModerate;
    }
  };

  return (
    <div className={styles.statsBar}>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Target APY</span>
        <span className={`${styles.statValue} ${styles.goldValue}`}>{roi}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Tenure</span>
        <span className={styles.statValue}>{tenure}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Minimum Investment</span>
        <span className={styles.statValue}>{minInvest}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Asset Class</span>
        <span className={styles.statValue}>{type}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Risk Profile</span>
        <span className={`${styles.statValue} ${getRiskClass(risk)}`}>
          {risk}
        </span>
      </div>
    </div>
  );
}
