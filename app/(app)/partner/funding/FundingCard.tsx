"use client";

import styles from "./styles/FundingCard.module.css";

interface Props {
  asset: string;
  target: number;
  raised: number;
  roi: number;
  investors: number;
  stage: string;
}

export default function FundingCard({
  asset,
  target,
  raised,
  roi,
  investors,
  stage,
}: Props) {
  const progress = Math.min((raised / target) * 100, 100).toFixed(0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.asset}>{asset}</h3>
        <span className={`${styles.stage} ${styles[stage.toLowerCase()]}`}>
          {stage}
        </span>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.percent}>{progress}% Funded</span>
      </div>

      <div className={styles.stats}>
        <div>
          <span className={styles.label}>Target</span>
          <span>SAR {target.toLocaleString()}</span>
        </div>
        <div>
          <span className={styles.label}>Raised</span>
          <span>SAR {raised.toLocaleString()}</span>
        </div>
        <div>
          <span className={styles.label}>ROI</span>
          <span>{roi}%</span>
        </div>
        <div>
          <span className={styles.label}>Investors</span>
          <span>{investors}</span>
        </div>
      </div>
    </div>
  );
}
