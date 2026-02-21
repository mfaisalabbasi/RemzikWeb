"use client";

import React from "react";
import styles from "./Invest.module.css";

interface Props {
  amount: number;
  onClose: () => void;
}

export default function ModalSuccess({ amount, onClose }: Props) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalPanel}>
        <div className={styles.modalTitle}>Success!</div>
        <p className={styles.successText}>
          You invested <strong>SAR {amount.toLocaleString()}</strong>{" "}
          successfully.
        </p>
        <button className={styles.ctaPrimary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
