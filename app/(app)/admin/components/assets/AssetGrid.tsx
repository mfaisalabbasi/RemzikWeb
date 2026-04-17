import Link from "next/link";
import styles from "./assets.module.css";
import { ActionBar } from "./Actionbar";

export const AssetGrid = () => (
  <div className={styles.card}>
    <h3 style={{ marginBottom: "1rem" }}>Asset Directory</h3>
    <ActionBar />
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Asset ID</th>
            <th>Type</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>RWA-9921</strong>
            </td>
            <td>Real Estate</td>
            <td>12.5M SAR</td>
            <td style={{ textAlign: "right" }}>
              <Link
                href="/admin/assets/RWA-9921"
                style={{ color: "#2563eb", fontWeight: 600 }}
              >
                Manage
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
