"use client";

import styles from "./styles/InvestorKPI.module.css";

const kpis = [
  {
    label: "Total Investors",
    value: "452",
    sub: "+12 this month",
  },
  {
    label: "Total Invested",
    value: "SAR 5.2M",
    sub: "Across all assets",
  },
  {
    label: "Pending Withdrawals",
    value: "18",
    sub: "Requires approval",
  },
  {
    label: "Avg ROI",
    value: "9.8%",
    sub: "Projected",
  },
];

export default function InvestorKPI() {
  return (
    <div className={styles.kpiGrid}>
      {kpis.map((kpi, i) => (
        <div key={i} className={styles.card}>
          <span className={styles.label}>{kpi.label}</span>
          <h3 className={styles.value}>{kpi.value}</h3>
          <span className={styles.sub}>{kpi.sub}</span>
        </div>
      ))}
    </div>
  );
}
