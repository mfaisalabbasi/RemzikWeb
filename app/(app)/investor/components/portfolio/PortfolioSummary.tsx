"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/app/integrations/api/investor";

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
      <div style={{ padding: "20px", color: "#64748b", fontSize: "0.9rem" }}>
        Syncing Portfolio Metrics...
      </div>
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
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "32px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Portfolio Summary
        </h3>
        <span
          style={{
            fontSize: "0.825rem",
            color: "#64748b",
            marginTop: "4px",
            display: "block",
          }}
        >
          Real-time snapshot of your capital performance & asset allocation
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              {metric.label}
            </span>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
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
