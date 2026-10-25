"use client";

import { useEffect, useState } from "react";
import { FaWallet, FaCoins, FaChartLine, FaChartPie } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";
import { Loader2 } from "lucide-react";

export default function KPICards() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setData(res);
      } catch (err) {
        console.error("KPI Fetch Error:", err);
      }
    };

    fetchStats();
  }, []);

  if (!data) {
    return (
      <div className={styles.kpiLoading}>
        <Loader2 className="animate-spin text-emerald-400" size={20} />
        <span>Synchronizing Market Positions...</span>
      </div>
    );
  }

  const cards = [
    {
      title: "Wallet Liquidity",
      value: `SAR ${Number(data.walletBalance || 0).toLocaleString()}`,
      change: "Available for deployment",
      icon: <FaWallet />,
      accent: "emerald",
    },
    {
      title: "Gross Portfolio Value",
      value: `SAR ${Number(data.portfolioValue || 0).toLocaleString()}`,
      change: "Tokenized RWA Assets",
      icon: <FaCoins />,
      accent: "gold",
    },
    {
      title: "Cumulative Yield Profit",
      value: `SAR ${Number(data.totalProfit || 0).toLocaleString()}`,
      change:
        Number(data.totalProfit) >= 0 ? "+All-time Returns" : "Net Drawdown",
      className:
        Number(data.totalProfit) >= 0
          ? styles.positiveProfit
          : styles.negativeProfit,
      icon: <FaChartLine />,
      accent: "blue",
    },
    {
      title: "Active Asset Pods",
      value: data.activeInvestments || 0,
      change: "Diversified Holdings",
      icon: <FaChartPie />,
      accent: "purple",
    },
  ];

  return (
    <div className={styles.kpiCards}>
      {cards.map((card, idx) => (
        <div key={idx} className={`${styles.kpiCard} ${card.className || ""}`}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiTitle}>{card.title}</span>
            <div className={`${styles.iconBox} ${styles[card.accent]}`}>
              {card.icon}
            </div>
          </div>
          <div className={styles.kpiBody}>
            <h2 className={styles.kpiValue}>{card.value}</h2>
            <span className={styles.kpiSubtext}>{card.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
