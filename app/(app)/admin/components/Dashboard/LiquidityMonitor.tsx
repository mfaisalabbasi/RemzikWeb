"use client";

import React, { useEffect, useState } from "react";
import { Activity, Wallet, PieChart } from "lucide-react";
import styles from "./Dashbaord.module.css";
import { getLiquidityMonitor } from "@/app/integrations/api/admin";

export const LiquidityMonitor = () => {
  const [data, setData] = useState({
    systemOperational: 0,
    poolLiquidity: 0,
    reserveFund: 0,
    healthScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiquidity() {
      try {
        const result = await getLiquidityMonitor();
        setData(result);
      } catch (error) {
        console.error("Liquidity fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLiquidity();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className={styles.sectionContainer}>
      <h3
        style={{
          fontSize: "0.9rem",
          marginBottom: "1.5rem",
          color: "#64748b",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        LIQUIDITY MONITOR
        <span
          style={{
            color: data.healthScore > 80 ? "#059669" : "#f59e0b",
            fontSize: "0.75rem",
          }}
        >
          SCORE: {data.healthScore}%
        </span>
      </h3>

      <div className={styles.dataRow}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={16} color="#3b82f6" />
          <span style={{ fontSize: "0.85rem" }}>System Ops</span>
        </div>
        <span style={{ fontWeight: 700 }}>
          {formatCurrency(data.systemOperational)}
        </span>
      </div>

      <div className={styles.dataRow}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PieChart size={16} color="#8b5cf6" />
          <span style={{ fontSize: "0.85rem" }}>Pool Liquidity</span>
        </div>
        <span style={{ fontWeight: 700 }}>
          {formatCurrency(data.poolLiquidity)}
        </span>
      </div>

      <div className={styles.dataRow}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Wallet size={16} color="#10b981" />
          <span style={{ fontSize: "0.85rem" }}>Reserve Fund</span>
        </div>
        <span style={{ fontWeight: 700 }}>
          {formatCurrency(data.reserveFund)}
        </span>
      </div>

      {/* Visual Health Bar */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "#f1f5f9",
          height: "4px",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${data.healthScore}%`,
            background: "#10b981",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};
