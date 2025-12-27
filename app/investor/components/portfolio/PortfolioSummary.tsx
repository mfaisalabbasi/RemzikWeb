import styles from "./Portfolio.module.css";

export default function PortfolioSummary() {
  return (
    <div className={styles.summary}>
      <div className={styles.card}>
        <span>Total Invested</span>
        <strong>SAR 120,000</strong>
      </div>
      <div className={styles.card}>
        <span>Active Investments</span>
        <strong>6</strong>
      </div>
      <div className={styles.card}>
        <span>Profit Earned</span>
        <strong>SAR 18,400</strong>
      </div>
      <div className={styles.card}>
        <span>Wallet Balance</span>
        <strong>SAR 12,500</strong>
      </div>
    </div>
  );
}
