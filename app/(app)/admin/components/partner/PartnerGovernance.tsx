import styles from "./partner.module.css";

export const PartnerGovernance = () => (
  <div className={styles.card}>
    <h3>Compliance & KYC</h3>

    {/* Document List */}
    <div className={styles.dataRow}>
      <span>Business License</span>
      <button
        style={{
          border: "none",
          background: "none",
          color: "#2563eb",
          cursor: "pointer",
        }}
      >
        View
      </button>
    </div>
    <div className={styles.dataRow}>
      <span>UBO Declaration</span>
      <button
        style={{
          border: "none",
          background: "none",
          color: "#2563eb",
          cursor: "pointer",
        }}
      >
        View
      </button>
    </div>

    {/* Admin Action Workflow */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.5rem",
        marginTop: "1.5rem",
      }}
    >
      <button className={styles.btnAction} style={{ background: "#059669" }}>
        Approve
      </button>
      <button className={styles.btnAction} style={{ background: "#dc2626" }}>
        Reject
      </button>
    </div>

    <button
      className={styles.btnAction}
      style={{ background: "#64748b", marginTop: "0.5rem" }}
    >
      Request More Info
    </button>
  </div>
);
