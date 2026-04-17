import React from "react";
import styles from "./Dashbaord.module.css";

export const PipelineSnapshot = () => (
  <div className={styles.sectionContainer}>
    <h3 style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#64748b" }}>
      RWA PIPELINE
    </h3>
    <div className={styles.dataRow}>
      <span>Under Due Diligence</span>
      <span style={{ fontWeight: 700 }}>4 Assets</span>
    </div>
    <div className={styles.dataRow}>
      <span>Awaiting Tokenization</span>
      <span style={{ fontWeight: 700 }}>2 Assets</span>
    </div>
  </div>
);
