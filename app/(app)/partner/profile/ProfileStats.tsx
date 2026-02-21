"use client";

import styles from "./styles/ProfileStats.module.css";

interface StatsProps {
  stats: {
    totalAssets: number;
    totalInvestors: number;
    totalFunding: number;
  };
}

export default function ProfileStats({ stats }: StatsProps) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <span className={styles.label}>Total Assets</span>
        <span className={styles.value}>{stats.totalAssets}</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.label}>Total Investors</span>
        <span className={styles.value}>{stats.totalInvestors}</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.label}>Total Funding</span>
        <span className={styles.value}>
          SAR {stats.totalFunding.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
