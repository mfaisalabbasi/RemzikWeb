import styles from "./partner.module.css";

export const AssetOriginationLedger = ({ id }: { id: string }) => (
  <div className={styles.card}>
    <h3>Asset Origination Ledger</h3>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Asset ID</th>
          <th>Type</th>
          <th>Status</th>
          <th>Value (SAR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ASSET-8821</td>
          <td>Real Estate</td>
          <td>
            <span
              className={styles.pill}
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              Pending
            </span>
          </td>
          <td>12.5M</td>
        </tr>
      </tbody>
    </table>
  </div>
);
