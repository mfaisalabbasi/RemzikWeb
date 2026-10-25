import React from "react";
import styles from "./Details.module.css";

interface TrustSignalsProps {
  funded: number;
  target: number;
  investors: number;
  risk: string;
}

export default function TrustSignals({
  funded,
  target,
  investors,
}: TrustSignalsProps) {
  const percentage = Math.min(100, Math.round((funded / (target || 1)) * 100));

  return (
    <div className={styles.trustContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressTitle}>Vault Funding Progress</span>
        <span className={styles.progressStats}>{percentage}% Funded</span>
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className={styles.trustFooter}>
        <span>SAR {funded.toLocaleString()} Funded</span>
        <span>{investors} Institutional Backers</span>
      </div>
    </div>
  );
}
