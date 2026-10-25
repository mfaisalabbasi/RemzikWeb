"use client";

import styles from "./styles/FundingCard.module.css";
import { TrendingUp, Target, Wallet, Users } from "lucide-react";

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
        <span
          className={`${styles.stage} ${styles[stage.toLowerCase()] || styles.funding}`}
        >
          {stage}
        </span>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Subscription Rate</span>
          <span className={styles.percent}>{progress}% Funded</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.label}>Target Capital</span>
          <span className={styles.val}>SAR {target.toLocaleString()}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.label}>Capital Raised</span>
          <span className={styles.val} style={{ color: "#059669" }}>
            SAR {raised.toLocaleString()}
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.label}>Projected ROI</span>
          <span className={styles.val}>{roi}% APY</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.label}>Participants</span>
          <span className={styles.val}>{investors} Investors</span>
        </div>
      </div>
    </div>
  );
}
