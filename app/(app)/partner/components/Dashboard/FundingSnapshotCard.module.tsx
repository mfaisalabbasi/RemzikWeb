"use client";

import styles from "./styles/FundingSnapshotCard.module.css";

interface Props {
  assetName: string;
  fundingPercentage: number;
}

export default function FundingSnapshotCard({
  assetName,
  fundingPercentage,
}: Props) {
  const percent = Math.min(fundingPercentage, 100).toFixed(1);

  return (
    <div className={styles.card}>
      {/* Asset Name */}
      <p className={styles.asset}>{assetName}</p>

      {/* Progress Bar */}
      <div className={styles.progress}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>

      {/* Percentage */}
      <span className={styles.percent}>{percent}% Funded</span>
    </div>
  );
}
