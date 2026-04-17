import styles from "./assets.module.css";

export const MarketMetrics = () => (
  <div className={styles.card}>
    <h3>Token Market Metrics</h3>
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
    >
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>TOKEN PRICE</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>12.50 SAR</div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          TOTAL SUPPLY
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>1,000,000</div>
      </div>
    </div>
  </div>
);
