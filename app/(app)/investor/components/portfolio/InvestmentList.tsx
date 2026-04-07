"use client";

import { useEffect, useState } from "react";
import InvestmentCard from "./InvestmentCard";
import styles from "./Portfolio.module.css";

export default function InvestmentList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investors/profile`,
          { credentials: "include" },
        );
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Ledger Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className={styles.shimmer}>Loading Remzik Ledger...</div>;

  const investments = data?.investments || [];

  return (
    <div className={styles.portfolioWrapper}>
      {/* PROFESSIONAL SUMMARY BAR */}
      <header className={styles.dashboardHeader}>
        <div className={styles.mainTitle}>
          <h1>
            Portfolio <span className={styles.accent}>Overview</span>
          </h1>
          <p>Institutional grade asset management</p>
        </div>

        <div className={styles.summaryRibbon}>
          <div className={styles.statItem}>
            <label>Total Invested</label>
            <div className={styles.statValue}>
              SAR {Number(data?.totalInvested || 0).toLocaleString()}
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <label>Portfolio Value</label>
            <div className={`${styles.statValue} ${styles.growth}`}>
              SAR {Number(data?.portfolioValue || 0).toLocaleString()}
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <label>Active Assets</label>
            <div className={styles.statValue}>{investments.length}</div>
          </div>
        </div>
      </header>

      <div className={styles.assetGrid}>
        {investments.map((inv: any) => (
          <InvestmentCard key={inv.id} investment={inv} />
        ))}
      </div>
    </div>
  );
}
