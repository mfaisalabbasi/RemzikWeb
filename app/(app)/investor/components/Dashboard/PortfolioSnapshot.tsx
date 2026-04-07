"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaCoins, FaExchangeAlt } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";

export default function PortfolioSnapshot() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setData(res);
      } catch (err) {
        console.error("Portfolio Snapshot Fetch Error:", err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p className={styles.loading}>Syncing Portfolio...</p>;

  // Ensure we handle potential null/undefined from backend
  const totalInvested = Number(data.portfolioValue) - Number(data.totalProfit);
  const currentValue = Number(data.portfolioValue);
  const profit = Number(data.totalProfit);
  const isPositive = profit >= 0;

  return (
    <div className={styles.portfolioCard}>
      <h3 className={styles.sectionTitle}>Portfolio Snapshot</h3>

      {/* CHART PLACEHOLDER (Institutional Grey/Green Gradient ready) */}
      <div className={styles.chartWrapper}>
        <div className={styles.chartPlaceholder}>
          <FaChartLine
            style={{ fontSize: "2rem", marginBottom: "10px", opacity: 0.2 }}
          />
          <p>Real-time Growth Chart Coming Soon</p>
        </div>
      </div>

      <div className={styles.portfolioMetrics}>
        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Total Invested</p>
          <div className={styles.metricValue}>
            <FaCoins className={styles.metricIcon} />
            <span>SAR {totalInvested.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Current Value</p>
          <div className={styles.metricValue}>
            <FaExchangeAlt className={styles.metricIcon} />
            <span>SAR {currentValue.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Profit / Loss</p>
          <div
            className={
              isPositive
                ? styles.metricValueHighlight
                : styles.metricValueNegative
            }
          >
            <FaChartLine
              className={
                isPositive
                  ? styles.metricIconHighlight
                  : styles.metricIconNegative
              }
            />
            <span>
              {isPositive ? "+" : "-"} SAR {Math.abs(profit).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
