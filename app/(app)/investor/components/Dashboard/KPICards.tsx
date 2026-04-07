"use client";

import { useEffect, useState } from "react";
import { FaWallet, FaCoins, FaChartLine, FaChartPie } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";

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

  if (!data) return <p className={styles.loading}>Loading Market Data...</p>;

  // Mapping Backend Data to Premium Cards
  const cards = [
    {
      title: "Wallet Balance",
      value: `SAR ${Number(data.walletBalance).toLocaleString()}`,
      icon: <FaWallet />,
    },
    {
      title: "Portfolio Value",
      value: `SAR ${Number(data.portfolioValue).toLocaleString()}`,
      icon: <FaCoins />,
    },
    {
      title: "Total Profit",
      value: `SAR ${Number(data.totalProfit).toLocaleString()}`,
      // Conditional styling for profit visibility
      className: data.totalProfit > 0 ? styles.positiveProfit : "",
      icon: <FaChartLine />,
    },
    {
      title: "Active Investments",
      value: data.activeInvestments,
      icon: <FaChartPie />,
    },
  ];

  return (
    <div className={styles.kpiCards}>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${styles.kpiCard} ${card.className || ""}`}
        >
          <div className={styles.icon}>{card.icon}</div>
          <div className={styles.kpiText}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
