import React from "react";
import styles from "./Dashbaord.module.css";

export const LiquidityMonitor = () => {
  const liquidityRatio = 75; // Percentage

  return (
    <div className={styles.sectionContainer}>
      <h3
        style={{ fontSize: "0.9rem", marginBottom: "1.5rem", color: "#64748b" }}
      >
        LIQUIDITY STATUS
      </h3>
      <div
        style={{
          marginBottom: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
          Available Reserves
        </span>
        <span style={{ fontSize: "0.8rem", color: "#10b981" }}>
          75M / 100M SAR
        </span>
      </div>
      <div
        style={{
          background: "#e2e8f0",
          height: "8px",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${liquidityRatio}%`,
            background: "#c5a059",
            height: "100%",
          }}
        />
      </div>
      <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "1rem" }}>
        Operational runway: 42 days at current burn rate.
      </p>
    </div>
  );
};
