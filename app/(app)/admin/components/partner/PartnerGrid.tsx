import Link from "next/link";
import styles from "./partner.module.css";
import { ActionBar } from "./ActionBar";

export const PartnerGrid = () => (
  <div className={styles.card}>
    <h3 style={{ marginBottom: "1.5rem" }}>Active Partners</h3>
    <ActionBar />
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Total Assets</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Global Real Estate Corp</strong>
            </td>
            <td>45.2M SAR</td>
            <td>
              <span className={styles.pillApproved}>Connected</span>
            </td>
            <td style={{ textAlign: "right" }}>
              <Link
                href="/admin/partner/PRT-7721"
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
