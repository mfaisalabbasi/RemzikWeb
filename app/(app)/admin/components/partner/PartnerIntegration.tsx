import styles from "./partner.module.css";

export const PartnerIntegration = () => (
  <div className={styles.card}>
    <h3>Integration Health</h3>
    <div className={styles.dataRow}>
      <span style={{ color: "#64748b" }}>Webhook Status</span>
      <span className={styles.pill}>Operational</span>
    </div>
    <div className={styles.dataRow}>
      <span style={{ color: "#64748b" }}>Last Sync</span>
      <span>2 mins ago</span>
    </div>
    <button
      className={styles.btnAction}
      style={{ background: "#2563eb", marginTop: "1rem" }}
    >
      View API Logs
    </button>
  </div>
);
