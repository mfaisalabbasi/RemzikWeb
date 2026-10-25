"use client";

import styles from "./styles/InvestorsTable.module.css";
import { ShieldCheck, ChevronRight } from "lucide-react";

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
      <div className={styles.tableHeaderRow}>
        <h3>Cap Table & Participants</h3>
        <span className={styles.tableCount}>{investors.length} Registered</span>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Investor</th>
              <th>Asset Vault</th>
              <th>Invested Principal</th>
              <th>Ownership</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {investors.length > 0 ? (
              investors.map((inv, i) => (
                <tr
                  key={i}
                  onClick={() => onSelect(inv)}
                  className={styles.row}
                >
                  <td style={{ fontWeight: 700, color: "#0f172a" }}>
                    {inv.name}
                  </td>
                  <td>{inv.asset}</td>
                  <td className={styles.monoText}>
                    SAR {inv.invested.toLocaleString()}
                  </td>
                  <td className={styles.monoText}>{inv.ownership}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[inv.status.toLowerCase()] || styles.active}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <ChevronRight size={15} color="#94a3b8" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#64748b",
                  }}
                >
                  No investor participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
