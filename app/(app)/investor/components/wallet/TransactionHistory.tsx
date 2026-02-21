"use client";
import { FaArrowDown, FaArrowUp, FaCoins } from "react-icons/fa";
import styles from "./Wallet.module.css";

const transactions = [
  {
    date: "25 Dec 2025",
    type: "Deposit",
    amount: "10,000",
    status: "Completed",
  },
  {
    date: "22 Dec 2025",
    type: "Withdrawal",
    amount: "5,000",
    status: "Pending",
  },
  { date: "18 Dec 2025", type: "Profit", amount: "1,200", status: "Credited" },
];

export default function TransactionHistory() {
  const getIcon = (type: string) => {
    if (type === "Deposit")
      return <FaArrowDown className={styles.txIconDeposit} />;
    if (type === "Withdrawal")
      return <FaArrowUp className={styles.txIconWithdraw} />;
    return <FaCoins className={styles.txIconProfit} />;
  };

  return (
    <div className={styles.transactions}>
      <h2>Recent Transactions</h2>

      {/* Desktop Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount (SAR)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>{tx.date}</td>
                <td className={styles.typeCell}>
                  {getIcon(tx.type)} {tx.type}
                </td>
                <td>{tx.amount}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className={styles.mobileTransactions}>
        {transactions.map((tx, idx) => (
          <div key={idx} className={styles.txCard}>
            <div className={styles.txHeader}>
              <span>{tx.date}</span>
              <span className={styles.status}>{tx.status}</span>
            </div>
            <div className={styles.txBody}>
              <div className={styles.txType}>
                {getIcon(tx.type)} {tx.type}
              </div>
              <div className={styles.txAmount}>SAR {tx.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
