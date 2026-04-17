import styles from "./assets.module.css";
export const AssetValuation = () => (
  <div className={styles.card}>
    <h3>Appraisal Audit</h3>
    <button
      style={{
        border: "none",
        background: "none",
        color: "#2563eb",
        cursor: "pointer",
      }}
    >
      View Latest Report
    </button>
  </div>
);
