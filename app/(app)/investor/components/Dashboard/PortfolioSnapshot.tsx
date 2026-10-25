"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaCoins, FaExchangeAlt } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import { getDashboardStats } from "@/app/integrations/api/investor";
import { Loader2, TrendingUp, Shield } from "lucide-react";

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

  if (!data) {
    return (
      <div className={styles.portfolioCard}>
        <div className={styles.loadingCell}>
          <Loader2 className="animate-spin text-emerald-400" size={24} />
          <span>Syncing Portfolio Ledger...</span>
        </div>
      </div>
    );
  }

  const totalInvested =
    Number(data.portfolioValue || 0) - Number(data.totalProfit || 0);
  const currentValue = Number(data.portfolioValue || 0);
  const profit = Number(data.totalProfit || 0);
  const isPositive = profit >= 0;

  return (
    <div className={styles.portfolioCard}>
      <div className={styles.portfolioHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Portfolio Snapshot</h3>
          <p className={styles.sectionSub}>
            Asset allocation & aggregate performance metrics
          </p>
        </div>
        <div className={styles.assetClassTag}>
          <Shield size={12} className="text-emerald-400" /> Real Estate RWA
        </div>
      </div>

      {/* INSTITUTIONAL CHART VISUALIZATION */}
      <div className={styles.chartWrapper}>
        <div className={styles.chartVisualOverlay}>
          <div className={styles.chartHeaderStats}>
            <span>Growth Trajectory</span>
            <span className={styles.growthBadge}>
              <TrendingUp size={12} /> Live Feed
            </span>
          </div>
          {/* Stylized CSS wave graph representation */}
          <div className={styles.mockWaveGraph}>
            <div className={styles.waveLine} />
          </div>
        </div>
      </div>

      <div className={styles.portfolioMetrics}>
        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Total Principal Invested</p>
          <div className={styles.metricValue}>
            <FaCoins className={styles.metricIconGold} />
            <span>SAR {totalInvested.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Net Liquidation Value</p>
          <div className={styles.metricValue}>
            <FaExchangeAlt className={styles.metricIconBlue} />
            <span>SAR {currentValue.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.metricItem}>
          <p className={styles.metricLabel}>Net Realized Return</p>
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
