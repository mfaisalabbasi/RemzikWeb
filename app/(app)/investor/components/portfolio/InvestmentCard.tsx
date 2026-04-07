"use client";

import styles from "./Portfolio.module.css";

export default function InvestmentCard({ investment }: { investment: any }) {
  if (!investment) return null;

  const { assetTitle, amountInvested, roi, status, image } = investment;

  return (
    <div className={styles.assetCard}>
      <div className={styles.cardVisual}>
        <img src={image || "/slider/real-estate.jpg"} alt={assetTitle} />
        <div className={styles.roiTag}>{roi}% APY</div>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.cardHeader}>
          <h4>{assetTitle}</h4>
          <span
            className={`${styles.statusDot} ${styles[status.toLowerCase()] || styles.pending}`}
          />
        </div>

        <div className={styles.capitalRow}>
          <span className={styles.capLabel}>Principal Allocation</span>
          <span className={styles.capValue}>
            SAR {Number(amountInvested).toLocaleString()}
          </span>
        </div>

        <div className={styles.cardActions}>
          <button className={styles.secondaryBtn}>View Performance</button>
          <button className={styles.textLink}>Manage Asset →</button>
        </div>
      </div>
    </div>
  );
}
