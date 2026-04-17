import styles from "./assets.module.css";

export const AssetGovernance = () => (
  <div className={styles.card}>
    <h3>Admin Control Workflow</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <button className={styles.btnAction} style={{ background: "#059669" }}>
        Approve & Approve KYC
      </button>
      <button className={styles.btnAction} style={{ background: "#2563eb" }}>
        Initialize Tokenization
      </button>
      <button className={styles.btnAction} style={{ background: "#dc2626" }}>
        Reject Asset
      </button>
    </div>
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>STATUS LOG</div>
      <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
        • 2026-04-12: Document Verified
        <br />• 2026-04-10: Asset Posted by Partner
      </div>
    </div>
  </div>
);
