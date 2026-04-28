"use client";
import styles from "./assets.module.css";

interface AssetSummaryProps {
  asset: any; // We will pass the full asset data from the page
}

export const AssetSummary = ({ asset }: AssetSummaryProps) => {
  if (!asset) return <div className={styles.card}>Loading Context...</div>;

  // Calculate funding percentage
  const fundingRatio =
    asset.totalValue > 0
      ? (Number(asset.funded) / Number(asset.totalValue)) * 100
      : 0;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Asset Origination Context</h3>
        <span className={styles.badge}>{asset.type}</span>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>ORIGINATOR</span>
          <span className={styles.value}>
            {asset.partner?.companyName || "Unknown Partner"}
          </span>
        </div>

        <div className={styles.summaryItem}>
          <span className={styles.label}>SUBMISSION DATE</span>
          <span className={styles.value}>
            {new Date(asset.createdAt).toLocaleDateString("en-GB")}
          </span>
        </div>

        <div className={styles.summaryItem}>
          <span className={styles.label}>EXPECTED YIELD</span>
          <span className={`${styles.value} ${styles.highlight}`}>
            {asset.expectedYield || 0}% APY
          </span>
        </div>

        <div className={styles.summaryItem}>
          <span className={styles.label}>ASSET STATUS</span>
          <span className={styles.statusText} data-status={asset.status}>
            {asset.status}
          </span>
        </div>
      </div>

      <div className={styles.fundingModule}>
        <div className={styles.fundingLabels}>
          <span>Capital Raised</span>
          <span>{fundingRatio.toFixed(1)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min(fundingRatio, 100)}%` }}
          />
        </div>
        <div className={styles.fundingStats}>
          <strong>{Number(asset.funded).toLocaleString()}</strong> /{" "}
          {Number(asset.totalValue).toLocaleString()} SAR
        </div>
      </div>
    </div>
  );
};
