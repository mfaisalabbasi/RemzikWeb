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
        return { label: "Sale Proceeds", icon: <FaCoins />, color: "#008435" };
      case "DISTRIBUTION_ENGINE":
        return { label: "Rental Yield", icon: <FaCoins />, color: "#008435" };
      case "WITHDRAWAL":
      case "PAYOUT_COMPLETED":
        return { label: "Payout", icon: <FaArrowUp />, color: "#e74c3c" };
      case "WALLET_DEPOSIT":
        return { label: "Deposit", icon: <FaArrowDown />, color: "#008435" };
      case "ASSET_INVESTMENT":
        return {
          label: "Investment",
          icon: <FaShoppingCart />,
          color: "#f39c12",
        };
      default:
        return { label: "Ledger Sync", icon: <FaTools />, color: "#95a5a6" };
    }
  };

  return (
    <div className={styles.transactions}>
      <h2 className={styles.sectionTitle}>
        {isPartner ? "Financial Statement" : "Recent Transactions"}
      </h2>
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
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className={styles.typeCell}>
                      <span
                        style={{ color: details.color, marginRight: "8px" }}
                      >
                        {details.icon}
                      </span>
                      {details.label}
                    </td>
                    <td className={styles.noteCell}>{tx.note || "-"}</td>
                    <td
                      className={isNegative ? styles.negative : styles.positive}
                    >
                      {isNegative ? "-" : "+"}
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
                  style={{ textAlign: "center", padding: "3rem" }}
                >
                  No activity recorded on ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
