"use client";

import styles from "./Profile.module.css";
import { Investment } from "./types";

export default function InvestmentCard({
  investment,
}: {
  investment: Investment;
}) {
  return (
    <div className={styles.investmentCard}>
      <img
        src={investment.image}
        alt={investment.assetTitle}
        className={styles.assetImage}
      />

      <div className={styles.cardBody}>
        {/* HEADER */}
        <div className={styles.cardTop}>
          <div className={styles.assetTitle}>{investment.assetTitle}</div>

          <span
            className={`${styles.status} ${
              styles[investment.status.toLowerCase()]
            }`}
          >
            {investment.status}
          </span>
        </div>

        {/* METRICS */}
        <div className={styles.dataGrid}>
          <div className={styles.metric}>
            <label>Invested</label>
            <span className={styles.primaryValue}>
              SAR {investment.amountInvested.toLocaleString()}
            </span>
          </div>

          <div className={styles.metric}>
            <label>ROI</label>
            <span>{investment.roi}%</span>
          </div>

          <div className={styles.metric}>
            <label>Tenure</label>
            <span>{investment.tenure} months</span>
          </div>
        </div>
      </div>
    </div>
  );
}
