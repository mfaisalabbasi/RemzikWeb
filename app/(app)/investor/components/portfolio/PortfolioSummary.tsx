"use client";

import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css";
// We use getDashboardStats here because we know its data structure works for you
import { getDashboardStats } from "@/app/integrations/api/investor";

export default function PortfolioSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calling the same working API as the dashboard
        const res = await getDashboardStats();
        setData(res);
      } catch (err) {
        console.error("Portfolio Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className={styles.loading}>Syncing Portfolio...</div>;
  if (!data) return null;

  // --- MATCHING YOUR DASHBOARD MATH ---
  const currentValue = Number(data.portfolioValue || 0);
  const profit = Number(data.totalProfit || 0);
  const totalInvested = currentValue - profit; // This is the key logic!
  const isPositive = profit >= 0;

  const metrics = [
    {
      label: "Total Invested",
      value: `SAR ${totalInvested.toLocaleString()}`,
    },
    {
      label: "Current Value",
      value: `SAR ${currentValue.toLocaleString()}`,
    },
    {
      label: "Profit / Loss",
      value: `${isPositive ? "+" : "-"} SAR ${Math.abs(profit).toLocaleString()}`,
      highlight: true,
      positive: isPositive,
    },
  ];

  return (
    <section className={styles.summary}>
      <div className={styles.summaryHeader}>
        <h3>Portfolio Summary</h3>
        <span className={styles.summarySub}>
          Snapshot of your capital performance
        </span>
      </div>

      <div className={styles.summaryGrid}>
        {metrics.map((metric, i) => (
          <div key={i} className={styles.summaryCard}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <span
              className={
                metric.highlight
                  ? metric.positive
                    ? styles.metricValueHighlight
                    : styles.metricValueNegative
                  : styles.metricValue
              }
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
