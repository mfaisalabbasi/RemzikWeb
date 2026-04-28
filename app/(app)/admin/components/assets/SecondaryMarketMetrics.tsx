"use client";
import React, { useEffect, useState } from "react";
import styles from "./assets.module.css";
import { BarChart3, ArrowUpRight, Zap, RefreshCw } from "lucide-react";

interface SecondaryMetricsProps {
  assetId: string;
}

export const SecondaryMarketMetrics = ({ assetId }: SecondaryMetricsProps) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecondaryData = async () => {
      try {
        // Assuming your secondary module has a stats endpoint per asset
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary/stats/${assetId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Secondary Market Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) fetchSecondaryData();
  }, [assetId]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderInline}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BarChart3 size={18} color="#8b5cf6" />
          <h3 className={styles.cardTitle}>Secondary Market</h3>
        </div>
        <div className={styles.activeBadge}>
          <Zap size={10} fill="#8b5cf6" /> TRADING
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingCenter}>
          <RefreshCw size={20} className={styles.spin} />
        </div>
      ) : (
        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Floor Price</span>
            <div className={styles.metricValue}>
              {metrics?.floorPrice || "1,250"} <small>SAR</small>
            </div>
            <span className={styles.metricTrend}>
              <ArrowUpRight size={12} /> +2.4%
            </span>
          </div>

          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>24h Volume</span>
            <div className={styles.metricValue}>
              {metrics?.volume24h?.toLocaleString() || "450,000"}{" "}
              <small>SAR</small>
            </div>
          </div>

          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Liquidity Depth</span>
            <div className={styles.liquidityBar}>
              <div
                className={styles.liquidityFill}
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
