import styles from "./assets.module.css";
export const MarketActivityLog = () => (
  <div className={styles.card}>
    <h3>Market Activity</h3>
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>User/Partner</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primary Buy</td>
            <td>Investor #4412</td>
            <td>50,000 SAR</td>
          </tr>
          <tr>
            <td>Price Update</td>
            <td>Oracle Node</td>
            <td>12.6M SAR</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
