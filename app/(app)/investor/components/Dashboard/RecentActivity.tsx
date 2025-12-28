"use client";

import styles from "@/app/(app)/investor/styles/RecentActivity.module.css";

const transactions = [
  { date: "2025-12-20", type: "Investment", amount: "$10,000" },
  { date: "2025-12-22", type: "Profit Payout", amount: "$750" },
  { date: "2025-12-25", type: "Withdrawal", amount: "$5,000" },
];

export default function RecentActivity() {
  return (
    <div className={styles.recent}>
      <h3>Recent Activity</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
