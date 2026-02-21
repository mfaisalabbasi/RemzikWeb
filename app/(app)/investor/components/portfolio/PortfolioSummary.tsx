"use client";

import styles from "./Portfolio.module.css";

interface Metric {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function PortfolioSummary() {
  const metrics: Metric[] = [
    { label: "Total Invested", value: "$85,000" },
    { label: "Current Value", value: "$120,500" },
    { label: "Profit / Loss", value: "+$35,500", highlight: true },
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
