import Link from "next/link";
import styles from "./Investor.module.css";
import { ActionBar } from "./ActionBar";

export const InvestorGrid = () => (
  <div className={styles.card}>
    <ActionBar />
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Investor</th>
          <th>Status</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              href="/admin/investors/FA-99281"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Faisal A.
            </Link>
          </td>
          <td>
            <span className={styles.pillApproved}>Approved</span>
          </td>
          <td>12.5M SAR</td>
        </tr>
      </tbody>
    </table>
  </div>
);
