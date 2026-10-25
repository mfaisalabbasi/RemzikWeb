"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/app/integrations/api/investor";
import styles from "./Portfolio.module.css";
import { TrendingUp, Wallet, PieChart } from "lucide-react";

export default function PortfolioSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  if (loading) {
    return (
      <div className={styles.summarySkeleton}>Syncing Portfolio Metrics...</div>
    );
  }
  if (!data) return null;

  const currentValue = Number(data.portfolioValue || 0);
  const profit = Number(data.totalProfit || 0);
  const totalInvested = currentValue - profit;
  const isPositive = profit >= 0;

  const metrics = [
    {
      label: "Total Invested",
      value: `SAR ${totalInvested.toLocaleString()}`,
      icon: <Wallet size={16} color="#059669" />,
    },
    {
      label: "Current Value",
      value: `SAR ${currentValue.toLocaleString()}`,
      icon: <PieChart size={16} color="#059669" />,
    },
    {
      label: "Profit / Loss",
      value: `${isPositive ? "+" : "-"} SAR ${Math.abs(profit).toLocaleString()}`,
      highlight: true,
      positive: isPositive,
      icon: <TrendingUp size={16} color={isPositive ? "#059669" : "#dc2626"} />,
    },
  ];

  return (
    <section className={styles.summarySection}>
      <div className={styles.summaryHeader}>
        <div>
          <h3 className={styles.summaryTitle}>Portfolio Summary</h3>
          <span className={styles.summarySub}>
            Real-time snapshot of your capital performance & asset allocation
          </span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricLabelRow}>
              {metric.icon}
              <span className={styles.metricLabel}>{metric.label}</span>
            </div>
            <span
              className={styles.metricValue}
              style={{
                color: metric.highlight
                  ? metric.positive
                    ? "#059669"
                    : "#dc2626"
                  : "#0f172a",
              }}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
