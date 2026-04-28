"use client";
import styles from "./assets.module.css";

interface MarketMetricsProps {
  asset: any;
}

export const MarketMetrics = ({ asset }: MarketMetricsProps) => {
  const token = asset?.token;
  console.log("toek,", token);

  return (
    <div className={styles.card}>
      <h3>Token Market Metrics</h3>

      {token ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              TOKEN PRICE
            </div>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 700, color: "#10b981" }}
            >
              {Number(token.sharePrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              SAR
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              TOTAL SUPPLY
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {Number(token.totalShares).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
              Available: {Number(token.availableShares).toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Asset not yet tokenized.
            <br />
            Initialize ledger to see market data.
          </p>
        </div>
      )}
    </div>
  );
};
