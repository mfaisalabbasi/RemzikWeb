import React from "react";
import styles from "./Details.module.css";

interface TrustSignalsProps {
  funded: number;
  target: number;
  investors: number;
  risk: "Low" | "Moderate" | "High";
}

export default function TrustSignals({
  funded,
  target,
  investors,
  risk,
}: TrustSignalsProps) {
  const progress = Math.min((funded / target) * 100, 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <div className={styles.row}>
          <span>Funded</span>
          <span>SAR {funded.toLocaleString()}</span>
        </div>
        <div className={styles.rowMuted}>
          <span>Target</span>
          <span>SAR {target.toLocaleString()}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.row}>
          <span>Investors</span>
          <span>{investors}</span>
        </div>
        <div className={styles.row}>
          <span>Risk</span>
          <span>{risk}</span>
        </div>
        <div className={styles.riskTrack}>
          <div
            className={styles.riskIndicator}
            style={{
              left:
                risk === "Low" ? "10%" : risk === "Moderate" ? "50%" : "90%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
