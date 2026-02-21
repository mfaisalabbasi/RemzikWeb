"use client";

import { FaDollarSign, FaChartLine, FaCoins } from "react-icons/fa";
import styles from "./Dashboard.module.css";

export default function PortfolioSnapshot() {
  return (
    <div className={styles.portfolioCard}>
      <h3 className={styles.sectionTitle}>Portfolio Snapshot</h3>

      <div className={styles.chartWrapper}>
        <div className={styles.chartPlaceholder}>Chart goes here</div>
      </div>

      <div className={styles.portfolioMetrics}>
        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Total Invested</p>
          <p className={styles.metricValue}>
            <FaCoins className={styles.metricIcon} /> $85,000
          </p>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Current Value</p>
          <p className={styles.metricValue}>
            <FaChartLine className={styles.metricIcon} /> $120,500
          </p>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Profit / Loss</p>
          <p className={styles.metricValueHighlight}>
            <FaCoins className={styles.metricIconHighlight} /> +$35,500
          </p>
        </div>
      </div>
    </div>
  );
}
