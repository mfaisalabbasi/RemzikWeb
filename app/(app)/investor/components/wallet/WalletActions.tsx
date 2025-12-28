import styles from "./Wallet.module.css";

export default function WalletActions() {
  return (
    <div className={styles.actions}>
      <button className={styles.primary}>Deposit</button>
      <button className={styles.secondary}>Withdraw</button>
    </div>
  );
}
