"use client";

import styles from "./styles/DistributionCard.module.css";

interface Props {
  asset: string;
  stage: string;
  totalRaised: number;
  investors: number;
  nextPayout: string;
}

export default function DistributionCard({
  asset,
  stage,
  totalRaised,
  investors,
  nextPayout,

}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{asset}</h3>
        <span className={`${styles.stage} ${styles[stage.toLowerCase()]}`}>
          {stage}
        </span>
      </div>

      <div className={styles.stats}>
        <div>
          <span className={styles.label}>Total Raised</span>
          <p>SAR {totalRaised.toLocaleString()}</p>
        </div>
        <div>
          <span className={styles.label}>Investors</span>
          <p>{investors}</p>
        </div>
        <div>
          <span className={styles.label}>Next Payout</span>
          <p>{nextPayout}</p>
        </div>
      </div>
    </div>
  );
}
