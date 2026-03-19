"use client";

import styles from "./styles/InvestorsTable.module.css";

interface Investor {
  name: string;
  asset: string;
  invested: number;
  ownership: string;
  status: string;
}

interface Props {
  investors: Investor[];
  onSelect: (investor: Investor) => void;
}

export default function InvestorsTable({ investors, onSelect }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Investor</th>
              <th>Asset</th>
              <th>Invested</th>
              <th>Ownership</th>
              
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv, i) => (
              <tr key={i} onClick={() => onSelect(inv)} className={styles.row}>
                <td>{inv.name}</td>
                <td>{inv.asset}</td>
                <td>SAR {inv.invested.toLocaleString()}</td>
                <td>{inv.ownership}</td>
                <td>
                  <span
                    className={`${styles.status} ${styles[inv.status.toLowerCase()]}`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
