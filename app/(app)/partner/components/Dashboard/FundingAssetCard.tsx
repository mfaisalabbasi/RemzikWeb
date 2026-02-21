"use client";

import styles from "../Dashboard/styles/FundingAssetCard.module.css";

interface Props {
  name: string;
  target: number;
  raised: number;
  stage: string;
}

export default function FundingAssetCard({
  name,
  target,
  raised,
  stage,
}: Props) {
  const percent = Math.min((raised / target) * 100, 100).toFixed(0);

  return (
    <div className={styles.card}>
      {/* Header with asset name and stage badge */}
      <div className={styles.header}>
        <h4 className={styles.name}>{name}</h4>
        <span className={styles.stage}>{stage}</span>
      </div>

      {/* Raised / Target */}
      <div className={styles.amountWrapper}>
        <p className={styles.amount}>
          SAR {raised.toLocaleString()} / {target.toLocaleString()}
        </p>
        <p className={styles.percent}>{percent}% Funded</p>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
