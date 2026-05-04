"use client";
import {
  FaWallet,
  FaLock,
  FaHourglassHalf,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import styles from "./Wallet.module.css";

interface WalletSummaryProps {
  data: {
    availableBalance: number;
    lockedBalance: number; // Linked to Escrow Module
    pendingPayout: number;
    totalEarned: number;
    balance: number;
  };
}

export default function WalletSummary({ data }: WalletSummaryProps) {
  // Logic: Total Portfolio = Liquid Cash + Locked Escrow
  const totalPortfolioValue = data.availableBalance + data.lockedBalance;

  const summaryCards = [
    {
      label: "Available Balance",
      value: `SAR ${data.availableBalance.toLocaleString()}`,
      icon: <FaWallet />,
      highlight: true,
      description: "Ready to invest or withdraw",
    },
    {
      label: "Locked (Escrow)",
      value: `SAR ${data.lockedBalance.toLocaleString()}`,
      icon: <FaLock />,
      highlight: false,
      isLocked: true, // For conditional styling
      description: "Secured in active trades",
    },
    {
      label: "Total Portfolio",
      value: `SAR ${totalPortfolioValue.toLocaleString()}`,
      icon: <FaShieldAlt />,
      highlight: false,
      description: "Your combined asset value",
    },
    {
      label: "Total Earned",
      value: `SAR ${data.totalEarned.toLocaleString()}`,
      icon: <FaChartLine />,
      highlight: false,
      description: "Life-time rental yield & profit",
    },
  ];

  return (
    <div className={styles.summary}>
      {summaryCards.map((card, idx) => (
        <div
          key={idx}
          className={`${styles.card} ${
            card.highlight ? styles.highlightCard : ""
          } ${card.isLocked ? styles.lockedCard : ""}`}
        >
          <div className={styles.cardIcon}>{card.icon}</div>
          <div className={styles.cardText}>
            <span className={styles.label}>{card.label}</span>
            <strong className={styles.value}>{card.value}</strong>
            <small className={styles.cardDescription}>{card.description}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
