"use client";

import React from "react";
import styles from "./secondary.module.css";

interface Props {
  message: string;
  onClose: () => void;
}

export default function TradeSuccessModal({ message, onClose }: Props) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle} style={{ color: "#0f5f3a" }}>
          Success!
        </div>
        <p className={styles.tradeSuccessMessage}>{message}</p>
        <button className={styles.ctaPrimary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
