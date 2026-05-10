"use client";
import { FaWallet, FaLock, FaChartLine, FaShieldAlt } from "react-icons/fa";
import styles from "./Wallet.module.css";

interface WalletSummaryProps {
  data: {
    availableBalance: number;
    lockedBalance: number;
    pendingPayout: number;
    totalEarned: number;
    balance: number;
  };
  role?: "INVESTOR" | "PARTNER";
}

export default function WalletSummary({
  data,
  role = "INVESTOR",
}: WalletSummaryProps) {
  const isPartner = role === "PARTNER";

  const totalValue = data.availableBalance + data.lockedBalance;

  const summaryCards = [
    {
      label: "Available Funds",
      value: `SAR ${data.availableBalance.toLocaleString()}`,
      icon: <FaWallet />,
      highlight: true,
      description: isPartner
        ? "Settled revenue ready for payout"
        : "Ready to invest or withdraw",
    },
    {
      label: isPartner ? "Escrow (Incoming)" : "Locked (Escrow)",
      value: `SAR ${data.lockedBalance.toLocaleString()}`,
      icon: <FaLock />,
      highlight: false,
      isLocked: true,
      description: isPartner
        ? "Awaiting trade settlement"
        : "Secured in active trades",
    },
    {
      label: isPartner ? "Account Liquidity" : "Total Portfolio",
      value: `SAR ${totalValue.toLocaleString()}`,
      icon: <FaShieldAlt />,
      highlight: false,
      description: "Combined value across all states",
    },
    {
      label: isPartner ? "Total Revenue" : "Total Earned",
      value: `SAR ${data.totalEarned.toLocaleString()}`,
      icon: <FaChartLine />,
      highlight: false,
      description: isPartner
        ? "Lifetime asset sales & yield"
        : "Lifetime returns & profit",
    },
  ];

  return (
    <div className={styles.summary}>
      {summaryCards.map((card, idx) => (
        <div
          key={idx}
          className={`${styles.card} ${card.highlight ? styles.highlightCard : ""} ${card.isLocked ? styles.lockedCard : ""}`}
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
