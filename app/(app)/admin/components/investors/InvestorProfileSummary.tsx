import styles from "./Investor.module.css";

export const InvestorProfileSummary = ({ id }: { id: string }) => (
  <div className={styles.card} style={{ marginBottom: "1.5rem" }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 0.5rem 0" }}>Faisal A.</h2>
        <span className={styles.pillApproved}>Active</span>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>TOTAL AUM</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>12.5M SAR</div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
          LOCKED ASSETS
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#dc2626" }}>
          2.1M SAR
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>KYC EXPIRY</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>2027-05-12</div>
      </div>
    </div>
  </div>
);
