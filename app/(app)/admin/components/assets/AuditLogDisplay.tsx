import styles from "./assets.module.css";

export const AuditLogDisplay = () => (
  <div className={styles.card}>
    <h3>System Audit Trail</h3>
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026-04-17</td>
            <td>TOKENIZE</td>
            <td>Faisal</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
