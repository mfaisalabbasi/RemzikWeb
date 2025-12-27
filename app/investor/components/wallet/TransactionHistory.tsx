import styles from "./Wallet.module.css";

export default function TransactionHistory() {
  return (
    <div className={styles.transactions}>
      <h2>Recent Transactions</h2>
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
          <tr>
            <td>25 Dec 2025</td>
            <td>Deposit</td>
            <td>10,000</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>22 Dec 2025</td>
            <td>Withdrawal</td>
            <td>5,000</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>18 Dec 2025</td>
            <td>Profit</td>
            <td>1,200</td>
            <td>Credited</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
