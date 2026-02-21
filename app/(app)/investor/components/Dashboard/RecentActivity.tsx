"use client";
import {
  FaExchangeAlt,
  FaMoneyBillWave,
  FaArrowCircleUp,
} from "react-icons/fa";
import styles from "./Dashboard.module.css";

const transactions = [
  {
    date: "2025-12-20",
    type: "Investment",
    amount: "$10,000",
    icon: <FaExchangeAlt />,
  },
  {
    date: "2025-12-22",
    type: "Profit Payout",
    amount: "$750",
    icon: <FaMoneyBillWave />,
  },
  {
    date: "2025-12-25",
    type: "Withdrawal",
    amount: "$5,000",
    icon: <FaArrowCircleUp />,
  },
];

export default function RecentActivity() {
  return (
    <div className={styles.recent}>
      <h3 className={styles.sectionTitle}>Recent Activity</h3>

      <div className={styles.recentWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>{tx.date}</td>
                <td className={styles.typeCell}>
                  <span className={styles.typeIcon}>{tx.icon}</span>
                  {tx.type}
                </td>
                <td>{tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
