import styles from "./Portfolio.module.css";

export default function InvestmentCard() {
  return (
    <div className={styles.cardItem}>
      <h3>Riyadh Commercial Property</h3>
      <p>
        Invested: <strong>SAR 20,000</strong>
      </p>
      <p>
        ROI: <strong>14%</strong> | Tenure: <strong>12 Months</strong>
      </p>
      <p>
        Status: <strong>Active</strong>
      </p>
    </div>
  );
}
