import styles from "./assets.module.css";
export const AssetLifecycleTracker = () => (
  <div className={styles.card}>
    <h3>Tokenization Progress</h3>
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "#059669",
          borderRadius: "4px",
        }}
      ></div>
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "#059669",
          borderRadius: "4px",
        }}
      ></div>
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "#e2e8f0",
          borderRadius: "4px",
        }}
      ></div>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.7rem",
        marginTop: "0.5rem",
        color: "#64748b",
      }}
    >
      <span>ORIGINATED</span>
      <span>KYC VERIFIED</span>
      <span>TOKENIZED</span>
    </div>
  </div>
);
