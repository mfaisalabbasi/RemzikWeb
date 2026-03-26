"use client";

import { useEffect, useState } from "react";
import { FaDollarSign, FaChartLine, FaCoins } from "react-icons/fa";
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
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className={styles.portfolioCard}>
      <h3 className={styles.sectionTitle}>Portfolio Snapshot</h3>

      {/* CHART PLACEHOLDER (future ready) */}
      <div className={styles.chartWrapper}>
        <div className={styles.chartPlaceholder}>Chart coming soon</div>
      </div>

      <div className={styles.portfolioMetrics}>
        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Total Invested</p>
          <p className={styles.metricValue}>
            <FaCoins className={styles.metricIcon} />$
            {Number(data.totalInvested).toLocaleString()}
          </p>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Current Value</p>
          <p className={styles.metricValue}>
            <FaChartLine className={styles.metricIcon} />$
            {Number(data.currentValue).toLocaleString()}
          </p>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Profit / Loss</p>
          <p
            className={
              data.profit >= 0
                ? styles.metricValueHighlight
                : styles.metricValueNegative
            }
          >
            <FaDollarSign
              className={
                data.profit >= 0
                  ? styles.metricIconHighlight
                  : styles.metricIconNegative
              }
            />
            {data.profit >= 0 ? "+" : "-"}$
            {Math.abs(data.profit).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
