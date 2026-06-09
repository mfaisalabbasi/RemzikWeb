"use client";

import styles from "./Portfolio.module.css";

export default function InvestmentCard({ investment }: { investment: any }) {
  if (!investment) return null;

  const { assetTitle, amountInvested, roi, status, image } = investment;
  const statusKey = status ? status.toLowerCase() : "pending";

  return (
    <div className={styles.assetCard}>
      <div className={styles.cardVisual}>
        <img src={image || "/slider/real-estate.jpg"} alt={assetTitle} />
        <div className={styles.roiTag}>{roi}% APY</div>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.cardHeader}>
          <h4>{assetTitle}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className={`${styles.statusDot} ${styles[statusKey] || styles.pending}`}
            />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              {status}
            </span>
          </div>
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
