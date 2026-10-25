"use client";

import { useEffect, useState } from "react";
import InvestmentCard from "./InvestmentCard";
import styles from "./Portfolio.module.css";
import { Briefcase } from "lucide-react";

export default function InvestmentList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investors/profile`,
          {
            credentials: "include",
            cache: "no-store",
          },
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
    return (
      <div className={styles.loadingState}>
        <div className={styles.loaderSpinner}></div>
        <span>Syncing Remzik Ledger...</span>
      </div>
    );

  const investments = data?.investments || [];
  const portfolioValue = Number(data?.portfolioValue || 0);
  const totalInvested = Number(data?.totalInvested || 0);
  const totalProfit = Number(
    data?.totalProfit || portfolioValue - totalInvested,
  );
  const isPositive = totalProfit >= 0;

  return (
    <div className={styles.portfolioWrapper}>
      <header className={styles.dashboardHeader}>
        <div className={styles.mainTitle}>
          <div className={styles.breadcrumb}>Remzik Protocol / Portfolio</div>
          <h1>
            Portfolio <span className={styles.accent}>Overview</span>
          </h1>
          <p>Institutional grade asset management & performance telemetry</p>
        </div>

        {/* Consolidated Single Metric Ribbon with Profit / Loss Included */}
        <div className={styles.summaryRibbon}>
          <div className={styles.statItem}>
            <label>Total Invested</label>
            <div className={styles.statValue}>
              SAR {totalInvested.toLocaleString()}
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <label>Portfolio Value</label>
            <div className={`${styles.statValue} ${styles.growth}`}>
              SAR {portfolioValue.toLocaleString()}
            </div>
          </div>

          <div className={styles.statDivider} />

          {/* Added Profit / Loss Item Directly Into Header Ribbon */}
          <div className={styles.statItem}>
            <label>Profit / Loss</label>
            <div
              className={`${styles.statValue} ${isPositive ? styles.growth : styles.loss}`}
            >
              {isPositive ? "+ " : "- "}SAR{" "}
              {Math.abs(totalProfit).toLocaleString()}
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statItem}>
            <label>Active Assets</label>
            <div className={styles.statValue}>{investments.length}</div>
          </div>
        </div>
      </header>

      <div className={styles.sectionTitleRow}>
        <Briefcase size={16} className={styles.accentIcon} />
        <h2>Tokenized Asset Vaults</h2>
      </div>

      <div className={styles.assetGrid}>
        {investments.map((inv: any) => (
          <InvestmentCard key={inv.id} investment={inv} />
        ))}
      </div>
    </div>
  );
}
