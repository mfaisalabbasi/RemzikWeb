"use client";

import styles from "./styles/AssetCard.module.css";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
} from "lucide-react";

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
        <div>
          <span className={styles.type}>{type}</span>
          <h3 className={styles.name}>{name}</h3>
        </div>
        <span className={`${styles.stage} ${styles[stage.toLowerCase()]}`}>
          {stage}
        </span>
      </div>

      {/* Progress */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Funding Progress</span>
          <span className={styles.percent}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Target Capital</span>
          <span className={styles.statVal}>SAR {target.toLocaleString()}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Raised Capital</span>
          <span className={styles.statVal} style={{ color: "#059669" }}>
            SAR {raised.toLocaleString()}
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Expected ROI</span>
          <span className={styles.statVal}>{roi}% APY</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Participants</span>
          <span className={styles.statVal}>{investors} Investors</span>
        </div>
      </div>
    </div>
  );
}
