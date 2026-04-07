"use client";
import { FaWallet, FaLock, FaHourglassHalf, FaChartLine } from "react-icons/fa";
import styles from "./Wallet.module.css";

interface WalletSummaryProps {
  data: {
    availableBalance: number;
    lockedBalance: number;
    pendingPayout: number;
    totalEarned: number;
    balance: number;
  };
}

export default function WalletSummary({ data }: WalletSummaryProps) {
  const summaryCards = [
    {
      label: "Available Balance",
      value: `SAR ${data.availableBalance.toLocaleString()}`,
      icon: <FaWallet />,
      highlight: true,
    },
    {
      label: "Locked (Escrow)",
      value: `SAR ${data.lockedBalance.toLocaleString()}`,
      icon: <FaLock />,
      highlight: false,
    },
    {
      label: "Pending Payouts",
      value: `SAR ${data.pendingPayout.toLocaleString()}`,
      icon: <FaHourglassHalf />,
      highlight: false,
    },
    {
      label: "Total Earned",
      value: `SAR ${data.totalEarned.toLocaleString()}`,
      icon: <FaChartLine />,
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
