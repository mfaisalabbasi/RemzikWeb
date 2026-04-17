import styles from "./partner.module.css";

export const PartnerSummary = ({ id }: { id: string }) => (
  <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
    <h2 style={{ margin: "0 0 1rem 0" }}>Partner: {id}</h2>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          TOTAL ASSETS
        </div>
        <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>45.2M SAR</div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>INTEGRATION</div>
        <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#059669" }}>
          Healthy
        </div>
      </div>
    </div>
  </div>
);
