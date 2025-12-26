import Link from "next/link";
import styles from "@/app/app/styles/AssetCard.module.css";

export default function AssetCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Shariah Compliant</span>
        <h3>Riyadh Commercial Property</h3>
      </div>

      <ul className={styles.meta}>
        <li>
          <strong>ROI:</strong> 14%
        </li>
        <li>
          <strong>Tenure:</strong> 12 Months
        </li>
        <li>
          <strong>Min Invest:</strong> SAR 5,000
        </li>
      </ul>

      <div className={styles.footer}>
        <Link href="/app/assets/1" className={styles.cta}>
          View Details
        </Link>
      </div>
    </div>
  );
}
