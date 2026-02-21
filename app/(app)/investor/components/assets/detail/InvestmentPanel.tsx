import React from "react";
import styles from "./Details.module.css";

interface InvestmentPanelProps {
  min: number;
  roi: number;
  tenure: number;
}

export default function InvestmentPanel({
  min,
  roi,
  tenure,
}: InvestmentPanelProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Invest in this Asset</div>

      <div className={styles.field}>
        <label>Minimum Investment</label>
        <input type="text" value={`SAR ${min.toLocaleString()}`} readOnly />
      </div>

      <div className={styles.field}>
        <label>Expected ROI</label>
        <input type="text" value={`${roi}%`} readOnly />
      </div>

      <div className={styles.field}>
        <label>Tenure</label>
        <input type="text" value={`${tenure} Months`} readOnly />
      </div>

      <button className={styles.cta}>Invest Now</button>
      <div className={styles.disclaimer}>*Terms & conditions apply.</div>
    </div>
  );
}
