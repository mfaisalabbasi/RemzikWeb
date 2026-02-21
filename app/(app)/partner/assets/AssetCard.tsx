"use client";

import styles from "./styles/AssetCard.module.css";

interface AssetProps {
  name: string;
  type: string;
  stage: string;
  target: number;
  raised: number;
  roi: number;
  investors: number;
}

export default function AssetCard({
  name,
  type,
  stage,
  target,
  raised,
  roi,
  investors,
}: AssetProps) {
  const progress = Math.min((raised / target) * 100, 100).toFixed(0);

  return (
    <div className={styles.card}>
      {/* Header: Asset Name + Stage */}
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <span className={`${styles.stage} ${styles[stage.toLowerCase()]}`}>
          {stage}
        </span>
      </div>

      {/* Type */}
      <p className={styles.type}>{type}</p>

      {/* Progress */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.percent}>{progress}% Funded</span>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div>
          <span className={styles.statLabel}>Target</span>
          <span>SAR {target.toLocaleString()}</span>
        </div>
        <div>
          <span className={styles.statLabel}>Raised</span>
          <span>SAR {raised.toLocaleString()}</span>
        </div>
        <div>
          <span className={styles.statLabel}>ROI</span>
          <span>{roi}%</span>
        </div>
        <div>
          <span className={styles.statLabel}>Investors</span>
          <span>{investors}</span>
        </div>
      </div>
    </div>
  );
}
