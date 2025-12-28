"use client";

import styles from "@/app/(app)/investor/styles/PortfolioSnapshot.module.css";

export default function PortfolioSnap() {
  return (
    <div className={styles.portfolio}>
      <h3>Portfolio Snapshot</h3>
      <div className={styles.chartPlaceholder}>
        {/* Replace this with chart library (Recharts / Chart.js / ApexCharts) */}
        Chart goes here
      </div>
    </div>
  );
}
