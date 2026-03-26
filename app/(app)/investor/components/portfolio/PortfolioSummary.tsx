"use client";

import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css";
import { getPortfolio } from "@/app/integrations/api/investor";

export default function PortfolioSummary() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPortfolio();
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!data) return null;

  const metrics = [
    {
      label: "Total Invested",
      value: `$${Number(data.totalInvested).toLocaleString()}`,
    },
    {
      label: "Current Value",
      value: `$${Number(data.currentValue).toLocaleString()}`,
    },
    {
      label: "Profit / Loss",
      value: `${data.profit >= 0 ? "+" : "-"}$${Math.abs(
        data.profit,
      ).toLocaleString()}`,
      highlight: true,
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
                  ? styles.metricValueHighlight
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
