"use client";

import styles from "./styles/ProfileStats.module.css";
import { Layers, Users, Wallet } from "lucide-react";

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
        <div className={styles.statTopRow}>
          <span className={styles.label}>Total Assets</span>
          <div className={styles.iconBox}>
            <Layers size={16} color="#059669" />
          </div>
        </div>
        <span className={styles.value}>{stats.totalAssets}</span>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statTopRow}>
          <span className={styles.label}>Total Investors</span>
          <div className={styles.iconBox}>
            <Users size={16} color="#059669" />
          </div>
        </div>
        <span className={styles.value}>{stats.totalInvestors}</span>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statTopRow}>
          <span className={styles.label}>Total Funding</span>
          <div className={styles.iconBox}>
            <Wallet size={16} color="#059669" />
          </div>
        </div>
        <span className={styles.value}>
          SAR {stats.totalFunding.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
