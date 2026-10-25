"use client";

import { Wallet, Lock, ShieldCheck, TrendingUp } from "lucide-react";
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
  const totalValue = (data?.availableBalance || 0) + (data?.lockedBalance || 0);

  const summaryCards = [
    {
      label: "Available Funds",
      value: `SAR ${(data?.availableBalance || 0).toLocaleString()}`,
      icon: <Wallet size={18} color="#059669" />,
      highlight: true,
      description: isPartner
        ? "Settled revenue ready for payout"
        : "Ready to invest or withdraw",
    },
    {
      label: isPartner ? "Escrow (Incoming)" : "Locked (Escrow)",
      value: `SAR ${(data?.lockedBalance || 0).toLocaleString()}`,
      icon: <Lock size={18} color="#d97706" />,
      highlight: false,
      isLocked: true,
      description: isPartner
        ? "Awaiting trade settlement"
        : "Secured in active trades",
    },
    {
      label: isPartner ? "Account Liquidity" : "Total Portfolio",
      value: `SAR ${totalValue.toLocaleString()}`,
      icon: <ShieldCheck size={18} color="#059669" />,
      highlight: false,
      description: "Combined value across all states",
    },
    {
      label: isPartner ? "Total Revenue" : "Total Earned",
      value: `SAR ${(data?.totalEarned || 0).toLocaleString()}`,
      icon: <TrendingUp size={18} color="#059669" />,
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
          <div className={styles.cardTopRow}>
            <span className={styles.label}>{card.label}</span>
            <div className={styles.cardIcon}>{card.icon}</div>
          </div>
          <strong className={styles.value}>{card.value}</strong>
          <small className={styles.cardDescription}>{card.description}</small>
        </div>
      ))}
    </div>
  );
}
