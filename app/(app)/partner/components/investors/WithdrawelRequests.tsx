"use client";

import styles from "./styles/WithdrawalRequests.module.css";

const mockWithdrawals = [
  { asset: "Riyadh Tower", amount: 10000, status: "Pending" },
  { asset: "Jeddah Commercial Hub", amount: 25000, status: "Completed" },
];

export default function Withdrawals() {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Withdrawal Requests</h3>
      <div className={styles.list}>
        {mockWithdrawals.map((w, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.asset}>{w.asset}</span>
            <span className={styles.amount}>
              SAR {w.amount.toLocaleString()}
            </span>
            <span
              className={`${styles.status} ${styles[w.status.toLowerCase()]}`}
            >
              {w.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
