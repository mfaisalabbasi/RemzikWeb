// secondary-market/TradeSuccessModal.tsx

"use client";

import React from "react";
import styles from "./secondary.module.css";

interface Props {
  message: string; // e.g., "You successfully sold 50 units!"
  onClose: () => void;
}

export default function TradeSuccessModal({ message, onClose }: Props) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>Success!</div>
        <p>{message}</p>
        <button className={styles.ctaPrimary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
