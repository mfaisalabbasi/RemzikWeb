import styles from "./Wallet.module.css";

export default function WalletSummary() {
  return (
    <div className={styles.summary}>
      <div className={styles.card}>
        <span>Current Balance</span>
        <strong>SAR 12,500</strong>
      </div>
      <div className={styles.card}>
        <span>Total Deposits</span>
        <strong>SAR 120,000</strong>
      </div>
      <div className={styles.card}>
        <span>Total Withdrawals</span>
        <strong>SAR 45,000</strong>
      </div>
    </div>
  );
}
