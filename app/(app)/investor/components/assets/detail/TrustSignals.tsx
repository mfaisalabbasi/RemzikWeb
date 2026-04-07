"use client";

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
  // ✅ FIX: Force conversion to Numbers to handle Backend String responses
  const fundedNum = Number(funded) || 0;
  const targetNum = Number(target) || 1; // Prevent division by zero
  const investorsNum = Number(investors) || 0;

  // Calculate progress percentage
  const progress = Math.min((fundedNum / targetNum) * 100, 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <div className={styles.row}>
          <span>Funded</span>
          <strong>SAR {fundedNum.toLocaleString()}</strong>
        </div>
        <div className={styles.rowMuted}>
          <span style={{ fontSize: 10 }}>TARGET </span>
          <span style={{ color: "green" }}>{targetNum.toLocaleString()}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={styles.percentageText}>{progress.toFixed(1)}% Funded</p>
      </div>

      <div className={styles.block}>
        <div className={styles.row}>
          <span>Investors</span>
          <strong>{investorsNum.toLocaleString()}</strong>
        </div>
        <div className={styles.row}>
          <span>Risk Level</span>
          <span className={styles[`risk${risk}`]}>{risk}</span>
        </div>
        <div className={styles.riskTrack}>
          <div
            className={styles.riskIndicator}
            style={{
              left:
                risk === "Low" ? "10%" : risk === "Moderate" ? "50%" : "90%",
              backgroundColor:
                risk === "Low"
                  ? "#16a34a"
                  : risk === "Moderate"
                    ? "#f59e0b"
                    : "#ef4444",
            }}
          />
        </div>
      </div>
    </div>
  );
}
