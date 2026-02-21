"use client";
import { FaWallet, FaArrowDown, FaArrowUp } from "react-icons/fa";
import styles from "./Wallet.module.css";

export default function WalletSummary() {
  const summaryCards = [
    {
      label: "Current Balance",
      value: "SAR 12,500",
      icon: <FaWallet />,
      highlight: true,
    },
    {
      label: "Total Deposits",
      value: "SAR 120,000",
      icon: <FaArrowDown />,
      highlight: false,
    },
    {
      label: "Total Withdrawals",
      value: "SAR 45,000",
      icon: <FaArrowUp />,
      highlight: false,
    },
  ];

  return (
    <div className={styles.summary}>
      {summaryCards.map((card, idx) => (
        <div
          key={idx}
          className={`${styles.card} ${
            card.highlight ? styles.highlightCard : ""
          }`}
        >
          <div className={styles.cardIcon}>{card.icon}</div>
          <div className={styles.cardText}>
            <span className={styles.label}>{card.label}</span>
            <strong className={styles.value}>{card.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
