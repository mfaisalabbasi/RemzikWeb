"use client";
import {
  FaArrowDown,
  FaArrowUp,
  FaCoins,
  FaTools,
  FaShoppingCart,
} from "react-icons/fa";
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
}: {
  data: LedgerEntry[];
}) {
  const getTxDetails = (source: string) => {
    switch (source) {
      case "DISTRIBUTION_ENGINE":
        return {
          label: "Profit",
          icon: <FaCoins style={{ color: "#059669" }} />,
          color: "#059669",
        };
      case "PAYOUT_REQUEST":
      case "PAYOUT_COMPLETED":
      case "WITHDRAWAL":
        return {
          label: "Withdrawal",
          icon: <FaArrowUp style={{ color: "#dc2626" }} />,
          color: "#dc2626",
        };
      case "INVESTMENT_CONFIRMATION":
      case "WALLET_DEPOSIT":
        return {
          label: "Deposit",
          icon: <FaArrowDown style={{ color: "#059669" }} />,
          color: "#059669",
        };
      case "ASSET_INVESTMENT":
        return {
          label: "Investment",
          icon: <FaShoppingCart style={{ color: "#d97706" }} />,
          color: "#d97706",
        };
      case "ESCROW_LOCK":
        return {
          label: "Escrow Lock",
          icon: <FaTools style={{ color: "#64748b" }} />,
          color: "#64748b",
        };
      default:
        return {
          label: "Adjustment",
          icon: <FaTools style={{ color: "#64748b" }} />,
          color: "#64748b",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={styles.transactions}>
      <h2 className={styles.sectionTitle}>Recent Transactions</h2>

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
                    <td>{formatDate(tx.createdAt)}</td>
                    <td className={styles.typeCell}>
                      <span style={{ marginRight: "4px" }}>{details.icon}</span>
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
                      <span className={styles.statusBadge}>Completed</span>
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
                  No transactions found in your Remzic ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
