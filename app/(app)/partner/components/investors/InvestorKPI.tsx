"use client";

import styles from "./styles/InvestorKPI.module.css";
import { Users, Wallet, Clock, TrendingUp } from "lucide-react";

const kpis = [
  {
    label: "Total Investors",
    value: "452",
    sub: "+12 this month",
    icon: <Users size={18} color="#059669" />,
  },
  {
    label: "Total Invested",
    value: "SAR 5.2M",
    sub: "Across all assets",
    icon: <Wallet size={18} color="#059669" />,
  },
  {
    label: "Pending Withdrawals",
    value: "18",
    sub: "Requires approval",
    icon: <Clock size={18} color="#d97706" />,
  },
  {
    label: "Avg ROI",
    value: "9.8%",
    sub: "Projected APY",
    icon: <TrendingUp size={18} color="#059669" />,
  },
];

export default function InvestorKPI() {
  return (
    <div className={styles.kpiGrid}>
      {kpis.map((kpi, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.kpiTopRow}>
            <span className={styles.label}>{kpi.label}</span>
            <div className={styles.iconBox}>{kpi.icon}</div>
          </div>
          <h3 className={styles.value}>{kpi.value}</h3>
          <span className={styles.sub}>{kpi.sub}</span>
        </div>
      ))}
    </div>
  );
}
