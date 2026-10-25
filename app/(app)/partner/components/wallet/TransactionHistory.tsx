"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import styles from "./Wallet.module.css";

interface LedgerEntry {
  id: string;
  amount: number;
  source: string;
  type: string;
  createdAt: string;
  note?: string;
}

export default function TransactionHistory({
  data = [],
  role = "INVESTOR",
}: {
  data: LedgerEntry[];
  role?: string;
}) {
  const isPartner = role === "PARTNER";

  const getTxDetails = (source: string) => {
    switch (source) {
      case "SECONDARY_SALE":
      case "ASSET_REVENUE":
        return {
          label: "Sale Proceeds",
          icon: <Coins size={15} color="#059669" />,
        };
      case "DISTRIBUTION_ENGINE":
        return {
          label: "Rental Yield",
          icon: <Coins size={15} color="#059669" />,
        };
      case "WITHDRAWAL":
      case "PAYOUT_COMPLETED":
        return {
          label: "Payout",
          icon: <ArrowUpRight size={15} color="#dc2626" />,
        };
      case "WALLET_DEPOSIT":
        return {
          label: "Deposit",
          icon: <ArrowDownLeft size={15} color="#059669" />,
        };
      case "ASSET_INVESTMENT":
        return {
          label: "Investment",
          icon: <ShoppingBag size={15} color="#d97706" />,
        };
      default:
        return {
          label: "Ledger Sync",
          icon: <Wrench size={15} color="#64748b" />,
        };
    }
  };

  return (
    <div className={styles.transactions}>
      <div className={styles.tableHeaderRow}>
        <h2 className={styles.sectionTitle}>
          {isPartner ? "Financial Statement" : "Recent Transactions"}
        </h2>
        <span className={styles.tableCount}>{data.length} Entries</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Note</th>
              <th>Amount (SAR)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((tx) => {
                const details = getTxDetails(tx.source);
                const isNegative = Number(tx.amount) < 0;
                return (
                  <tr key={tx.id}>
                    <td>
                      {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className={styles.typeCell}>
                      <span className={styles.txIconWrapper}>
                        {details.icon}
                      </span>
                      {details.label}
                    </td>
                    <td className={styles.noteCell}>{tx.note || "-"}</td>
                    <td
                      className={isNegative ? styles.negative : styles.positive}
                    >
                      {isNegative ? "-" : "+"}{" "}
                      {Math.abs(Number(tx.amount)).toLocaleString()}
                    </td>
                    <td>
                      <span className={styles.statusBadge}>Verified</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#64748b",
                  }}
                >
                  No financial activity recorded on ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
