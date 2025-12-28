"use client";

import styles from "./Portfolio.module.css";

export default function PortfolioSummary() {
  return (
    <div className={styles.summary}>
      <h3>Portfolio Summary</h3>
      <div className={styles.cards}>
        <div className={styles.card}>
          <p>Total Invested</p>
          <span>$85,000</span>
        </div>
        <div className={styles.card}>
          <p>Current Value</p>
          <span>$120,500</span>
        </div>
        <div className={styles.card}>
          <p>Profit/Loss</p>
          <span className={styles.profit}>+$35,500</span>
        </div>
      </div>
    </div>
  );
}
