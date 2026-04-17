import styles from "./assets.module.css";

export const AssetSummary = ({ id }: { id: string }) => (
  <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
    <h3>Asset Origination Context</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>POSTED BY</div>
        <div style={{ fontSize: "1rem", fontWeight: 600 }}>
          Global Real Estate Corp
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>POSTED ON</div>
        <div style={{ fontSize: "1rem", fontWeight: 600 }}>2026-04-10</div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>PROGRESS</div>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f59e0b" }}>
          Awaiting Review
        </div>
      </div>
    </div>
  </div>
);
